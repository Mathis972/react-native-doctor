import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './components/Auth';
import { supabase } from './supabase';
import AccountScreen from './pages/AccountScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
