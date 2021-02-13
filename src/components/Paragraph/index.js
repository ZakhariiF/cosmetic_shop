import {Colors, Fonts} from 'constant';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

const Paragraph = ({containerStyle, heading, description}) => (
  <View style={[styles.container, rootStyle.shadow, containerStyle]}>
    <Text style={styles.headerTextStyle}>{heading.toUpperCase()}</Text>
    <Text style={styles.descriptionTextStyle}>{description}</Text>
  </View>
);

export default Paragraph;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8F9',
    width: '100%',
    padding: 20,
  },
  headerTextStyle: {
    fontSize: 30,
    fontFamily: Fonts.DCondensed,
    color: Colors.header_title,
  },
  descriptionTextStyle: {
    fontSize: 17,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
    marginTop: 15,
    lineHeight: 25,
  },
});
