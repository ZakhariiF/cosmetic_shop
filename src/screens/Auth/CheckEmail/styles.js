import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';

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
    backgroundColor: Colors.white,
    padding: 12,
    lineHeight: 24,
  },
  emailText: {
    marginTop: 40,
    fontSize: 18,
    color: Colors.header_title,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: Fonts.AvenirNextRegular,
  },
  buttonContainer: {
    marginTop: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonTitle: {
    fontFamily: Fonts.AvenirNextRegular,
  },
});
