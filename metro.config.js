const { getDefaultConfig } = require("metro-config");

/** Asset extensions to bundle inside the app... */
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: [assetExts, "txt", "xml", "png", "jpg", "pb", "ttf", "tflite"],
      sourceExts: [
        ...sourceExts,
        "txt",
        "xml",
        "png",
        "jpg",
        "pb",
        "ttf",
        "tflite",
      ],
    },
  };
})();
