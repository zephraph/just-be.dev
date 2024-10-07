/**
 * Run by issuing `deno run -A scripts/purge-syntax-kv.ts` from the root of the repo.
 *
 * This script will delete all keys in the KV_HIGHLIGHT binding that do not start with the current syntax version.
 */

import * as toml from "jsr:@std/toml";

const wranglerToml = await Deno.readTextFile("./wrangler.toml");
const config = toml.parse(wranglerToml) as { vars: { SYNTAX_VERSION: string } };
const SYNTAX_VERSION = config.vars.SYNTAX_VERSION;

const listCommand = new Deno.Command("wrangler", {
  args: ["kv:key", "list", "--binding", "KV_HIGHLIGHT"],
});

const listResult = await listCommand.output();
const keys = JSON.parse(new TextDecoder().decode(listResult.stdout).trim()).map(
  (k) => k.name
);

const keysToDelete = keys.filter(
  (key) => !key.startsWith(`${SYNTAX_VERSION}:`)
);

if (keysToDelete.length > 0) {
  const deleteKeysJson = JSON.stringify(keysToDelete);
  await Deno.writeTextFile("delete-keys.json", deleteKeysJson);

  console.log(`Found ${keysToDelete.length} keys to delete. Deleting...`);

  const deleteCommand = new Deno.Command("wrangler", {
    args: [
      "kv",
      "bulk",
      "delete",
      "--binding",
      "KV_HIGHLIGHT",
      "delete-keys.json",
    ],
  });

  const deleteResult = await deleteCommand.output();

  if (deleteResult.success) {
    console.log("Keys deleted successfully.");
  } else {
    console.error(
      "Failed to delete keys:",
      new TextDecoder().decode(deleteResult.stderr)
    );
  }

  // Clean up the temporary file
  await Deno.remove("delete-keys.json");
} else {
  console.log("No keys to delete.");
}
