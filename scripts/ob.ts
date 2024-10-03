/**
 * @permissions read, write, net, env=.dev.vars
 */
import { ulid } from "jsr:@std/ulid";
import { Command } from "jsr:@cliffy/command@1.0.0-rc.5";
import { basename, dirname, extname, join } from "jsr:@std/path";
import { move } from "jsr:@std/fs";
import { extractYaml } from "jsr:@std/front-matter";
import { contentType } from "jsr:@std/media-types";
import { isULID, slugify } from "../src/utils.ts";
import { crypto } from "jsr:@std/crypto";
import { stringify } from "jsr:@std/yaml";

async function extractH1(path: string): Promise<string> {
  using file = await Deno.open(path, { read: true });

  let content = "";

  const buf = new Uint8Array(100);
  while (true) {
    const bytesRead = await file.read(buf);
    if (bytesRead === null) break;

    content += new TextDecoder().decode(buf);

    const h1Match = content.match(/^# (.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }

    if (content.length > 1000) break;
  }

  return "";
}

async function updateFrontmatter(path: string, fm: Record<string, any>) {
  let content = await Deno.readTextFile(path);
  content = content.replace(/^---[\s\S]*?---\n/, '');

  await Deno.writeTextFile(path, "---\n" + stringify(fm, { schema: "extended" }) + "---\n" + content);
}

async function publishNote(path: string) {
  const file = basename(path, ".md");
  if (!isULID(file)) {
    throw new Error("File must have a ULID name to be published");
  }

  const content = await Deno.readTextFile(path);
  let fm: Record<string, any> = {};
  if (content.startsWith("---")) {
    fm = extractYaml(content).attrs;
  }
  if (fm.published instanceof Date) {
    fm.published = fm.published.toISOString().split("T")[0];
  }
  if (fm.updated instanceof Date) {
    fm.updated = fm.updated.toISOString().split("T")[0];
  }
  // Convert draft to stage
  // TODO: Remove this when all notes are migrated
  if (fm.draft) {
    fm.stage = 'draft';
    delete fm.draft;
    await updateFrontmatter(path, fm);
  }
  if (!fm.homepage) {
    const today = new Date().toISOString().split("T")[0];
    if (!fm.published) {
      fm.stage = 'draft';
      fm.published = today;
      await updateFrontmatter(path, fm);
    } else if (fm.published !== today) {
      fm.updated = today;
      await updateFrontmatter(path, fm);
    }
    if (fm.draft === false) {
      delete fm.draft;
      await updateFrontmatter(path, fm);
    }
  }

  fm.title ??= await extractH1(path);

  return fetch(
    `${Deno.env.get("SITE")}/api/notes/${file}${
      fm ? "?" + new URLSearchParams(fm).toString() : ""
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${Deno.env.get("PUBLISH_KEY")}`,
      },
      body: content,
    }
  ).then(async (res) =>
    res.status < 400
      ? console.log("Published!")
      : console.error("Error publishing", res.status + " " + (await res.text()))
  );
}

async function publishAsset(path: string) {
  // Calculate the SHA256 hash of the file
  const hash = await crypto.subtle
    .digest("SHA-256", await Deno.readFile(path))
    .then((b) => new Uint8Array(b))
    .then(Array.from)
    .then((a) => a.map((b: any) => b.toString(16).padStart(2, "0")).join(""));

  // POST /api/assets/:hash?path=:path (where :path is `assets/...`)
  return fetch(
    `${Deno.env.get("SITE")}/api/assets/${hash}${extname(
      path
    )}?${new URLSearchParams({
      path: slugify(path.substring(path.lastIndexOf("assets"))),
    }).toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": contentType(path) || "application/octet-stream",
        Authorization: `Bearer ${Deno.env.get("PUBLISH_KEY")}`,
      },
      body: await Deno.readFile(path),
    }
  ).then(async (res) =>
    res.status < 400
      ? console.log("Published!")
      : console.error("Error publishing", res.status + " " + (await res.text()))
  );
}

const publish = new Command()
  .description("Publishes notes or assets")
  .arguments("<path:string>")
  .action((_, path) => {
    return path.endsWith(".md") ? publishNote(path) : publishAsset(path);
  });

const rename = new Command()
  .description("Renames a note with a ULID")
  .arguments("<path:string>")
  .action(async (_, path) => {
    // Ignore non-markdown files
    if (!path.endsWith(".md")) return;
    const file = basename(path, ".md");
    const dir = dirname(path);
    const targetDir = "logs";
    if (/\d{4}/.test(file)) {
      if (dir.endsWith(targetDir)) return;
      const targetFile = join(dir, targetDir, `${file}.md`);
      await move(path, targetFile, {
        overwrite: false,
      });
    }
    if (!isULID(file)) {
      return Deno.rename(path, join(dir, `${ulid()}.md`));
    }
  });

await new Command()
  .name("ob")
  .version("0.0.1")
  .description("Helper script for Obsidian")
  .command("rename", rename)
  .command("publish", publish)
  .parse(Deno.args);
