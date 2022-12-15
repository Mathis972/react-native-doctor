import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './components/Auth';
import { supabase } from './supabase';
import AccountScreen from './pages/AccountScreen';
import AppointmentScreen from './pages/AppointmentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ? (
          <Stack.Screen
            key={session.user.id} 
            name="Account"
            component={AccountScreen}
            initialParams={{session}}
          />
        ) : (
          <Stack.Screen name="LogIn"  component={Auth} />
        )}
        <Stack.Screen
            name="AppointmentScreen"
            component={AppointmentScreen}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
