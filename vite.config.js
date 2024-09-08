import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // esbuild: {
  //   supported: {
  //     "top-level-await": true, //browsers can handle top-level-await features
  //   },
  // },

  resolve: {},
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        details: resolve("./src/html/details.html"),
        contact: resolve("./src/html/contact.html"),
      },
    },
  },
});
