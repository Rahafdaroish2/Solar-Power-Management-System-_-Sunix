module.exports = {
  expo: {
    name: 'SUNIX',
    slug: 'sunix',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    ios: { supportsTablet: true },
    android: {},
    plugins: [
      ['expo-build-properties', { ios: { enableSceneSupport: true } }],
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow SUNIX to attach solar system images.',
          cameraPermission: 'Allow SUNIX to photograph your solar system.',
          microphonePermission: false,
        },
      ],
      'expo-document-picker',
      'expo-video',
    ],
  },
};
