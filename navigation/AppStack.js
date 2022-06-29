import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name='RN Social'
            component={HomeScreen}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    // color: '#2e64e5',
                    color: useTheme().colors.text,
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },
                headerShadowVisible: false,
                headerRight: () => (
                    <View style={{marginRight: 10}}>
                        <FontAwesome5.Button
                            style={{paddingLeft: 18}}
                            name='plus'
                            size={22}
                            backgroundColor= '#fff'
                            color='#2e64e5'
                            onPress={() => navigation.navigate('AddPost')}
                        />
                    </View>
                ),
            }}
        />
        <Stack.Screen 
            name='AddPost'
            component={AddPostScreen}
            options={{
                title: '',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#2e64e515',
                },
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                // headerBackImage: () => (
                //     <View style={{marginLeft: 15, marginTop: 15}}>
                //         <Ionicons name='arrow-back' size={25} color='#2e64e5' />
                //     </View>
                // ),
            }}
        />
        <Stack.Screen 
            name='HomeProfile'
            component={ProfileScreen}
            options={{
                title: 'Profile',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: useTheme().colors.background,
                },
                headerShadowVisible: false,
                headerBackTitleVisible: false,
            }}
        />
    </Stack.Navigator>
);

const MessagesStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name='Messages' component={MessagesScreen} />
        <Stack.Screen 
            name='Chat'
            component={ChatScreen}
            options= {({route}) => ({
                title:route.params.userName,
                headerBackTitleVisible: false,
            })}
        />
    </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name='Profile'
            component={ProfileScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name='EditProfile'
            component={EditProfileScreen}
            options={{
                // headerShown: false,
                headerTitle: 'Edit Profile',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: useTheme().colors.background,
                },
                headerShadowVisible: false
            }}
        />
    </Stack.Navigator>
);

const AppStack = () => {

    const setTabBarStyle =(route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        return {display: routeName=='Chat' || routeName=='AddPost' ? 'none' : 'flex'}
    };

    return (
        <Tab.Navigator
            screenOptions={{
                activeTintColor: '#2e64e5',
            }}
        >
            <Tab.Screen
                name='Home'
                component={FeedStack}
                options={({route}) => ({
                    tabBarLabel: 'Home',
                    tabBarStyle: setTabBarStyle(route),
                    // tabBarVisible: route.state && route.state.index === 0,
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons 
                            name='home-outline'
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false
                })}
            />
            <Tab.Screen 
                name='Messages'
                component={MessagesStack}
                options={({route}) => ({
                    tabBarStyle: setTabBarStyle(route),
                    tabBarIcon: ({color, size}) => (
                        <Ionicons 
                            name='chatbox-ellipses-outline'
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false
                })}
            />
            <Tab.Screen 
                name='Profile'
                component={ProfileStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name='person-outline' color={color} size={size} />
                    ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};

export default AppStack;

const styles = StyleSheet.create({});