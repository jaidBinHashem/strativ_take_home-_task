import React, {useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';

const LoaderView = () => (
  <View style={styles.loaderStyle}>
    <ActivityIndicator size="large" color="#E95C0F" />
    <Text>Waiting Permission</Text>
  </View>
);

const Camera = ({camOpen}) => {
  let cameraRef = useRef();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // await AsyncStorage.clear();
        // return
        const options = {quality: 1};
        const data = await cameraRef.current.takePictureAsync(options);
        let images = await AsyncStorage.getItem('app_images');

        let newImages = {
          imageArray: [],
        };
        if (images) {
          images = JSON.parse(images);
          newImages.imageArray = images.imageArray;
        }
        newImages.imageArray.push(data.uri);
        await AsyncStorage.setItem('app_images', JSON.stringify(newImages));
        ToastAndroid.show('Image added to gallery', ToastAndroid.SHORT);
      } catch (e) {
        ToastAndroid.show('There was some error, please try again', ToastAndroid.SHORT);
      }
    }
  };
  return (
    <RNCamera
      ref={cameraRef}
      style={styles.preview}
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.auto}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      androidRecordAudioPermissionOptions={{
        title: 'Permission to use audio recording',
        message: 'We need your permission to use your audio',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}>
      {({camera, status}) => {
        if (status !== 'READY') return <LoaderView />;
        return (
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => takePicture(camera)}
              style={styles.snap}>
              <Text style={styles.snapText}> SNAP </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    </RNCamera>
  );
};

const styles = StyleSheet.create({
  loaderStyle: {
    padding: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  snapText: {
    fontSize: 14,
    color: '#fff',
  },
  snap: {
    flex: 0,
    backgroundColor: '#E95C0F',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default Camera;
