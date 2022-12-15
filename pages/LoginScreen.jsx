import { View, Text, Button } from 'react-native';

function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Log me in Screen</Text>
      <Button
        title="Log IN"
        onPress={() => navigation.navigate('Account')}
      ></Button>
    </View>
  );
}
export default LoginScreen;
