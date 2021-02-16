import React, {useEffect, useState} from 'react';
import Button from 'components/Button';
import DottedView from 'components/DottedView';
import Header from 'components/Header/Header';
import Paragraph from 'components/Paragraph';
import SlideShow from 'components/SlideShow';
import {Images, Colors} from 'constant';
import {gqlLoadTheStyles} from 'constant/contentfulTheStylesActions';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import rootStyle from 'rootStyle';
import styles from './styles';
import {get, indexOf} from 'lodash';
import {playVideo} from 'utils';
import Indicator from 'components/Indicator';
const windowHeight = Dimensions.get('window').height;
import Slick from 'react-native-slick';

const AccountStyle = ({navigation}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let data = await gqlLoadTheStyles();
      // console.log('gqlLoadTheStyles', data);
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const showModal = (item) => {
    setModalVisible(true);
    setImages(item.images);
  };
  useEffect(() => {}, [modalVisible]);

  return (
    <View style={rootStyle.container}>
      <Header title="STYLES" isBack isTab />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableOpacity onPressOut={() => setModalVisible(false)} style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.bg,
            }}
          >
            <View
              style={{
                width: 400,
                height: 500,
                padding: 15,
              }}
            >
              <Slick
                loop={true}
                // style={{width: 100, height: 100}}
                showsButtons={true}>
                {images.map((e, i) => (
                  <View key={i} style={{width: 400, height: 400}}>
                    <Image
                      style={{width: 400, height: 400, resizeMode: 'contain'}}
                      source={{uri: e}}
                    />
                  </View>
                ))}
              </Slick>
              <Button
                onButtonPress={() => {
                  navigation.navigate('Book');
                }}
                name="Book this style"
              />
            </View>
          </View>
        </TouchableOpacity>


      </Modal>

      <ScrollView>
        <Image
          resizeMode="cover"
          style={styles.topImage}
          source={{uri: get(data, 'heroImage')}}
        />

        <View style={rootStyle.innerContainer}>
          {/* <Text style={styles.topText}>
            CHOOSE A LOOK{'\n'} FOR THE NEXT TIME YOU BOOK
          </Text> */}
          <Text style={styles.topText}>{get(data, 'title')}</Text>
          {/* <Text style={styles.desc}>{get(data, 'description')}</Text> */}
        </View>

        <View style={{flex: 1, paddingHorizontal: 20}}>
          <Slick
            showsButtons={true}
            style={[rootStyle.shadow, styles.swiperContainer]}
          >
            {/* {[1, 2, 3, 4].map((e, i) => ( */}
            {get(data, 'styles', []).map((e, i) => {
              return (
                <View style={[styles.imageStyle, {width: 400, height: 400}]}>
                  <Image source={{uri: e.featuredImage}} style={styles.imageStyle} />
                  <Text style={styles.swiperTextStyle}>{e.title}</Text>
                </View>
              );
            })}
          </Slick>

          <Button
            onButtonPress={() => {
              navigation.navigate('Book');
            }}
            name="Book an appointment"
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTextStyle}
          />

          {/* Paragraph */}

          {get(data, 'styles', []).map((e, i) => {
            return (
              <View key={i}>
                {get(e, 'featuredImage') && get(e, 'featuredVideo') ? (
                  <>
                    <DottedView number={200} />

                    <TouchableWithoutFeedback
                      onPress={() => playVideo(e.featuredVideo)}>
                      <View style={styles.playerContainer}>
                        <Image
                          source={{uri: e.featuredImage}}
                          style={{width: '100%', height: 213}}
                        />
                        <Image source={Images.play} style={styles.playIcon} />
                      </View>
                    </TouchableWithoutFeedback>
                  </>
                ) : null}

                <Paragraph
                  heading={get(e, 'title')}
                  description={get(e, 'subtitle')}
                  containerStyle={{marginBottom: 20}}
                />

                <SlideShow
                  // item={e}
                  item={get(e, 'gallery', [])}
                  navigation={navigation}
                  showModal={showModal}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      {loading ? <Indicator /> : null}
    </View>
  );
};

export default AccountStyle;
