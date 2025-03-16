import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AllSetsScreen from '../screens/AllSetsScreen';
import LearningScreen from '../screens/LearningScreen';

const AllSetsStack = createStackNavigator();

export default function AllSetsNavigator() {
  return (
    <AllSetsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
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
