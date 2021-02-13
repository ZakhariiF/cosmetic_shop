import React from 'react';
import {SectionList, View, Text, Image, TouchableOpacity} from 'react-native';
import Header from 'components/Header/Header';
import {Images} from 'constant';
import {AccounData} from 'constant/Staticarray';
import rootStyle from 'rootStyle';
import ScreenOptions from './ScreenOptions';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {logoutSuccess} from 'screens/Auth/thunks';

const MyAccount = ({navigation}) => {
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logoutSuccess());
  };

  return (
    <View style={rootStyle.container}>
      <Header isBack={false} isTab title="MY ACCOUNT" />
      <View style={rootStyle.innerContainer}>
        <ScreenOptions navigation={navigation} />

        <SectionList
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          sections={AccounData}
          renderSectionHeader={({section}) => <HeaderItem {...section} />}
          renderItem={({item}) => {
            return <Item title={item} navigation={navigation} />;
          }}
          keyExtractor={(_, index) => index.toString()}
          ListFooterComponent={() => (
            <View style={styles.logoutContainer}>
              <TouchableOpacity onPress={onLogout} style={styles.logoutBox}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
              <Text style={styles.appVersion}>App Version 1.12 10/2020</Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
        />
      </View>
    </View>
  );
};

export default MyAccount;

const Item = ({title, navigation}) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={() => {
      title.route ? navigation.navigate(title.route) : null;
    }}>
    <Text style={styles.itemTitle}>{title.name}</Text>
    <Image source={Images.right_arrow} />
  </TouchableOpacity>
);

const HeaderItem = ({title, icon}) => (
  <Text style={styles.headerTitle}>{title}</Text>
);
