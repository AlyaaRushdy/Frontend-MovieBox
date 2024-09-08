import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // esbuild: {
  //   supported: {
  //     "top-level-await": true, //browsers can handle top-level-await features
  //   },
  // },

  resolve: {
    alias: {
      src: "./src",
    },
  },
});
