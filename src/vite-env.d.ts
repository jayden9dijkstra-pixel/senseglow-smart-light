/// <reference types="vite/client" />

// vite-imagetools query imports (e.g. "?w=600;1024&format=webp&as=srcset")
declare module "*&format=webp" {
  const src: string;
  export default src;
}
declare module "*&as=srcset" {
  const src: string;
  export default src;
}
declare module "*?imagetools" {
  const src: string;
  export default src;
}
