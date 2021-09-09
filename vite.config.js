// vite.config.js
const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/useScrollTo.ts"),
      name: "useScrollTo",
      fileName: (format) => `use-scroll-to-2.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "bezier-easing"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "bezier-easing": "BezierEasing",
        },
      },
    },
  },
});
