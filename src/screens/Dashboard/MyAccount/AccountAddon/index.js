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

  return (
    <View style={rootStyle.container}>
      <Header title="ADD ONS" isTab isBack />
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.topImage}
          source={Images.addon_top}
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
              return <AccountServiceItem key={i} item={e} navigation={navigation}/>;
            })}
          </View>

          <DottedView number={250} />
          <TouchableOpacity onPress={() => navigation.navigate('Book')}>
            <View style={styles.bottomImg}>
              <Image source={Images.service_top} style={styles.bottomIcon} />
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
      {loading ? <Indicator /> : null}
    </View>
  );
};

export default AccountAddon;
