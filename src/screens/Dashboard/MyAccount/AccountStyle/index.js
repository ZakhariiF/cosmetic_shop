import React, {useEffect, useState} from 'react';
import Button from 'components/Button';
import DottedView from 'components/DottedView';
import Header from 'components/Header/Header';
import Paragraph from 'components/Paragraph';
import SlideShow from 'components/SlideShow';
import {Images} from 'constant';
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
    // alert(JSON.stringify(data));
    console.log('stylllllllllllllllllllllllll ' + JSON.stringify(data));
  }, []);

  const getData = async () => {
    try {
      let data = await gqlLoadTheStyles();
      // console.log('gqlLoadTheStyles', data);
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('errrore>>>', error);
    }
  };

  const showModal = (item) => {
    alert(JSON.stringify(item.gallery.images));
    setModalVisible(true);
    setImages(item.gallery.images);
  };
  useEffect(() => {}, [modalVisible]);

  return (
    <View style={rootStyle.container}>
      <Header title="STYLES" isBack isTab />
      {/* <View
        style={{
          width: 200,
          height: 200,
          justifyContent: 'center',
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View
            style={{
              width: 400,
              height: 400,
              backgroundColor: 'yellow',
              alignSelf: 'center',
            }}>
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
          </View>
        </Modal>
      </View> */}
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
            loop={true}
            // style={{width: 100, height: 100}}
            showsButtons={true}
            dot={false}
            style={[rootStyle.shadow, styles.swiperContainer]}>
            {/* {[1, 2, 3, 4].map((e, i) => ( */}
            {get(data, 'styles', []).map((e, i) => {
              console.log(e, i);
              return (
                <ImageBackground
                  key={i}
                  style={styles.imageStyle}
                  // source={Images.oldFashioned}>
                  source={{uri: e.featuredImage}}>
                  <Text style={styles.swiperTextStyle}>{e.title}</Text>
                  {/* <Text style={styles.swiperTextStyle}>OLD FASHIONED</Text> */}
                </ImageBackground>
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
                  item={get(data, 'styles', [])}
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
