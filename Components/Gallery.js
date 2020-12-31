import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const Gallery = () => {
  const [imageList, setImageList] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  let newImageList = [...imageList];
  const flatListRef = useRef(null);

  const getImages = async () => {
    let images = await AsyncStorage.getItem('app_images');
    if (images) {
      images = JSON.parse(images);
      let length = images.imageArray.length / 4;
      if (Number.isInteger(length)) {
        setNumberOfPages(length);
      } else {
        setNumberOfPages(Math.floor(length + 1));
      }
      setImageList(images.imageArray);
    } else {
      setNumberOfPages(0);
      setImageList([]);
    }
  };

  useEffect(() => {
    newImageList = [...imageList];
  }, [imageList, numberOfPages]);

  useEffect(() => {
    getImages();
  }, []);

  return (
    <>
      <FlatList
        ref={flatListRef}
        scrollEnabled={false}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={Array.apply(null, Array(numberOfPages))}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={() => (
          <View style={styles.emptyView}>
            <Text>The gallery is empty,Open camera & snap a picture</Text>
          </View>
        )}
        renderItem={() => {
          return (
            <View style={styles.mainView}>
              <FlatList
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={{margin: 10}}
                data={newImageList.splice(0, 4)}
                keyExtractor={(item, index) => String(index)}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage(item);
                        setModalVisible(true);
                      }}
                      style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={{uri: item}}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          );
        }}
      />

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.paginationButtons}
          onPress={() =>
            currentPage > 1 &&
            (flatListRef.current.scrollToIndex({index: currentPage - 2}),
            setCurrentPage((currentPage) => currentPage - 1))
          }>
          <Text style={styles.paginationText}>Back ({currentPage - 1})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paginationButtons}
          onPress={() =>
            currentPage != numberOfPages &&
            (flatListRef.current.scrollToIndex({index: currentPage}),
            setCurrentPage((currentPage) => currentPage + 1))
          }>
          <Text style={styles.paginationText}>
            Next ({numberOfPages > 0 ? numberOfPages - currentPage : 0})
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          {selectedImage && (
            <Image
              style={styles.modalImage}
              resizeMode="contain"
              source={{uri: selectedImage}}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.textStyle}>Back(X)</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    justifyContent: 'center',
  },
  mainView: {
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 0.5,
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: deviceHeight / 2 - 80,
  },
  paginationButtons: {
    backgroundColor: '#E95C0F',
    borderRadius: 5,
    margin: 10,
  },
  paginationText: {
    padding: 20,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  closeButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  modalImage: {
    width: deviceWidth,
    height: deviceHeight - 200,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Gallery;
