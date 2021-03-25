import React, {useMemo, useState} from 'react';
import {useQuery} from '@apollo/client';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import {Fonts, Images} from 'constant';
import {screenPrivacyPolicy} from 'constant/query';
import {get} from 'lodash';
import HTMLView from 'react-native-htmlview';
import {
  Image,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';

import {documentToHtmlString} from '@contentful/rich-text-html-renderer';

const CaliforniaResidents = () => {
  const PRIVACY_POLICY = screenPrivacyPolicy();
  const {data, error, loading} = useQuery(PRIVACY_POLICY);
  const [policies, setPolicies] = useState([]);
  const [toggleIndex, setToggle] = useState([]);

  useMemo(() => {
    if (loading || error) {
      return null;
    }
    setPolicies(
      get(
        data,
        'screen.marketingComponentsCollection.items[0].marketingComponentsCollection.items',
        [],
      ),
    );
  }, [loading, error, data]);

  const checkToggle = (index) => {
    let isToggle = false;

    if (toggleIndex.includes(index)) {
      isToggle = true;
    }

    return isToggle;
  };

  const onToggle = (i) => {
    let tempArr = [...toggleIndex];

    if (checkToggle(i)) {
      tempArr = tempArr.filter((e) => e != i);
    } else {
      tempArr.push(i);
    }
    setToggle(tempArr);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  function combine(arr) {
    let temp = arr.reduce((data, item, i) => {
      console.log('data', data, item, i);
      return data.concat(item.value);
    }, '');

    console.log('tempa>', temp);
    return temp;
  }

  // console.log('combine', combine(arr));

  return (
    <View style={rootStyle.container}>
      <Header title="CALIFONIA RESIDENTS" isTab isBack isUppercaseTitle />
      <ScrollView contentContainerStyle={{paddingTop: 20}}>
        <View style={rootStyle.innerContainer}>
          <View style={[styles.topContainer, {paddingBottom: 30}]}>
            {data && (
              <HTMLView
                value={documentToHtmlString(
                  get(data, 'screen.description.json'),
                )}
                stylesheet={styles}
              />
            )}
          </View>

          {policies.map((e, i) => {
            // console.log('policy>>>', e);
            return (
              <View key={i} style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={() => onToggle(i)}
                  accessible
                  accessibilityLabel="Toggle to show the answer"
                  accessibilityRole="button"
                  style={styles.flexContainer}>
                  <Text style={styles.headerText}>{get(e, 'question')}</Text>
                  <Image
                    style={[
                      checkToggle(i) && {transform: [{rotate: '180deg'}]},
                    ]}
                    source={Images.down_arrow}
                  />
                </TouchableOpacity>

                {checkToggle(i) &&
                  get(e, 'answer.json.content', []).map((item) => {
                    // console.log('answer item,', item);
                    return get(item, 'content', []).map((element, index) => {
                      // console.log('element item>>>', element);
                      return (
                        <>
                          <Text
                            key={index}
                            style={rootStyle.commonText}>{`\n ${get(
                            element,
                            'value',
                            '',
                          )}`}</Text>

                          {get(element, 'content', []).map((nextElement) => {
                            // console.log('nextElement>>', nextElement);

                            return (
                              <View
                                style={
                                  {
                                    // flexDirection: 'row',
                                    // flexWrap: 'wrap',
                                    // justifyContent: 'space-between',
                                  }
                                }>
                                {get(nextElement, 'content', []).map(
                                  (newElement, newIndex, arr) => {
                                    return (
                                      <View style={{flexDirection: 'row'}}>
                                        <View style={styles.dotView} />
                                        <Text
                                          key={newIndex}
                                          style={[
                                            rootStyle.commonText,
                                            {
                                              fontFamily:
                                                Fonts.AvenirNextMedium,
                                            },
                                          ]}>
                                          {get(arr, '[0].value', '')}
                                          <Text style={rootStyle.commonText}>
                                            {get(arr, '[1].value', '')}
                                          </Text>
                                        </Text>
                                      </View>
                                    );
                                  },
                                )}
                              </View>
                            );
                          })}
                        </>
                      );
                    });
                  })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {loading ? <Indicator /> : null}
    </View>
  );
};

export default CaliforniaResidents;
