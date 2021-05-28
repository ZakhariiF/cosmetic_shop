import CheckBox from 'components/Checkbox';
import GuestTab from 'components/GuestTab';
import {Colors, Fonts} from 'constant';
import {get} from 'lodash';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import rootStyle from 'rootStyle';
import {setmemberCount, getServices} from '../thunks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Extensions = ({onNext}) => {
  const [isChecked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeTab = useSelector((state) => state.booking.activeGuestTab);
  const extensionAddon = useSelector((state) => state.booking.extensionAddon);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const services = useSelector((state) => state.booking.services);
  const navigation = useNavigation();

  const data = [
    {name: 'No', price: 0},
    {name: 'Yes', price: get(extensionAddon, 'Price.Amount', 0)},
  ];

  useEffect(() => {
    if (
      !services.length &&
      selectedLocation &&
      selectedLocation.bookerLocationId
    ) {
      dispatch(getServices(selectedLocation.bookerLocationId));
    }
  }, [selectedLocation]);

  const renderExtension = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onExtension(item)}
        accessible
        accessibilityLabel={item.name}
        accessibilityRole="button"
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
    let tempArr = [...totalGuests];
    tempArr[activeTab].extension = item;

    dispatch(setmemberCount(tempArr));

    if (!tempArr.find((i) => !i.extension)) {
      onNext();
    }
  };

  const noExtensions = () => {
    let tempArr = [...totalGuests].map((item) => {
      item.extension = null;
      return item;
    });

    dispatch(setmemberCount(tempArr));

    onNext();
  }

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
          <Text
            style={{textDecorationLine: 'underline', fontWeight: 'bold'}}
            accessible
            accessibilityLabel="Extension Policy"
            accessibilityRole="link"
            onPress={() =>
              navigation.navigate('Account', {
                screen: 'ExtensionPolicy',
              })
            }>here.</Text>
        </Text>
      </View>

      {totalGuests.length > 1 ? (
        <>
          <Text style={styles.heading}>
            Adds approximately 20 mins to your service.
          </Text>

          <TouchableOpacity
            style={styles.skipContainer}
            onPress={noExtensions}
            accessible
            accessibilityLabel="No extensions in our party"
            accessibilityRole="button">
            <Text style={styles.skip}>No extensions in our party</Text>
          </TouchableOpacity>

          <GuestTab routeName="addons" />
        </>
      ) : null}

      <FlatList
        style={{marginBottom: '20%', marginTop: 20}}
        data={data}
        renderItem={renderExtension}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => (
          <CheckBox
            onPressed={() => setChecked(!isChecked)}
            isChecked={isChecked}
            title="Don’t ask me again."
          />
        )}
        ListFooterComponentStyle={styles.footerComponent}
      />
    </View>
  );
};

export default Extensions;

const styles = StyleSheet.create({
  listContainer: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...rootStyle.shadow,
    marginVertical: 8,
    flexDirection: 'row'
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
    alignItems: 'center'
  },
  noticeText: {
    ...rootStyle.commonText,
    marginLeft: 8,
  },
});
