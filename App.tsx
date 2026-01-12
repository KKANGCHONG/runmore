import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/BottomTabs';
import { Text, View } from "react-native";
import { useFonts } from "expo-font"
import { useEffect, useState } from 'react';
import CustomSplashScreen from './src/components/SplashScreen';

// Text 기본 폰트 오버라이드 (모든 Text에 Pretendard-Regular 적용)
const defaultRender = Text.render;
Text.render = function render(props, ref) {
  return defaultRender.call(this, {
    ...props,
    style: [{ fontFamily: "Pretendard-Regular" }, props.style],
  }, ref);
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Black": require("./assets/fonts/Pretendard-Black.otf"),
    "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-ExtraBold": require("./assets/fonts/Pretendard-ExtraBold.otf"),
    "Pretendard-ExtraLight": require("./assets/fonts/Pretendard-ExtraLight.otf"),
    "Pretendard-Light": require("./assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("./assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Thin": require("./assets/fonts/Pretendard-Thin.otf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // 폰트가 로드될 때까지 대기
        if (fontsLoaded || fontError) {
          // 최소 1초 동안 스플래시 표시
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setShowSplash(false);
        }
      } catch (e) {
        console.warn(e);
        setShowSplash(false);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  // 스플래시 화면 표시 중
  if (showSplash) {
    return <CustomSplashScreen />;
  }

  // 앱 로드 완료
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}
