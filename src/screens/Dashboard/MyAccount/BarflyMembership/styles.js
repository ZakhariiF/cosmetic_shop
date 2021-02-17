import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  headerContainer: {
    height: 70,
    backgroundColor: Colors.dim_gray,
    padding: 5,
  },
  dottBorderContainer: {
    borderStyle: 'dotted',
    borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.Evan,
    marginTop: 30,
    lineHeight: 20,
  },
  icon: {
    tintColor: Colors.yellow,
    height: 14,
    width: 14,
  },
  signatureContainer: {
    height: 80,
    backgroundColor: Colors.white,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    borderBottomColor: Colors.seprator,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  signatureText: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  coinIcon: {
    height: 90,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credits: {
    fontSize: 12,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  leftContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  dateText: {
    ...rootStyle.commonText,
    fontSize: 13,
  },
  date: {
    fontFamily: Fonts.AvenirNextBold,
  },
  barfly: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 15,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: 25,
    color: Colors.header_title,
    fontFamily: Fonts.DCondensed,
    marginTop: 5,
  },
  marginContainer: {
    flex: 1,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 40,
  },
  cancelMembership: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    alignSelf: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: Colors.input_color,
  },
  seprator: {
    height: 20,
    width: 1,
    backgroundColor: Colors.dimGray,
  },
  barflyContainer: {
    height: 44,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    marginVertical: 15,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: Colors.yellow,
    borderStyle: 'solid'
  },
  topContainer: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderStyle: 'solid',
    padding: 6,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dim_gray,
  },
  tipImg: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blowText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.Evan,
    lineHeight: 22,
    marginTop: 5,
  },
  plus: {
    fontSize: 13,
    marginTop: 15,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_brown,
    marginBottom: 5,
  },
  plusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  percentageText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  desc: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginLeft: 20,
  },
  price: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    marginTop: 25,
  },
  monthText: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextMedium,
  },
  tax: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  heart: {
    height: 27,
    width: 27,
    top: -5,
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'center',
  },
  current: {
    marginTop: 20,
    ...rootStyle.commonText,
    alignSelf: 'center',
    marginBottom: 15,
  },
  storeSelectButtonContainer: {
    height: 30,
    width: 100,
    display: 'flex',
    maxWidth: '50%'
  },
  storeSelectButtonTitle: {
    fontSize: 14,
  },
  storeTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '50%'
  },
  storeAddress: {
    display: 'flex',  
    flexDirection: 'row'
  } 
});
