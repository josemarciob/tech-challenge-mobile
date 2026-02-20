import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { House, Trophy, ShoppingBag, Leaf } from "phosphor-react-native";

import Home from "../screens/Home"; 
import Conquistas from "../screens/Conquistas";
import Loja from "../screens/Loja";
import Fazenda from "../screens/Fazenda";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Conquistas" 
        component={Conquistas} 
        options={{ tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Loja" 
        component={Loja} 
        options={{ tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Fazenda" 
        component={Fazenda} 
        options={{ tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} /> }} 
      />
    </Tab.Navigator>
  );
}