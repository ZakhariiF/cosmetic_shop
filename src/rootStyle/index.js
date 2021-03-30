const {StyleSheet} = require('react-native');
const {Colors, Fonts} = require('../constant');

const rootStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
  },
  seprator: {
    height: 1,
    backgroundColor: Colors.seprator,
    width: '100%',
  },
  commonText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  commonHeader: {
    fontSize: 25,
    lineHeight: 30,
    color: Colors.header_title,
    fontFamily: Fonts.DCondensed,
    paddingVertical: '10%',
    paddingHorizontal: 15,
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: Colors.yellow,
  },
  activeButtonText: {
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
  },
  sizeBox: {
    height: 10,
  },

  ////// my styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default rootStyle;
