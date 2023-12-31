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
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';
import {get} from 'lodash';
import {playVideo} from 'utils';
import Indicator from 'components/Indicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Slick from 'react-native-slick';
import { useNavigation } from "@react-navigation/native";

const AccountStyle = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const navigation = useNavigation();

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

  const showModal = (item, parent) => {
    setModalVisible(get(parent, 'title'));
    setImages(item.images);
  };
  return (
    <View style={rootStyle.container}>
      <Header title="STYLES" isBack isTab />

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.bg,
          }}>
          <View
            style={{
              width: 400,
              height: 500,
            }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{(modalVisible || '').toUpperCase()}</Text>
              <MaterialCommunityIcons
                name="close"
                size={30}
                color={Colors.header_title}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Slick
              showsButtons={true}
              nextButton={
                <Image
                  source={Images.right_arrow}
                  style={styles.slickCtrlBtnImage}
                />
              }
              prevButton={
                <Image
                  source={Images.right_arrow}
                  style={[
                    {transform: [{rotate: '180deg'}]},
                    styles.slickCtrlBtnImage,
                  ]}
                />
              }
              activeDotStyle={{backgroundColor: 'transparent'}}
              dotStyle={{backgroundColor: 'transparent'}}>
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
                setModalVisible(false);
                navigation.navigate('Book', {
                  screen: 'Location',
                });
              }}
              name="Book this style"
            />
          </View>
        </View>

      </Modal>

      <ScrollView>
        <Image
          resizeMode="cover"
          style={styles.topImage}
          source={{uri: get(data, 'heroImage')}}
        />

        <View style={rootStyle.innerContainer}>
          <Text style={styles.topText}>
            {get(data, 'title', '').toUpperCase()}
          </Text>
        </View>

        <View style={{paddingHorizontal: 15}}>
          <Slick
            showsButtons={true}
            containerStyle={styles.swiperContainer}
            dotStyle={{backgroundColor: 'transparent'}}
            activeDotStyle={{backgroundColor: 'transparent'}}
            buttonWrapperStyle={{
              alignItems: 'flex-start',
              top: 150,
            }}
            nextButton={
              <Image
                source={Images.right_arrow}
                style={styles.slickCtrlBtnImage}
              />
            }
            prevButton={
              <Image
                source={Images.right_arrow}
                style={[
                  {transform: [{rotate: '180deg'}]},
                  styles.slickCtrlBtnImage,
                ]}
              />
            }>
            {get(data, 'styles', []).map((e, i) => {
              return (
                <View>
                  <Image
                    source={{uri: e.featuredImage}}
                    style={styles.imageStyle}
                  />
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
          />

          {/* Paragraph */}

          {get(data, 'styles', []).map((e, i) => {
            return (
              <View key={i}>
                {get(e, 'featuredImage') && get(e, 'featuredVideo') ? (
                  <>
                    <DottedView number={200} />

                    <TouchableWithoutFeedback
                      onPress={() => playVideo(e.featuredVideo)}
                      accessible
                      accessibilityLabel="Show Video"
                      accessibilityRole="button">
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
                  showModal={(item) => showModal(item, e)}
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
