import {Colors, Fonts, Images} from 'constant';
import {get} from 'lodash';
import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import Button from 'components/Button'
import rootStyle from 'rootStyle';

const AccountServiceItem = ({item, navigation, isService}) => {
  const serviceTime = get(item, 'serviceTime')
  return (
    <View style={styles.itemContainer}>
      <Image
        style={styles.icon}
        resizeMode="contain"
        source={{uri: get(item, 'imagesCollection.items[0].desktopMedia.url')}}
      />
      <View style={styles.bottomContainer}>
        <Text style={styles.name}>{get(item, 'title')}</Text>
        <Text style={styles.price}>${get(item, 'price')}</Text>

        <Text style={styles.desc}>
          {get(item, 'description.json.content[0].content[0].value')}
        </Text>
      </View>
      {isService && serviceTime && <View style={styles.serviceTime}>
          <Text>Service Time: {serviceTime} mins</Text>
        </View>
      }
      <Button onButtonPress={()=> navigation.navigate('Book', {screen: 'Location'})} name={"Book Now"} />
    </View>
  );
};

export default AccountServiceItem;

const styles = StyleSheet.create({
  itemContainer: {
    ...rootStyle.shadow,
    backgroundColor: Colors.white,
    width: '48%',
    marginVertical: 8
  },
  icon: {
    height: 178,
    width: '98%',
    marginVertical: 2,
    alignSelf: 'center',
    marginTop: -10,
  },
  nameContainer: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10
  },
  serviceTime: {
    backgroundColor: Colors.bg,
    padding: 5,
    marginBottom: 10
  },
  name: {
    fontFamily: Fonts.DCondensed,
    fontSize: 25,
    color: Colors.header_title,
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  desc: {
    ...rootStyle.commonText,
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: '3%',
    maxHeight: 300,
    minHeight: 300,
    paddingBottom: 20
  },
});
