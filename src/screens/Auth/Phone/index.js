import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {onregister} from '../thunks';
import Indicator from 'components/Indicator';
import {addToContactList} from 'services/Emarsys';
import {Colors} from 'constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {height} = Dimensions.get('window');

const Phone = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [isChecked, setChecked] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [showModal, setShowModal] = useState(false);

  const {
    params: {firstName, lastName, email, isEmailOptIn},
  } = route;

  const onNext = useCallback(async () => {
    dispatch(
      onregister({
        firstName,
        lastName,
        email,
        phone,
      }),
    ).then(async (response) => {
      if (response.type === 'REGISTER_SUCCESS') {
        if (isChecked) {
          const emarsysData = await addToContactList({
            sourceType: 'DrybarshopsUserReq',
            firstName,
            lastName,
            email,
            homePhone: 'Mobile Phone',
            phoneNumber: phone,
          });
          console.log('Emarsys response:', emarsysData);
        }
        if (isEmailOptIn) {
          const emarsysData = await addToContactList({
            sourceType: 'DrybarshopsUserReq',
            firstName,
            lastName,
            email,
            homePhone: 'Mobile Phone',
            phoneNumber: phone,
            isEmail: true,
          });
          console.log('Emarsys response:', emarsysData);
        }
        navigation.navigate('CheckEmail', {email});
      }
    });
  }, [firstName, lastName, email, phone]);

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="PHONE NUMBER" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>
            Please share your phone number so that we can communicate
            appointment information.
          </Text>
          <Input
            name="Phone"
            placeholder="707-555-1212"
            value={phone}
            onChangeText={(i) => setPhone(i)}
            keyboardType="number-pad"
            returnKeyType={'done'}
          />
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <CheckBox
              isChecked={isChecked}
              title="SMS opt in"
              onPressed={() => setChecked(!isChecked)}
            />
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              style={{marginLeft: 5}}
              color={Colors.header_title}
              onPress={() => {
                setShowModal(true);
              }}
            />
          </View>

          <Button
            disabled={phone.length < 10}
            name="Next"
            containerStyle={{marginTop: 40}}
            onButtonPress={onNext}
          />
        </View>
      </KeyboardAwareScrollView>
      <Modal visible={showModal} transparent={true}>
        <View style={[styles.modalWrapper, {height}]}>
          <View style={styles.modalContentWrapper}>
            <View style={{alignItems: 'flex-end'}}>
              <MaterialCommunityIcons
                name="close"
                size={25}
                style={{marginBottom: 8}}
                color={Colors.header_title}
                onPress={() => setShowModal(false)}
              />
            </View>
            <Text style={styles.modalContentText}>
              By clicking “SMS Opt-In”, you agree to be contacted for marketing
              purposes, including those sent through automation. Message and
              data rates may apply. Reply STOP to opt-out. Consent not required
              for purchase or booking. You can view our privacy policy at
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https://www.drybarshops.com/privacy-policy')
                }>
                <Text style={[styles.modalContentText, {textDecorationLine: 'underline'}]}>
                  drybarshops.com/privacy-policy
                </Text>
              </TouchableOpacity>{' '}
              for more information.
            </Text>
          </View>
        </View>
      </Modal>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default Phone;
