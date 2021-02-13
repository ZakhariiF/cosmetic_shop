import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  salonImg: {
    width: '100%',
    height: 200,
  },
  shopName: {
    fontSize: 22,
    marginVertical: 20,
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
  },
  addressContainer: {
    padding: 15,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopLoc: {
    ...rootStyle.commonText,
  },
  shopMiles: {
    fontSize: 13,
    color: Colors.light_gray,
    fontFamily: Fonts.AvenirNextRegular,
    marginVertical: 20,
  },
  desc: {
    ...rootStyle.commonText,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 22,
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 20,
    marginVertical: 10,
  },
  callIcon: {
    tintColor: Colors.header_title,
    height: 20,
    width: 12,
  },
  hour: {
    marginTop: 15,
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  hourContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    marginVertical: 10,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  weekDay: {
    ...rootStyle.commonText,
    lineHeight: 29,
  },
});
