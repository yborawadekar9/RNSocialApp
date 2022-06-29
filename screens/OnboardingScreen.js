import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper'

const  Skip = ({...props}) => {
  return <Button
    title='Skip' color='#000000'
  />
}

const  Next = ({...props}) => {
  return <Button
    title='Next' color='#000000' {...props}
  />
}

const  Done = ({...props}) => {
  // return <Button
  //   title='Done' color='#000000' {...props}
  // />
  return <TouchableOpacity
    style={{marginHorizontal:8}}
    {...props}
  ><Text style={{fontSize: 16}}>Done</Text></TouchableOpacity>
}

const Dots = ({selected}) => {
  let backgroundColor;
  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
  return (
    <View 
      style={{width: 5, height: 5, marginHorizontal: 3, backgroundColor}}
    />
  )
}

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
    SkipButtonComponent={Skip}
    NextButtonComponent={Next}
    DoneButtonComponent={Done}
    DotComponent={Dots}
    onSkip={() => navigation.replace('Login')}
    onDone={() => navigation.navigate('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image resizeMode='center' source={require('../assets/images/onboarding1.png')} />,
          title: 'Connect To The World',
          subtitle: 'A New Way To Connect With The World',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image resizeMode='center' source={require('../assets/images/onboarding2.png')} />,
          title: 'Share Your Favorites',
          subtitle: 'Share Your Thoughts With Similar Kind of People',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image resizeMode='center' source={require('../assets/images/onboarding3.png')} />,
          title: 'Become The Star',
          subtitle: 'Let The Spot Light Capture You',
        },
      ]}
    />
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})