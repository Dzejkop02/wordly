/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AllSetsNavigator from './navigation/AllSetsNavigator';
import CustomSetsNavigator from './navigation/CustomSetsNavigator';
import StatsNavigator from './navigation/StatsNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          name="Statystyki"
          component={StatsNavigator}
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

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });
