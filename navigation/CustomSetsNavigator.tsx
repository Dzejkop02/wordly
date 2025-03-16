import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CustomSetsScreen from '../screens/CustomSetsScreen';
import AddSetScreen from '../screens/AddSetScreen';
import EditSetScreen from '../screens/EditSetScreen';

const CustomSetsStack = createStackNavigator();

export default function CustomSetsNavigator() {
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
