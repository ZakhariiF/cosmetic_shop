import React, {useMemo, useState} from 'react';
import {useQuery} from '@apollo/client';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import {Fonts, Images} from 'constant';
import {screenExtensionPolicy} from 'constant/query';
import {get} from 'lodash';
import {ScrollView, Text, View} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';
import HTMLView from 'react-native-htmlview';
import {documentToHtmlString} from '@contentful/rich-text-html-renderer';

const ExtensionPolicy = () => {
  const EXTENSION_POLICY = screenExtensionPolicy();
  const {data, error, loading} = useQuery(EXTENSION_POLICY);
  console.log('Extension Policy:', data);

  return (
    <View style={rootStyle.container}>
      <Header title="EXTENSION POLICY" isTab isBack />
      <ScrollView contentContainerStyle={{paddingTop: 20}}>
        <View style={rootStyle.innerContainer}>
          <Text style={styles.headerText}>
            {get(data, 'screenCollection.items[0].title', '')}
          </Text>
          <View style={[styles.topContainer, {paddingBottom: 30}]}>
            {!!data && (
              <HTMLView
                value={documentToHtmlString(
                  get(data, 'screenCollection.items[0].description.json', null),
                )}
                stylesheet={styles}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {loading ? <Indicator /> : null}
    </View>
  );
};

export default ExtensionPolicy;
