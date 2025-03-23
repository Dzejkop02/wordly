/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AllSetsNavigator from './navigation/AllSetsNavigator';
import CustomSetsNavigator from './navigation/CustomSetsNavigator';
import StatsScreen from './screens/StatsScreen';
import SplashScreen from 'react-native-splash-screen';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1a3b45',
  },
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#528585',
          tabBarInactiveTintColor: '#ffffff',
          tabBarStyle: {
            backgroundColor: '#112c2c',
            height: 60,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
        }}>
        <Tab.Screen
          name="Wszystkie zestawy"
          component={AllSetsNavigator}
          options={{
            tabBarIcon: ({size, focused, color}) => {
              return (
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Własne zestawy"
          component={CustomSetsNavigator}
          options={{
            tabBarIcon: ({size, focused, color}) => {
              return (
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Statystyki i ustawienia"
          component={StatsScreen}
          options={{
            tabBarIcon: ({size, focused, color}) => {
              return <Ionicons name="person" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
