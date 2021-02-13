import {Colors, Fonts} from 'constant';
import colors from 'constant/colors';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  hiText: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 24,
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
    textAlign:'center'
  },
  historyText: {
    ...rootStyle.commonText,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 25,
  },
  memberBlock: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomColor: Colors.seprator,
  },
  saveText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  mapBlock: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  locationBlock: {
    flex: 1,
    backgroundColor: Colors.white,
    marginLeft: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    padding: 20,
  },
  locText: {
    ...rootStyle.commonText,
    fontSize: 13,
  },
  locButton: {
    height: 36,
    width: 88,
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  seeLocText: {
    ...rootStyle.commonText,
    fontSize: 11,
  },
  dotContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 25,
    borderBottomColor: Colors.seprator,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
  },
  shopText: {
    alignSelf: 'center',
    marginTop: 35,
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextBold,
  },
  creditContainer: {
    height: 75,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  coinIcon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credits: {
    fontSize: 11,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  barflyLine: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 15,
  },
  bottomTextStyle: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  bottomButtonContainer: {
    width: '90%',
    height: 63,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginVertical: 15,
    ...rootStyle.shadow,
  },
});
