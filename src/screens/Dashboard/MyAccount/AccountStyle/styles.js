import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  topImage: {
    height: 230,
    width: '100%',
  },
  topText: {
    ...rootStyle.commonHeader,
    alignSelf: 'center',
    textAlign: 'center',
    padding: '10%',
  },
  desc: {
    textAlign: 'center',
    alignSelf: 'center',
    marginHorizontal: '10%',
    fontFamily: Fonts.AvenirNextRegular,
    fontSize: 18,
    color: Colors.header_title,
  },
  swiperTextStyle: {
    fontSize: 30,
    fontFamily: Fonts.DCondensed,
    padding: 20,
    color: '#42413D',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  swiperContainer: {
    height: 430,
    width: '100%',
  },
  imageStyle: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  buttonStyle: {
    // backgroundColor: 'transparent',
    marginVertical: 30,
  },
  buttonTextStyle: {
    fontSize: 13,
  },
  playerContainer: {
    width: '100%',
    borderWidth: 15,
    borderColor: '#E2E2E2',
    marginVertical: 20,
  },
  playIcon: {
    alignSelf: 'center',
    top: '40%',
    position: 'absolute',
  },
  slickCtrlBtnImage: {
    height: 25,
    width: 15,
  },
  modalHeaderText: {
    ...rootStyle.commonHeader,
    paddingVertical: 0,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10,
  } 
});
