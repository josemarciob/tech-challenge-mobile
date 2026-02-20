import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// src/navigation/AppStack.tsx

import AppTabs from "./AppTabs";
import Perfil from "../screens/Perfil";
import AdminScreen from "../screens/Admin"; 
import CreatePost from "../screens/CreatePost";
import EditPostScreen from "../screens/EditPost"; 
import PostDetail from "../screens/PostDetail";
import UserDetail from "../screens/UserDetail";
import PostsList from "../screens/PostsList";

export type AppStackParamList = {
  Tabs: undefined;
  Perfil: { userId?: number } | undefined; 
  AdminScreen: undefined;
  PostsList: undefined;
  CreatePost: undefined;
  EditPost: { id: number }; 
  PostDetail: { id: number }; 
  UserDetail: { id: number }; 
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: '#FFFFFF' }
      }}
    >
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