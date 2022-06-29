import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

import { useTheme } from '@react-navigation/native';

import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [data, setData] = useState({
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true,
  });

  const {login, googleLogin, fbLogin} = useContext(AuthContext);

  const { colors } = useTheme();

  const isValidEmail = (val) => {
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(pattern.test(val));
    if (pattern.test(val)){
      setData({
        ...data,
        isValidEmail: true
      });
    } else {
      setData({
        ...data,
        isValidEmail: false
      });
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Image 
        source={require('../assets/images/social-logo.png')}
        style={styles.logo}
      />
      <Text style={[styles.text, {color: colors.text}]}>Social App</Text>
      <FormInput 
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        onEndEditing={(e) => isValidEmail(e.nativeEvent.text)}
        placeholderText='Email'
        iconType='user'
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />
      {data.isValidEmail ? null : <Text style={{color: 'red', fontSize: 14}}>Invalid Email</Text>}
      
      <FormInput 
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText='Password'
        iconType='lock'
        secureTextEntry={true}
      />

      <FormButton 
        buttonTitle='Sign In'
        disabled={data.isValidEmail ? false : true}
        onPress={() => login(email, password)}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={[styles.navButtonNext]}>Forgot Password?</Text>
      </TouchableOpacity>

      <SocialButton 
        buttonTitle='Sign In with Facebook'
        btnType='facebook'
        color='#4867aa'
        backgroundColor='#e6eaf4'
        onPress={() => fbLogin()}
      />
      <SocialButton 
        buttonTitle='Sign In with Google'
        btnType='google'
        color='#de4d41'
        backgroundColor='#f5e7ea'
        onPress={() => googleLogin()}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.navButtonNext]}>Don't Have An Account? Create Here</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafd'
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover'
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 20,
    marginBottom: 10,
    color: '#051d5f'
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35
  },
  navButtonNext: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular'
  }
})