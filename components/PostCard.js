import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '@react-navigation/native';

import { Container, Card, UserInfo, UserImg, UserName, UserInfoView, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider } from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import { AuthContext } from '../navigation/AuthProvider';

import moment from 'moment';

const PostCard = ({item, onDelete, onPress}) => {

  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const { colors } = useTheme();

    let likeIcon = item.liked ? 'heart' : 'heart-outline';
    let likeIconColor = item.liked ? '#2e64e5' : '#333';

    let likeText;
    if(item.likes == 1) {
        likeText = '1 Like';
    } else if(item.likes > 1) {
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    let commentText;
    if(item.comments == 1) {
        commentText = '1 Comment';
    } else if(item.comments > 1) {
        commentText = item.comments + ' Comments';
    } else {
        commentText = 'Comment';
    }

    const getUser = async() => {
      await firestore()
      .collection('users')
      .doc(item.userId)
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
    }, []);

  return (
    <Card style={{backgroundColor: colors.postCardBackground}}>
        <UserInfo>
          {/* <UserImg source={require('../assets/users/user-3.jpg')} /> */}
          <UserImg 
            source={{uri: userData 
              ? userData.userImg || 
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
          />
          <UserInfoView>
            <TouchableOpacity onPress={onPress}>
              <UserName style={{color: colors.text}}>
                {userData ? userData.fname || 'Test' : 'Test'}{' '}
                {userData ? userData.lname || 'User' : 'User'}
              </UserName>
            </TouchableOpacity>
            <PostTime style={{color: colors.text}}>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoView>
        </UserInfo>
        <PostText style={{color: colors.text}}>{item.post}</PostText>
        {/* <PostImg 
          source={require('../assets/posts/post-img-2.jpg')}
        /> */}
        {/* {item.postImg !== null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
        {item.postImg !== null ? (
          <ProgressiveImage 
            defaultImageSource={require('../assets/images/default-img.jpg')}
            source={{uri: item.postImg}}
            style={{width: '100%', height: 250}}
            resizeMode='cover'
          />
        ): <Divider />}
        <InteractionWrapper>
          <Interaction active={item.liked}>
            <Ionicons style={{color: colors.text}} name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText style={{color: colors.text}} active={item.liked}>{likeText}</InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons style={{color: colors.text}} name='md-chatbubble-outline' size={25} />
            <InteractionText style={{color: colors.text}}>{commentText}</InteractionText>
          </Interaction>
          {user.uid == item.userId ? 
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons style={{color: colors.text}} name='md-trash-bin' size={25} />
          </Interaction>
          : null }
        </InteractionWrapper>
      </Card>
  );
};

export default PostCard;

const styles = StyleSheet.create({})