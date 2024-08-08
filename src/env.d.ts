/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type Renderer = import("@plugins/locals-markdown").Renderer;

declare namespace App {
  interface Locals extends Runtime, Renderer {}
}
