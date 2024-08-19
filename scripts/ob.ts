/**
 * @permissions read, write, net, env=.dev.vars
 */
import { ulid } from "jsr:@std/ulid";
import { Command } from "jsr:@cliffy/command@1.0.0-rc.5";
import { basename, dirname, join } from "jsr:@std/path";
import { move } from "jsr:@std/fs";
import { extractYaml } from "jsr:@std/front-matter";

// async function write(text: string) {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(text);

//   // Write the data to stdout without a newline
//   await Deno.stdout.write(data);
// }

function isULID(str: string) {
  // ULID regex to validate the format
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  return ulidRegex.test(str);
}

const rename = new Command()
  .description("Renames a note with a ULID")
  .arguments("<path:string>")
  .action(async (_, path) => {
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

const publish = new Command()
  .description("Publishes a note")
  .arguments("<path:string>")
  .action(async (_, path) => {
    const file = basename(path, ".md");
    if (!isULID(file)) {
      throw new Error("File must have a ULID name to be published");
    }
    const content = await Deno.readTextFile(path);
    let fm = {};
    if (content.startsWith("---")) {
      fm = extractYaml(content).attrs;
    }
    return fetch(
      `http://localhost:4321/api/publish/${file}${
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
        : console.error(
            "Error publishing",
            res.status + " " + (await res.text())
          )
    );
  });

await new Command()
  .name("ob")
  .version("0.0.1")
  .description("Helper script for Obsidian")
  .command("rename", rename)
  .command("publish", publish)
  .parse(Deno.args);
