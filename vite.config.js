import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";                                                                                                                                                                                                                                                                                                                                                                                                                                            import "./public/logo.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  envDir: rootDir,
  publicDir: path.resolve(rootDir, "public"),
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  build: {
    target: "es2020",
    outDir: path.resolve(rootDir, "server/dist/client"),
    emptyOutDir: true,
  },
  envPrefix: "VITE_",
});
