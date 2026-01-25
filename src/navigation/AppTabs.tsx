import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Trophy, ShoppingBag, Leaf } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import Conquistas from "../screens/Conquistas";
import Loja from "../screens/Loja";
import Fazenda from "../screens/Fazenda";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Conquistas"
        component={Conquistas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Trophy color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Loja"
        component={Loja}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Fazenda"
        component={Fazenda}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Leaf color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
