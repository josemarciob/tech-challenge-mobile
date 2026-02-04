import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppTabs from "./AppTabs";
import Perfil from "../screens/Perfil";
import AdminScreen from "../screens/AdminScreen";
import CreatePost from "../screens/CreatePost";
import EditPostScreen from "../screens/EditPostScreen";
import PostDetail from "../screens/PostDetail";
import UserDetail from "../screens/UserDetail";
import PostsList from "../screens/PostsList";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="PostsList" component={PostsList} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      <Stack.Screen name="UserDetail" component={UserDetail} />
    </Stack.Navigator>
  );
}