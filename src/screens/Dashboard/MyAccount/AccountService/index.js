import {useQuery} from '@apollo/client';
import AccountServiceItem from 'components/AccountServiceItem';
import Button from 'components/Button';
import DottedView from 'components/DottedView';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import {Images} from 'constant';
import {screenAddOnsCollections} from 'constant/query';
import {get} from 'lodash';
import React from 'react';
import {Image, ScrollView, View, Text} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';

const AccountService = ({navigation}) => {
  const SERVICE_QUERY = screenAddOnsCollections();
  const {data, error, loading} = useQuery(SERVICE_QUERY);

  return (
    <View style={rootStyle.container}>
      <Header title="SERVICES" isTab isBack />
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.topImage}
          source={Images.service_top}
        />
        <View style={rootStyle.innerContainer}>
          <View style={styles.topContainer}>
            <Text style={styles.headingText}>
              {get(
                data,
                'screenProductCollection.items[1].description.json.content[0].content[0].value',
              )}
            </Text>
            <Text style={styles.descText}>
              {get(
                data,
                'screenProductCollection.items[1].description.json.content[0].content[1].value',
              )}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {get(
              data,
              'screenProductCollection.items[1].productsCollection.items',
              [],
            ).map((e, i) => {
              return <AccountServiceItem key={i} item={e} isService navigation={navigation} />;
            })}
          </View>

          <DottedView number={250} />

          <View style={styles.bottomImg}>
            <Image source={Images.addon_top} style={styles.bottomIcon} />
          </View>
          <Button name="Book Now" containerStyle={styles.buttonContainer} />
        </View>
      </ScrollView>
      {loading ? <Indicator /> : null}
    </View>
  );
};

export default AccountService;
