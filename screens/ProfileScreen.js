import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, Touchable, TouchableOpacity } from 'react-native';
import FormButton from '../components/FormButton';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
// import { useTheme } from 'react-native-paper';
import { useTheme } from '@react-navigation/native'
import { AuthContext } from '../navigation/AuthProvider';

import { EventRegister } from 'react-native-event-listeners';

const ProfileScreen = ({navigation, route}) => {
  const {user, logout, toggleTheme} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const navigationTheme = useTheme();
  const { colors } = useTheme();

  const fetchPosts = async () => {
    try {
      const list = [];
      await firestore()
      .collection('posts')
      .where('userId', '==', route.params ? route.params.userId : user.uid)
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot) => {
        console.log('Total Posts: ', querySnapshot.size);
        querySnapshot.forEach(doc => {
          const {userId, post, postImg, postTime, likes, comments} = doc.data();
          list.push({
            id: doc.id,
            userId,
            userName: 'Test Name',
            userImg: 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
            postTime: postTime,
            post,
            postImg: postImg,
            liked: false,
            likes,
            comments,
          });
        })
      })

      setPosts(list);

      if(loading) {
        setLoading(false);
      }

      // console.log('Posts: ', list);
    } catch (error) {
      console.log(error);
    }
  }

  const getUser = async() => {
    await firestore()
    .collection('users')
    .doc(route.params ? route.params.userId : user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  useEffect(() => {
    getUser();
    fetchPosts();
    navigation.addListener('focus', () => setLoading(!loading));
    const willFocusSubscription = navigation.addListener('focus', () => {
      fetchPosts();
      getUser();
    });
    return willFocusSubscription;
  }, [navigation, loading]);

  // useEffect(() => {
  //   let eventListener = EventRegister.addEventListener('changeThemeEvent', (data) => {
  //     // alert(data);
  //     setDarkMode(data);
  //   });
  // });

  const handleDelete = () => {};

  // const handleDarkMode = () => {};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={[styles.container, {
          backgroundColor: colors.background,
        }]}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
      >
        <Image 
          style={styles.userImg} 
          source={{uri: userData 
            ? userData.userImg || 
              'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
            : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}  
        />
        <Text style={[styles.userName, {
          color: colors.text
        }]}>
          {userData ? userData.fname || 'Test' : 'Test'}{' '}
          {userData ? userData.lname || 'User' : 'User'}
        </Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={[styles.aboutUser, {color: colors.text}]}>
          {userData ? userData.about || 'No details added' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={[styles.userBtnTxt,{color:colors.text}]}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={[styles.userBtnTxt,{color:colors.text}]}>Follow</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.userBtn} 
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={[styles.userBtnTxt,{color:colors.text}]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={[styles.userBtnTxt,{color:colors.text}]}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {
                  toggleTheme();
                }}
              >
                <Text style={[styles.userBtnTxt,{color:colors.text}]}>
                  {console.log('Dark MOde: ', navigationTheme.dark)}
                  {navigationTheme.dark ? 'Dark Mode Off' : 'Dark Mode On'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color:colors.text}]}>{posts.length}</Text>
            <Text style={[styles.userInfoSubTitle,{color:colors.text}]}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color:colors.text}]}>2000</Text>
            <Text style={[styles.userInfoSubTitle,{color:colors.text}]}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color:colors.text}]}>220</Text>
            <Text style={[styles.userInfoSubTitle,{color:colors.text}]}>Followings</Text>
          </View>
        </View>

        {posts.map((item) => (
          <PostCard key={item.id} item={item} onDelete={handleDelete} />
          ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    postTime: '4 mins ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '2 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    postTime: '2 days ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];