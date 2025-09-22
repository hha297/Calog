const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// Remove svg from assetExts, add svg to sourceExts
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

// SVG transformer
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

const config = mergeConfig(defaultConfig, {
        //   Add custom config here
});

module.exports = withNativeWind(config, { input: './global.css' });
