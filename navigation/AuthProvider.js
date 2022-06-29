import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { EventRegister } from 'react-native-event-listeners';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    // const [isLoading, setIsLoading] = useState(true);
    // const [userToken, setUserToken] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    console.log('Email : ', email, password);
                    if(email == (undefined || '') || password == (undefined || '')){
                        
                        Alert.alert(
                            'Empty Fields',
                            'Email or Password should not be empty.'
                        );
                    } else{
                        try {
                            await auth().signInWithEmailAndPassword(email,password);
                        } catch (error) {
                            console.log('Login Error : ',error);
                            Alert.alert(
                                'User Not Found',
                                'Email or Password is incorrect'
                            )
                        }
                    }
                    
                },
                googleLogin: async () => {
                    try {
                        // Get the users ID token
                        const { idToken } = await GoogleSignin.signIn();

                        // Create a Google credential with the token
                        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                        // Sign-in the user with the credential
                        return auth().signInWithCredential(googleCredential);
                    } catch (error) {
                        console.log(error);
                    }
                },
                fbLogin: async () => {
                    try {
                        // Attempt login with permissions
                        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                        if (result.isCancelled) {
                            throw 'User cancelled the login process';
                        }

                        // Once signed in, get the users AccesToken
                        const data = await AccessToken.getCurrentAccessToken();

                        if (!data) {
                            throw 'Something went wrong obtaining access token';
                        }

                        // Create a Firebase credential with the AccessToken
                        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                        // Sign-in the user with the credential
                        await auth().signInWithCredential(facebookCredential);
                    } catch (error) {
                        console.log(error);
                    }
                },
                register: async(email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            //once the usercreation has happened successfully, we can add the currentUser into 
                            //firestore with the appropriate details.
                            firestore().collection('users').doc(auth().currentUser.uid)
                            .set({
                                fname: '',
                                lname: '',
                                email: email,
                                createdAt: firestore.Timestamp.fromDate(new Date()),
                                userImg: null,
                            })
                            //ensure we catch any errors at this stage to advice us if something does go wrong
                            .catch(error => {
                                console.log('Something went wrong with added user to firestore: ', error);
                            })
                        })
                        //we need to catch the whole sign up process if it fails too.
                        .catch(error => {
                            console.log('Something went wrong with sign up: ', error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (error) {
                        console.log(error);
                    }
                },
                toggleTheme: () => {
                    console.log('Dark Mode state : ', darkMode);
                    if(!darkMode){
                        setDarkMode(true);
                        EventRegister.emit('changeThemeEvent', darkMode);
                        
                    }else{
                        setDarkMode(false);
                        EventRegister.emit('changeThemeEvent', darkMode);
                        
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};