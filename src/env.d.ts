/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SHIRTSCANNER_BE: string | undefined;
  readonly PUBLIC_POSTHOG_TOKEN: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
