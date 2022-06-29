import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Stack =createNativeStackNavigator();

const AuthStack = () => {
    const { colors } = useTheme();
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if(value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
        GoogleSignin.configure({
            webClientId: '361557971612-8296tb6qbqr5f5qjc0d6uodr3a1susks.apps.googleusercontent.com',
        });
    }, []);

    if(isFirstLaunch == null) {
        return null;
      } else if (isFirstLaunch == true) {
        routeName = 'Onboarding';
      } else {
        routeName = 'Login';
      }

    return (
        <Stack.Navigator initialRouteName={routeName}>
            <Stack.Screen name='Onboarding' component={OnboardingScreen} options={{headerShown: false}} />
            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name='Signup' component={SignupScreen} 
                options={({navigation}) => ({
                    title: '',
                    headerStyle: {
                        // backgroundColor: '#f9fafd',
                        backgroundColor: colors.background
                    },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <View>
                            <FontAwesome.Button 
                                name='long-arrow-left'
                                size={25}
                                // backgroundColor= '#f9fafd'
                                backgroundColor={colors.background}
                                // color='#333'
                                color={colors.text}
                                onPress={() => navigation.navigate('Login')}
                                // style={{color: colors.text}}
                            />
                        </View>
                    )
                })}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;