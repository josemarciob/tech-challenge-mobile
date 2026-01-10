import { NavigationContainer } from "@react-navigation/native"; 
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

import LoginScreen from "../screens/Login";
import PostsList from "../screens/PostsList";
import PostDetail from "../screens/PostDetail";
import CreatePost from "../screens/CreatePost";
import EditPostScreen from "../screens/EditPostScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import Perfil from "../screens/Perfil";
import AdminScreen from "../screens/AdminScreen";
import UserDetail from "../screens/UserDetail";

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Atividades" component={PostsList} />
        <Stack.Screen name="Detalhes Atividade" component={PostDetail} />
        <Stack.Screen name="Criar Atividade" component={CreatePost} />
        <Stack.Screen name="Edite Atividade" component={EditPostScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="UserDetail" component={UserDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
