import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { enableScreens } from 'react-native-screens'

import LoginScreen from '../screens/Login'
import PostsList from '../screens/PostsList'
import PostDetail from '../screens/PostDetail'
import CreatePost from '../screens/CreatePost'
enableScreens(); 

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Atividades" component={PostsList} />
        <Stack.Screen name="DetalhesAtividade" component={PostDetail} />
        <Stack.Screen name="CriarAtividade" component={CreatePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
