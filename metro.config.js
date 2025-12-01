// Metro configuration for Expo with SVG support
// See: https://docs.expo.dev/guides/using-svg-images/

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname);

// Use react-native-svg-transformer for .svg files
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// Treat .svg as source files, not static assets
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts.push("svg");

module.exports = config;


