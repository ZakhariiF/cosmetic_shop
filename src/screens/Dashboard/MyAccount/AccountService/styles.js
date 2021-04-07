import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  topImage: {
    height: 230,
    width: '100%',
  },
  topContainer: {
    padding: '10%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.seprator,
  },
  headingText: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    textAlign: 'center',
  },
  descText: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    // marginTop: 8,
    fontFamily: Fonts.AvenirNextBold,
    textAlign: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  bottomIcon: {
    width: '97%',
    height: '95%',
  },
  buttonContainer: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
  },
  bottomImg: {
    width: '100%',
    backgroundColor: Colors.white,
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...rootStyle.shadow,
  },
  selectLocationHeader: {
    ...rootStyle.commonHeader,
    alignSelf: 'center',
    textAlign: 'center',
  },
  selectedStore: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectedStoreLabel: {
    fontSize: 14,
    color: '#777',
    marginRight: 10,
    fontWeight: '700',
  },
  locationTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTitle: {
    flexDirection: 'row',
    width: '50%',
  },
  locationWrapper: {
    backgroundColor: Colors.bg,
    marginBottom: 10,
    padding: 20,
  },
  locationModalWrapper: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  locationTitleText: {
    fontSize: 15,
  },
  locationModalTitle: {
    fontSize: 19,
  },
  storeTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  storeItemWrapper: {
    padding: 10,
    backgroundColor: Colors.bg,
    borderTopColor: Colors.seprator,
    borderTopWidth: 1,
    borderStyle: 'solid',
    marginBottom: 20,
  },
  storeTitle: {
    fontSize: 15,
  },
  storeAddressWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  storeAddress: {
    fontSize: 13,
  },
  storeDec: {
    flexDirection: 'column',
  },
  information: {
    borderTopWidth: 2,
    borderTopColor: Colors.seprator,
    borderStyle: 'solid',
    backgroundColor: Colors.bg,
    marginTop: 10,
    padding: 10,
  },
  inforText: {
    color: Colors.light_gray,
    marginBottom: 10,
  },
  storeDirection: {
    textDecorationLine: 'underline',
  },
  storeSelectButtonContainer: {
    height: 30,
    width: 100,
    display: 'flex',
    maxWidth: '50%',
  },
  storeSelectButtonTitle: {
    fontSize: 14,
  },
});
