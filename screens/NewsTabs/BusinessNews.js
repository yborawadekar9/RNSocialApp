import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getArticles} from '../service/news';
import DisplayModal from '../../components/Modal';

import { useTheme } from '@react-navigation/native';

import moment from 'moment';

const BusinessNews = () => {

  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const [data, setData] = useState({
    isLoading: true,
    newsData: null,
    modalArticleData: {},
  });

  const handleItemDataOnPress = articleData => {
    setModalVisible(true);
    console.log('Article Data : ', articleData);
    setData({
      ...data,
      modalArticleData: articleData,
    });
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setData({
      ...data,
      modalArticleData: {},
    });
  };

  const getNewsData = () => {
    getArticles('business').then(
      data => {
        // console.log('newsArticles ', data);
        setData({
          isLoading: false,
          newsData: data.articles,
        });
      },
      error => {
        Alert.alert('Error', 'Something went wrong!');
      },
    );
  };

  useEffect(() => {
    getNewsData();
  }, []);

  console.log('News Data : ', data);

  return (
    <SafeAreaView style={{flex: 1}}>
      {data.isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={data.isLoading} />
          <Text>Please wait...</Text>
        </View>
      ) : (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
          <FlatList
            data={data.newsData}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleItemDataOnPress(item)}>
                <View style={[styles.card, {backgroundColor: colors.background}]}>
                  <Image
                    style={styles.newsImage}
                    source={{
                      uri:
                        item.urlToImage != null
                          ? item.urlToImage
                          : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                    }}
                  />

                  <View style={styles.news}>
                    <Text numberOfLines={3} style={[styles.newsTitle, {color: colors.text}]}>
                      {item.title}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      paddingLeft: 10,
                    }}>
                    <Text style={{color: colors.text}}>{item.source.name}</Text>
                    <Text style={{marginHorizontal: 10, color: colors.text}}>
                      {moment(item.publishedAt || moment.now()).fromNow()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.title}
          />
        </View>
      )}
      {modalVisible == true ? (
        <DisplayModal
          data={data.modalArticleData}
          display={modalVisible}
          onClose={handleModalClose}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default BusinessNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    margin: 10,
  },
  card: {
    // width: '100%',
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
    // backgroundColor: useTheme().colors.background,
    borderRadius: 10,
    marginTop: 20,
    border: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  news: {
    // flexShrink: 1, // importent for text placed inside view
    // flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  newsDetail: {
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: '100%',
    width: '90%',
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
