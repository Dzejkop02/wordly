/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

// Ekrany – zastąp przykładowe komponenty własnymi implementacjami
import AllSetsScreen from './screens/AllSetsScreen';
import LearningScreen from './screens/LearningScreen';
import CustomSetsScreen from './screens/CustomSetsScreen';
import AddSetScreen from './screens/AddSetScreen';
import EditSetScreen from './screens/EditSetScreen';
import StatsScreen from './screens/StatsScreen';
import { Text } from "react-native";

const AllSetsStack = createStackNavigator();
const CustomSetsStack = createStackNavigator();
const StatsStack = createStackNavigator();

function AllSetsNavigator() {
  return (
    <AllSetsStack.Navigator>
      <AllSetsStack.Screen
        name="AllSets"
        component={AllSetsScreen}
        options={{title: 'Wszystkie zestawy'}}
      />
      <AllSetsStack.Screen
        name="Learning"
        component={LearningScreen}
        options={{title: 'Nauka przez pisanie'}}
      />
    </AllSetsStack.Navigator>
  );
}

function CustomSetsNavigator() {
  return (
    <CustomSetsStack.Navigator>
      <CustomSetsStack.Screen
        name="CustomSets"
        component={CustomSetsScreen}
        options={{title: 'Własne zestawy'}}
      />
      <CustomSetsStack.Screen
        name="AddSet"
        component={AddSetScreen}
        options={{title: 'Dodaj zestaw'}}
      />
      <CustomSetsStack.Screen
        name="EditSet"
        component={EditSetScreen}
        options={{title: 'Edytuj zestaw'}}
      />
    </CustomSetsStack.Navigator>
  );
}

function StatsNavigator() {
  return (
    <StatsStack.Navigator>
      <StatsStack.Screen
        name="Stats"
        component={StatsScreen}
        options={{title: 'Statystyki i ustawienia'}}
      />
    </StatsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // <Text>Test</Text>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Wszystkie zestawy" component={AllSetsNavigator} />
        <Tab.Screen name="Własne zestawy" component={CustomSetsNavigator} />
        <Tab.Screen name="Statystyki" component={StatsNavigator} />
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

