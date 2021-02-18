import {useQuery} from '@apollo/client';
import AccountServiceItem from 'components/AccountServiceItem';
import DottedView from 'components/DottedView';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import {Images} from 'constant';
import {screenAddOnsCollections} from 'constant/query';
import {get} from 'lodash';
import React from 'react';
import {Image, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';

const AccountAddon = ({navigation}) => {
  const ADDON_QUERY = screenAddOnsCollections();
  const {data, error, loading} = useQuery(ADDON_QUERY);

  console.log('data>>>>>>', data);

  let topImage = get(
    data,
    'screenProductCollection.items[0].marketingComponentsCollection.items[0]',
  );

  if (get(topImage, 'image')) {
    topImage = topImage.image;
  }
  let bottomImage = get(
    data,
    'screenProductCollection.items[0].marketingComponentsCollection.items[1]',
  );

  if (get(bottomImage, 'image')) {
    bottomImage = bottomImage.image;
  }

  return (
    <View style={rootStyle.container}>
      <Header title="ADD ONS" isTab isBack />
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.topImage}
          source={{
            uri:
              get(topImage, 'mobileMedia.url') ||
              get(topImage, 'desktopMedia.url'),
          }}
        />
        <View style={rootStyle.innerContainer}>
          <View style={styles.topContainer}>
            <Text style={styles.headingText}>
              {get(
                data,
                'screenProductCollection.items[0].description.json.content[0].content[0].value',
              )}
            </Text>
            <Text style={styles.descText}>
              {get(
                data,
                'screenProductCollection.items[0].description.json.content[0].content[1].value',
              )}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {get(
              data,
              'screenProductCollection.items[0].productsCollection.items',
              [],
            ).map((e, i) => {
              return (
                <AccountServiceItem key={i} item={e} navigation={navigation} />
              );
            })}
          </View>

          <DottedView number={250} />
          <TouchableOpacity onPress={() => navigation.navigate('Book')}>
            <View style={styles.bottomImg}>
              <Image
                source={{
                  uri:
                    get(bottomImage, 'mobileMedia.url') ||
                    get(bottomImage, 'desktopMedia.url'),
                }}
                style={styles.bottomIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading ? <Indicator /> : null}
    </View>
  );
};

export default AccountAddon;
