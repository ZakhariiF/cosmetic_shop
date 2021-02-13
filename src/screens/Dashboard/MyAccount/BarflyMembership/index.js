import Button from 'components/Button';
import Header from 'components/Header/Header';
import {Colors, Images} from 'constant';
import React, {useState} from 'react';
import {ScrollView, View, Image, Text, ImageBackground} from 'react-native';
import rootStyle from 'rootStyle';
import styles from './styles';
import {screenBarfly} from 'constant/query';
import {useQuery} from '@apollo/client';
import Indicator from 'components/Indicator';
import {get} from 'lodash';

const BarflyMembership = () => {
  const BARFLY_QUERY = screenBarfly();
  const {data, error, loading} = useQuery(BARFLY_QUERY);
  const [membershipData, setMembershipData] = useState([]);

  React.useMemo(() => {
    if (loading || error) return null;

    setMembershipData(get(data, 'barfly.membershipsCollection.items', []));
  }, [loading, error, data]);

  const renderCredits = () => (
    <View style={styles.signatureContainer}>
      <Text style={styles.signatureText}>The Signature</Text>

      <View style={styles.flexRow}>
        <Text style={styles.dateText}>
          Next bill date: <Text style={styles.date}>11/23/20</Text>
        </Text>
        <View style={styles.seprator} />
        <Text style={[styles.dateText, {}]}>
          Last bill date: <Text style={styles.date}>10/23/20</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={rootStyle.container}>
      <Header isTab title="BARFLY MEMBERSHIP" />

      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <Text style={styles.headerTitle}>YOUR MEMBERSHIP</Text>

          {renderCredits()}

          <View style={styles.barflyContainer}>
            <Text style={styles.barfly}>Barfly Membership Options</Text>
          </View>

          <View style={styles.topContainer}>
            <Image style={styles.heart} source={Images.square_heart} />
            <View style={styles.headerContainer}>
              <View style={styles.dottBorderContainer}>
                <Text style={styles.headingText}>
                  {get(membershipData, '[0].title', '')}
                </Text>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <ImageBackground
                resizeMode="contain"
                source={Images.tip_img}
                style={styles.tipImg}>
                <Text style={styles.blowText}>
                  {get(membershipData, '[0].subtitle', '')}
                </Text>
              </ImageBackground>

              <Text style={styles.plus}>- PLUS -</Text>

              {get(membershipData, '[0].benefitsCollection.items', []).map(
                (e, i) => {
                  return (
                    <View key={i} style={styles.plusContainer}>
                      <Text style={styles.percentageText}>{e.name}</Text>
                      <Text style={styles.desc}>{e.value}</Text>
                    </View>
                  );
                },
              )}

              <Text style={styles.price}>
                ${get(membershipData, '[0].price', '')}{' '}
                <Text style={styles.monthText}> / month</Text>
              </Text>
              <Text style={styles.tax}>+ tax (where applicable)</Text>
            </View>
          </View>

          <Text style={styles.current}>Your Current Plan</Text>
          <View style={rootStyle.seprator} />

          <View style={[styles.topContainer, {marginTop: 15}]}>
            <Image style={styles.heart} source={Images.black_heart} />
            <View
              style={[
                styles.headerContainer,
                {backgroundColor: Colors.header_title},
              ]}>
              <View style={styles.dottBorderContainer}>
                <Text style={[styles.headingText, {color: Colors.white}]}>
                  {get(membershipData, '[1].title', '')}
                </Text>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <ImageBackground
                resizeMode="contain"
                source={Images.tip_img}
                style={styles.tipImg}>
                <Text style={styles.blowText}>
                  {get(membershipData, '[1].subtitle', '')}H
                </Text>
              </ImageBackground>

              <Text style={styles.plus}>- PLUS -</Text>

              {get(membershipData, '[1].benefitsCollection.items', []).map(
                (e, i) => {
                  return (
                    <View key={i} style={styles.plusContainer}>
                      <Text style={styles.percentageText}>{e.name}</Text>
                      <Text style={styles.desc}>{e.value}</Text>
                    </View>
                  );
                },
              )}

              <Text style={styles.price}>
                ${get(membershipData, '[1].price', '')}{' '}
                <Text style={styles.monthText}> / month</Text>
              </Text>
              <Text style={styles.tax}>+ tax (where applicable)</Text>
            </View>
          </View>

          <Button
            name="Upgrade to Premium"
            containerStyle={styles.buttonContainer}
          />

          <Text style={styles.cancelMembership}>Cancel Membership</Text>
        </View>
      </ScrollView>

      {loading ? <Indicator /> : null}
    </View>
  );
};

export default BarflyMembership;
