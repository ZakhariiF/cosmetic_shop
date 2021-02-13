import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from 'constant';

const DottedView = ({containerStyle, number = 10}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {[...Array(number)].map((_, ind) => {
        return <View key={ind} style={styles.dashed} />;
      })}
    </View>
  );
};

export default DottedView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  dashed: {
    height: 4,
    width: 4,
    backgroundColor: Colors.dashed,
    borderRadius: 2,
    marginRight: 15,
    overflow: 'hidden',
  },
});
