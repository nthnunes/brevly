import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  clean: true,
  format: "esm",
  outDir: "dist",
  esbuildOptions: (options) => {
    options.loader = {
      ...options.loader,
      '.sql': 'text'
    }
  }
});
