import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/BottomTabs';
import { Text } from "react-native";
import { useFonts } from "expo-font"

// Text 기본 폰트 오버라이드 (모든 Text에 Pretendard-Regular 적용)
const defaultRender = Text.render;
Text.render = function render(props, ref) {
  return defaultRender.call(this, {
    ...props,
    style: [{ fontFamily: "Pretendard-Regular" }, props.style],
  }, ref);
};


export default function App() {

  const [fontsLoaded] = useFonts({
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

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
