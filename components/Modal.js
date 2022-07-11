import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WebView from 'react-native-webview';

const DisplayModal = props => {
  console.log('Props in Modal : ', props);
  const ActivityIndicatorLoadingView = () => {
    return (
      <ActivityIndicator
        color="#009688"
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  };

  const handleShare = () => {
    const {url, title} = props.data;
    const message = `${title}\n\nRead More @ ${url}\n\nShared via RN Social App`;
    return Share.share(
      {title, message, url: message},
      {dialogTitle: `Share ${title}`},
    );
  };

  if (props.data.url != undefined) {
    return (
      <Modal
        visible={props.display}
        // transparent
        animationType="slide"
        onRequestClose={() => {
          props.onClose();
          console.log('closed');
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginLeft: 10,
            marginRight: 10,
          }}>
          {/* <FontAwesome5
            name="times-circle"
            size={36}
            color="#fff"
            // style={{backgroundColor: '#009387'}}
            // style={{backgroundColor: 'rgba(52, 52, 52, 0.8)'}}
            onPress={props.onClose}
          />
          <FontAwesome5
            name="share-alt"
            size={36}
            color="#fff"
            // style={{backgroundColor: 'transparent'}}
            onPress={handleShare}
          /> */}
        </View>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                backgroundColor: '#009387',
                width: '100%',
                // borderTopLeftRadius: 20,
                // borderTopRightRadius: 20,
                // flexDirection: 'column',
                // alignItems: 'center',
              }}>
              {/* <Text
                style={{
                  flexShrink: 1,
                  fontSize: 20,
                  fontWeight: 'bold',
                  padding: 5,
                  color: '#000000',
                  alignSelf: 'center',
                }}>
                {props.data.title}
              </Text> */}
              <FontAwesome5
            name="times-circle"
            size={36}
            color="#fff"
            onPress={props.onClose}
            style={{marginLeft: 10}}
          />
          <Text style={{fontSize: 24, fontWeight: 'bold', color: '#FFF'}}>{props.data.author}</Text>
          <FontAwesome5
            name="share-alt"
            size={36}
            color="#fff"
            onPress={handleShare}
            style={{marginRight: 10}}
          />
            </View>
            <View style={{height: '100%', width: '100%'}}>
              <WebView
                source={{uri: props.data.url}}
                // renderLoading={ActivityIndicatorLoadingView}
                startInLoadingState
                scalesPageToFit
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};

export default DisplayModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    height: '100%',
    width: '100%',
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
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
