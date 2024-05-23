const { override, addWebpackPlugin } = require("customize-cra");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = override(
  addWebpackPlugin(
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: "./src/custom-service-worker.js", // Custom service worker file
      swDest: "service-worker.js",
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
    })
  )
);
