import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './components/Auth';
import { supabase } from './supabase';
import AccountScreen from './pages/AccountScreen';
import AppointmentScreen from './pages/AppointmentScreen';
import { setNotificationHandler } from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [session, setSession] = React.useState(null);
  const [isAppReady, setIsAppReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);
  if (!isAppReady) {
    return null;
  }

  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator>
        {session && session.user ? (
          <Stack.Screen
            key={session.user.id}
            name="Account"
            component={AccountScreen}
            initialParams={{ session }}
          />
        ) : (
          <Stack.Screen name="LogIn" component={Auth} />
        )}
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
