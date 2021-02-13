import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Button from 'components/Button';
import Header from 'components/Header/Header';
import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';

const Stylists = () => {
  return (
    <View style={rootStyle.container}>
      <Header title="STYLIST" />
      <View style={rootStyle.innerContainer}>
        <Text style={styles.heading}>
          All of our stylists are awesome but if you have a favorite lorem ispum
          dolor consectuer
        </Text>
        <Button isWhite name="Any Stylist" />

        <View style={rootStyle.seprator} />

        <FlatList
          style={{marginVertical: 20}}
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <Button
              isWhite={index !== 0}
              name="Alex A."
              containerStyle={[
                styles.listItem,
                index == 0 && styles.activeListItem,
              ]}
              titleStyle={index == 0 && styles.activeTitle}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Stylists;

const styles = StyleSheet.create({
  heading: {
    ...rootStyle.commonText,
    textAlign: 'center',
  },
  listItem: {
    marginVertical: 5,
    height: 60,
  },
  activeListItem: {
    backgroundColor: Colors.yellow,
  },
  activeTitle: {
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
  },
});
