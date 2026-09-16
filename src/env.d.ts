/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SHIRTSCANNER_BE: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
