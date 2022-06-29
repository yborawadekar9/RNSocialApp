import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'; 

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';

import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useTheme } from '@react-navigation/native';

const EditProfileScreen = () => {
  const { colors } = useTheme();
  const headerHeight = useHeaderHeight();
  const windowHeight = Dimensions.get('window').height;
  bs = React.createRef();
  fall = new Animated.Value(1);

  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  

  renderInner = () => (
    <View style={[styles.panel, {backgroundColor: colors.background}]}>
      <View style={{alignItems: 'center'}}>
        <Text style={[styles.panelTitle,{color: colors.text}]}>Upload Photo</Text>
        <Text style={[styles.panelSubtitle, {color: colors.text}]}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={[styles.header, {backgroundColor: colors.background}]}>
      <View style={styles.panelHeader}>
        <View style={[styles.panelHandle, {backgroundColor: colors.text}]} />
      </View>
    </View>
  );

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      setImage(image.path);
      bs.current.snapTo(1);
    });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      setImage(image.path);
      bs.current.snapTo(1);
    });
  }

  const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  const uploadImage = async () => {
    if(image == null) {
      return null;
    }

    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log(filename);

    // Add timestamp to filename
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);
      // Alert.alert(
      //   'Image Uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!'
      // );
      return url;

    } catch (error) {
      console.log(error);
      return null;
    }

  };

  const handleUpdate = async() => {
    let imgUrl = await uploadImage();

    if( imgUrl == null && userData.userImg ){
      imgUrl = userData.userImg;
    }

    firestore()
    .collection('users')
    .doc(user.uid)
    .update({
      fname: userData.fname,
      lname: userData.lname,
      about: userData.about,
      phone: userData.phone,
      country: userData.country,
      city: userData.city,
      userImg: imgUrl,
    })
    .then(() => {
      console.log('User Updated!');
      Alert.alert(
        'Profile Updated!',
        'Your Profile has been updated successfully.'
      );
    })
  }

  useEffect(() => {
    getUser();
    console.log('Header Height : ', headerHeight);
    console.log('Windows Height : ', windowHeight);
  }, []);

  return (
    
    <KeyboardAvoidingView 
      keyboardVerticalOffset={headerHeight+200}
      behavior={"height"}  
      style={[styles.container,{backgroundColor: colors.background}]}
    >
      <ScrollView>
        <BottomSheet 
          ref={bs}
          snapPoints={[330, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
          enabledHeaderGestureInteraction={true}
          enabledContentGestureInteraction={true}
        />
        <Animated.View style={{margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}></Animated.View>
        
      <View style={{margin: 20}} >
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
            <View style={{height: 100, width: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
              <ImageBackground 
                source={{
                  uri: image ? image : userData ?
                  userData.userImg || 
                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                  : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 15}}
              >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialCommunityIcons name='camera' size={35} color='#fff' style={{
                    opacity: 0.7,
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 10
                  }} />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={[{marginTop: 10, fontSize: 18, fontWeight: 'bold'}, {color: colors.text}]}>
            {userData ? userData.fname : ''} {userData ? userData.lname : ''}
          </Text>
          <Text style={{color: colors.text}}>{user.uid}</Text>
        </View>
        <View style={styles.action}>
          <FontAwesome name='user-o' size={20} color={colors.text}/>
          <TextInput 
            placeholder='First Name'
            placeholderTextColor='#666666'
            autoCorrect={false}
            value={userData ? userData.fname : ''}
            onChangeText={(txt) => setUserData({ ...userData, fname: txt})}
            style={[styles.textInput, {color: colors.text}]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name='user-o' size={20} color={colors.text} />
          <TextInput 
            placeholder='Last Name'
            placeholderTextColor='#666666'
            autoCorrect={false}
            value={userData ? userData.lname : ''}
            onChangeText={(txt) => setUserData({...userData, lname: txt})}
            style={[styles.textInput, {color: colors.text}]}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" color={colors.text} size={20} />
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="About Me"
            placeholderTextColor="#666666"
            value={userData ? userData.about : ''}
            onChangeText={(txt) => setUserData({...userData, about: txt})}
            autoCorrect={true}
            style={[styles.textInput, {height: 40}, {color: colors.text}]}
          />
        </View>
        <View style={styles.action}>
          <Feather name='phone' size={20} color={colors.text} />
          <TextInput 
            placeholder='Phone'
            placeholderTextColor='#666666'
            keyboardType='number-pad'
            autoCorrect={false}
            value={userData ? userData.phone : ''}
            onChangeText={(txt) => setUserData({...userData, phone: txt})}
            style={[styles.textInput, {color: colors.text}]}
          />
        </View>
        {/* <View style={styles.action}>
          <FontAwesome name='envelope-o' size={20} />
          <TextInput 
            placeholder='Email'
            placeholderTextColor='#666666'
            keyboardType='email-address'
            autoCorrect={false}
            style={styles.textInput}
          />
        </View> */}
        <View style={styles.action}>
          <FontAwesome name='globe' size={20} color={colors.text} />
          <TextInput 
            placeholder='Country'
            placeholderTextColor='#666666'
            autoCorrect={false}
            value={userData ? userData.country : ''}
            onChangeText={(txt) => setUserData({...userData, country: txt})}
            style={[styles.textInput, {color: colors.text}]}
          />
        </View>
        <View style={styles.action}>
          <MaterialCommunityIcons name='map-marker-outline' size={20} color={colors.text} />
          <TextInput 
            placeholder='City'
            placeholderTextColor='#666666'
            autoCorrect={false}
            value={userData ? userData.city : ''}
            onChangeText={(txt) => setUserData({...userData, city: txt})}
            style={[styles.textInput, {color: colors.text}]}
          />
        </View>

        {/* <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity> */}
        <FormButton buttonTitle='Update' onPress={() => handleUpdate()} />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
    
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 50,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});