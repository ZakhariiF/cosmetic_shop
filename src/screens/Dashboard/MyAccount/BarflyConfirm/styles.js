import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  headerContainer: {
    height: 70,
    backgroundColor: Colors.dim_gray,
    padding: 5,
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
  storeTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '50%',
  },
  storeAddress: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    color: Colors.header_title,
    fontSize: 18,
    lineHeight: 45,
  },

  summaryWrapper: {
    backgroundColor: Colors.lighter_gray,
    marginBottom: 20,
    padding: 10,
    minHeight: 100,
  },
  summaryCharges: {
    flexDirection: 'row',
  },
  priceWrapper: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
    borderRadius: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceSplitWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  priceSplit: {
    fontSize: 25,
  },
  price: {
    fontSize: 20,
    lineHeight: 50,
  },
  priceUnitWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceUnit: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
