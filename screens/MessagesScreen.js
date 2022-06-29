import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';

import { useTheme } from '@react-navigation/native';

import {Container, Card, UserInfo, UserImgWrapper, UserImg, TextSection, UserInfoText, userName, PostTime, MessageText, UserName} from '../styles/MessageStyle';
 
const MessagesScreen = ({navigation}) => {
  const { colors } = useTheme();

  return (
    <Container style={{backgroundColor: colors.background}}>
      <FlatList 
        data={Messages}
        keyExtractor={item=> item.id}
        renderItem={({item}) => (
          <Card onPress={() => navigation.navigate('Chat', {userName:item.userName})}>
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={item.userImg} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName style={{color: colors.text}}>{item.userName}</UserName>
                  <PostTime style={{color: colors.text}}>{item.messageTime}</PostTime>
                </UserInfoText>
                <MessageText style={{color: colors.text}}>{item.messageText}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </Container>
  );
};

export default MessagesScreen;

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});