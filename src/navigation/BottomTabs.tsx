import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../tabs/HomeTab';
import RunTab from '../tabs/RunTab';
import ShopTab from '../tabs/ShopTab';
import { Ionicons } from '@expo/vector-icons';
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
         headerShown: false, 
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Run') {
            iconName = focused ? 'walk' : 'walk-outline'; // 러닝 탭
          } else if (route.name === 'Shop') {
            iconName = focused ? 'cart' : 'cart-outline'; // 상점 탭
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} options={{ title: '홈' }} />
      <Tab.Screen name="Run" component={RunTab} options={{ title: '러닝' }} />
      <Tab.Screen name="Shop" component={ShopTab} options={{ title: '상점' }} />
    </Tab.Navigator>
  );
}
