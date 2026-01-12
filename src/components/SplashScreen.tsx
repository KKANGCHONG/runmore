import React from 'react';
import { View, Image, StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
    }),
  },
});
