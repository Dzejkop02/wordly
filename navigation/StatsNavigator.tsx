import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StatsScreen from '../screens/StatsScreen';

const StatsStack = createStackNavigator();

export default function StatsNavigator() {
  return (
    <StatsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <StatsStack.Screen
        name="Stats"
        component={StatsScreen}
        options={{title: 'Statystyki i ustawienia'}}
      />
    </StatsStack.Navigator>
  );
}
