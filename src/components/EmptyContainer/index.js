import {Fonts} from 'constant';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import rootStyle from 'rootStyle';

const EmptyContainer = ({emptyText}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{emptyText}</Text>
    </View>
  );
};

export default EmptyContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
