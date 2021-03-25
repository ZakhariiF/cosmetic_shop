import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts} from 'constant';
import {useDispatch, useSelector} from 'react-redux';
import {setActiveGuestTab} from 'screens/Dashboard/Booking/thunks';
import {get} from 'lodash';
import moment from 'moment';

const GuestTab = ({routeName}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.booking.totalGuests);
  const activeTab = useSelector((state) => state.booking.activeGuestTab);
  const isExtension = useSelector((state) => state.booking.isExtension);
  const scrollView = useRef();

  const [tabWidths, setTabWidths] = useState(data.map(() => 0));

  useEffect(() => {
    if (scrollView && scrollView.current) {
      scrollView.current.scrollTo({
        y: 0,
        x: tabWidths.slice(0, activeTab).reduce((s, c) => s + c, 0),
        animated: false,
      });
    }
  }, [activeTab, tabWidths]);

  const renderData = (index) => {
    switch (routeName) {
      case 'Services':
        return renderServices(index);
      case 'addons':
        return renderAddons(index);
      case 'dates':
        return renderDate(index);
      default:
        return;
    }
  };

  const renderServices = (index) => {
    if (get(data[index], 'services.Name')) {
      return `- ${data[index].services.Name}`;
    }
  };

  const renderAddons = (index) => {
    if (isExtension) {
      if (get(data[index], 'extension')) {
        return `- ${data[index].extension.name}`;
      }
    } else {
      if (get(data[index], 'addons')) {
        return `+ ${data[index].addons.length}`;
      }
    }
  };

  const renderDate = (index) => {
    if (get(data[index], 'date')) {
      return `- ${moment(data[index].date.time.open).format('h:mm a')}`;
    }
  };

  const onSelectTab = (e, i) => {
    dispatch(setActiveGuestTab(i));
  };

  const onLayout = useCallback(
    ({nativeEvent}, i) => {
      const widths = [...tabWidths];
      widths[i] = nativeEvent.layout.width;
      setTabWidths(widths);
    },
    [tabWidths],
  );

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.container}
        ref={scrollView}>
        {data.map((e, i) => {
          return (
            <TouchableOpacity
              onPress={(e) => onSelectTab(e, i)}
              key={i}
              onLayout={(e) => onLayout(e, i)}
              style={[
                styles.listContainer,
                activeTab == i && styles.activeTab,
              ]}
              accessible
              accessibilityLabel={`${e.userType} ${renderData(i)}`}
              accessibilityRole="tab">
              <Text
                style={[styles.listText, activeTab == i && styles.activeText]}>
                {e.userType} {renderData(i)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default GuestTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  listContainer: {
    backgroundColor: Colors.dimGray,
    marginRight: 2,
    minWidth: 120,
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 38,
    justifyContent: 'center',
  },
  listText: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  activeTab: {
    backgroundColor: Colors.white,
    borderTopWidth: 5,
    borderTopColor: Colors.yellow,
  },
  activeText: {
    fontFamily: Fonts.AvenirNextMedium,
    bottom: 1.1,
  },
});
