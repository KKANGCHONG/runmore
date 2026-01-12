const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 웹 빌드에서 react-native-maps를 완전히 제외
  // 플랫폼별 파일 확장자(.web.tsx)를 사용하므로 실제로는 필요 없지만,
  // 안전을 위해 alias로 빈 모듈로 대체
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-maps': false,
  };

  return config;
};
