import { StyleSheet } from 'react-native';
import { Colors, Fonts } from 'constant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  recover: {
    fontSize: 15,
    alignSelf: 'center',
    color: Colors.light_gray,
    fontFamily: Fonts.AvenirNextRegular

  },
  seprateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  seprator: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.seprator,
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 18,
    color: Colors.header_title,
  },
  login: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: Colors.input_text,
    fontFamily: Fonts.AvenirNextMedium
  },
  heading: {
    marginVertical: 10,
    color: Colors.light_gray,
    fontFamily: Fonts.AvenirNextItalic
  },
});
