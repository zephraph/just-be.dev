declare global {
  const __ASTRO_CONFIG_PATH__: string;
}

type Renderer = import("./").Renderer;
declare namespace App {
  interface Locals extends Renderer {}
}

export {};
