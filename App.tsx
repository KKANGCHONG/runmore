import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // [추가] Stack Navigator
import { useFonts } from "expo-font";

import AppNavigator from './src/navigation/BottomTabs';
import AppointmentCreateScreen from './src/tabs/Calendar/AppointmentCreateScreen';
import CustomSplashScreen from './src/components/SplashScreen';
import TotalRecordScreen from "./src/tabs/Calendar/TotalRecordScreen";

// Stack Navigator 생성
const Stack = createNativeStackNavigator();

// Text 기본 폰트 오버라이드
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
        if (fontsLoaded || fontError) {
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

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {/* [수정] Stack Navigator로 감싸기 */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          {/* 1. 메인 탭 화면 (홈, 캘린더 등) */}
          <Stack.Screen name="MainTabs" component={AppNavigator} />
          
          {/* 2. 새로 추가한 약속 생성 화면 (탭 위에 덮어씌워짐) */}
          <Stack.Screen name="AppointmentCreate" component={AppointmentCreateScreen} />
          <Stack.Screen name="TotalRecord" component={TotalRecordScreen} options={{ headerShown: false }} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}