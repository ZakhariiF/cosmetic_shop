import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  locContainer: {
    minHeight: 90,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    ...rootStyle.shadow,
  },
  headerText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  titleText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 2,
  },
  boxContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 8,
    minHeight: 90,
    ...rootStyle.shadow,
  },
  price: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  totalContainer: {
    height: 68,
    backgroundColor: Colors.dimGray,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 5,
  },
  pastButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.1,
  },
  cancelTitle: {
    color: Colors.header_title,
  },
  cancelButton: {
    width: '49%',
    backgroundColor: Colors.white,
  },
  editButton: {
    width: '49%',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dlgCont: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
