import CheckBox from 'components/Checkbox';
import GuestTab from 'components/GuestTab';
import {Colors, Fonts} from 'constant';
import {get} from 'lodash';
import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import rootStyle from 'rootStyle';
import {setmemberCount} from '../thunks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const data = [
  {name: 'Yes', price: 20},
  {name: 'No', price: 0},
];

const Extensions = ({navigation, onSkip}) => {
  const [isChecked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeTab = useSelector((state) => state.booking.activeGuestTab);

  const renderExtension = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onExtension(item)}
        style={[styles.listContainer, isExist(item) && styles.activeListTab]}>
        <Text style={[styles.itemName, isExist(item) && styles.activeName]}>
          {item.name}
        </Text>
        {get(item, 'price') ? (
          <Text style={rootStyle.commonText}>${item.price}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const isExist = (item) => {
    let isActive = false;

    if (get(totalGuests[activeTab], 'extension')) {
      let guest = totalGuests[activeTab];
      if (get(guest.extension, 'name') === item.name) {
        isActive = true;
      }
    }

    return isActive;
  };

  const onExtension = (item) => {
    console.log('On Extension:', item)
    let tempArr = [...totalGuests];
    tempArr[activeTab].extension = item;
    dispatch(setmemberCount(tempArr));
  };

  return (
    <View style={rootStyle.innerContainer}>
      <View style={styles.noticeContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={16}
          color={Colors.header_title}
        />

        <Text style={styles.noticeText}>
          Learn about our extension policy{' '}
          <Text style={{textDecorationLine: 'underline'}}>here.</Text>
        </Text>
      </View>

      {totalGuests.length > 1 ? (
        <>
          <Text style={styles.heading}>
            Adds approximately 20 mins to your service.
          </Text>

          <TouchableOpacity style={styles.skipContainer} onPress={onSkip}>
            <Text style={styles.skip}>No extensions in our party</Text>
          </TouchableOpacity>

          <GuestTab routeName="addons" />
        </>
      ) : null}

      <FlatList
        contentContainerStyle={styles.container}
        data={data}
        renderItem={renderExtension}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => (
          <CheckBox
            onPressed={() => setChecked(!isChecked)}
            isChecked={isChecked}
            titile="Don’t ask me again."
          />
        )}
        ListFooterComponentStyle={styles.footerComponent}
      />
    </View>
  );
};

export default Extensions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '10%',
  },
  listContainer: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...rootStyle.shadow,
    marginVertical: 8,
  },
  itemName: {
    ...rootStyle.commonText,
    fontSize: 18,
  },
  activeListTab: {
    backgroundColor: Colors.yellow,
  },
  activeName: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  footerComponent: {
    alignItems: 'center',
  },
  heading: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    marginTop: 10,
  },
  skipContainer: {
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.dimGray,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  skip: {
    ...rootStyle.commonText,
    fontSize: 18,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  noticeText: {
    ...rootStyle.commonText,
    marginLeft: 8,
  },
});
