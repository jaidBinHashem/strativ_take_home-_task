import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Camera from './Components/Camera';
import Gallery from './Components/Gallery';

const App = () => {
  const [openCam, setOpenCam] = useState(false);

  return (
    <>
      <StatusBar backgroundColor="#e96d0f" />
      <SafeAreaView style={styles.container}>
        {!openCam ? <Gallery /> : <Camera />}
        <TouchableOpacity
          style={styles.openCam}
          onPress={() => setOpenCam((openCam) => !openCam)}>
          <Text style={styles.openCamText}>
            {!openCam ? 'Open Camera' : 'Close Camera'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  openCam: {
    backgroundColor: '#E95C0F',
    borderRadius: 5,
    margin: 10,
  },
  openCamText: {
    padding: 20,
    color: 'white',
  },
});

export default App;
