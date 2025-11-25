import { createStackNavigator } from '@react-navigation/stack';
import HomeTab from '../tabs/Home/HomeTab';
import RunTab from '../tabs/Run/RunTab';
import RunCompleteScreen from '../tabs/Run/RunCompleteScreen';
import ShopTab from '../tabs/Shop/ShopTab';
import CalendarTab from '../tabs/CalendarTab';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeTab} />
      <Stack.Screen name="Run" component={RunTab} />
      <Stack.Screen name="RunComplete" component={RunCompleteScreen} />
      <Stack.Screen name="Shop" component={ShopTab} />
      <Stack.Screen name="Calendar" component={CalendarTab} />
    </Stack.Navigator>
  );
}
