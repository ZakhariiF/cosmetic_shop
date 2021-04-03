import { StyleSheet } from 'react-native';
import { Colors, Fonts } from 'constant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 15,
    color: Colors.header_title,
    textAlign: 'center',
    fontFamily: Fonts.AvenirNextRegular,
  },
  modalWrapper: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  modalContentWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    paddingHorizontal: 20,
    paddingVertical: 120,
    backgroundColor: Colors.white,
    // boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.14)',
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.14,
  },
  modalContentText: {
    fontFamily: Fonts.AvenirNextRegular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.header_title,
  },
});
