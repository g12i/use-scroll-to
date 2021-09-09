// vite.config.js
const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  root: path.resolve(__dirname, "./demo"),
  base: "/use-scroll-to",
});
