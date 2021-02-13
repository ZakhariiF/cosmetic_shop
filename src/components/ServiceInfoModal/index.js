import CustomSwiper from 'components/CustomSwiper';
import {Colors, Fonts, Images} from 'constant';
import {get} from 'lodash';
import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import rootStyle from 'rootStyle';

const {height} = Dimensions.get('window');

const ServiceInfoModal = ({visible, onRequestClose, item}) => {
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onRequestClose}
      animationType="slide">
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <View style={{width: '20%'}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.title} numberOfLines={1}>
                {get(item, 'Name', '').toUpperCase()}
              </Text>
            </View>
            <View style={{width: '20%', alignItems: 'flex-end'}}>
              <Fontisto
                name="close-a"
                color={Colors.header_title}
                size={20}
                onPress={onRequestClose}
              />
            </View>
          </View>
          <ScrollView>
            <CustomSwiper imageSource={Images.addons} />
            <Text style={styles.works}>How It works</Text>
            <Text style={styles.desc}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet. Pro in gravida dolor.
            </Text>
            <View style={styles.priceContainer}>
              <Text style={rootStyle.commonText}>Price</Text>
              <Text style={styles.min}>${get(item, 'Price.Amount', 0)}</Text>
            </View>
            <View style={[styles.priceContainer, {marginTop: 5}]}>
              <Text style={rootStyle.commonText}>Service Time</Text>
              <Text style={styles.min}>{get(item, 'TotalDuration')} mins</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ServiceInfoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.modal_bg,
  },
  mainContainer: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    height: height * 0.6,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    fontSize: 31,
    fontFamily: Fonts.DCondensed,
    color: Colors.header_title,
  },
  works: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginTop: 15,
  },
  desc: {
    ...rootStyle.commonText,
    marginVertical: 5,
  },
  priceContainer: {
    borderTopWidth: 1,
    borderColor: Colors.seprator,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 15,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  min: {
    fontSize: 16,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
