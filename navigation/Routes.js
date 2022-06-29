import React, { useContext, useState, useEffect } from 'react'
import { 
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import { EventRegister } from 'react-native-event-listeners';

import auth from '@react-native-firebase/auth';
import { AuthContext } from './AuthProvider';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
  const {user, setUser, toggleTheme} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
      postCardBackground: '#f8f8f8'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
      postCardBackground: '#555555'
    }
  }

  const theme =  darkMode ? CustomDarkTheme : CustomDefaultTheme;

  const onAuthStateChanged = (user) => {
    setUser(user);
    console.log('User In Routes.js : ', user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('changeThemeEvent', (data) => {
      // alert(data); 
      setDarkMode(data);
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;  // unsubscribe on unmount
  }, []);

  if(initializing) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
        { user ? <AppStack /> : <AuthStack /> }
    </NavigationContainer>
  );
}

export default Routes;