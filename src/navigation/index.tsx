import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import Login from "../screens/Login";
import Register from "../screens/RegisterScreen";
import AppStack from "./AppStack";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user, loading } = useAuth();

  const onReady = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
