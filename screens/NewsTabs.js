import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';

import GeneralNews from '../screens/NewsTabs/GeneralNews';
import TechNews from '../screens/NewsTabs/TechNews';
import BusinessNews from '../screens/NewsTabs/BusinessNews';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const NewsTabs = () => {
  return (
    // <View>
    // <StatusBar 
    //   backgroundColor={'#009387'}
    // />
    <Tab.Navigator 
        screenOptions={{
            tabBarStyle: {backgroundColor: '#009387'},
            tabBarLabelStyle: {color: '#FFF'},
            tabBarBounces: true,
            tabBarIndicatorStyle: {backgroundColor: '#006058', height: '100%'},
        }}
    >
        <Tab.Screen 
            name='General' component={GeneralNews} 
            options={{
                
            }}
        />
        <Tab.Screen name='Technology' component={TechNews} />
        <Tab.Screen name='Business' component={BusinessNews} />
    </Tab.Navigator>
    // </View>
  )
}

export default NewsTabs

const styles = StyleSheet.create({})