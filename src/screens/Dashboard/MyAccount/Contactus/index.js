import React, {useState} from 'react';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {useQuery} from '@apollo/client';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import Button from 'components/Button';
import {Images} from 'constant';

import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {get} from 'lodash';
import rootStyle from 'rootStyle';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DottedView from 'components/DottedView';
import {submitContact} from 'services/Wufoo';
import {contactUsQuery} from 'constant/query';
import Indicator from 'components/Indicator';
import {call} from 'utils';

const contactUsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Error: name is Too Short')
    .nullable()
    .required('Error: name is required'),
  email: Yup.string().email().nullable().required('Error: email is required'),
  phoneNumber: Yup.string()
    .nullable()
    .required('Error: phone number is required')
    .matches(
      /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g,
      'Error: phone number is invalid',
    ),
  message: Yup.string().nullable().required('Error: message is required'),
});

const CONTACT_US_QUERY = contactUsQuery();

const Contactus = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {data, error, loading} = useQuery(CONTACT_US_QUERY);

  const onSubmit = async (values) => {
    try {
      const res = await submitContact(values);
      if (res.Success) {
        setShowSuccess(true);
      }
    } catch (e) {
      console.log('Error', e, e.response);
    }
  };

  return (
    <View style={rootStyle.container}>
      <Header title="CONTACT US" isTab isBack />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.topImg}>
          <Image
            resizeMode="cover"
            style={styles.topImage}
            source={{
              uri: get(data, 'screenContactCollection.items[0].hero.url'),
            }}
          />
        </View>
        {showSuccess ? (
          <Text style={[styles.writeMsg, {fontSize: 20, textAlign: 'center'}]}>
            You have submitted successfully
          </Text>
        ) : (
          <View style={rootStyle.innerContainer}>
            <Text style={styles.writeMsg}>Send us a message.</Text>
            <Formik
              initialValues={{
                name: '',
                email: '',
                phoneNumber: '',
                message: '',
              }}
              enableReinitialize
              onSubmit={onSubmit}
              validationSchema={contactUsSchema}>
              {({submitForm, isSubmitting}) => (
                <>
                  <View style={styles.inputContainer}>
                    <Field name={'name'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'name'}
                            name={'Name'}
                            inputName={'name'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'email'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'email'}
                            name={'Email'}
                            inputName={'email'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'phoneNumber'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'phone_number'}
                            name={'Phone Number'}
                            inputName={'phoneNumber'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                  </View>
                  <Field name={'message'}>
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.yourmsg}>Message</Text>
                        <TextInput
                          id={'message'}
                          name={'message'}
                          multiline
                          onChangeText={(e) => setFieldValue(field.name, e)}
                          style={styles.input}
                        />
                        {!!meta.error && meta.touched && (
                          <Text style={styles.errorText}>{meta.error}</Text>
                        )}
                      </View>
                    )}
                  </Field>
                  <Button
                    onButtonPress={submitForm}
                    name={'Submit'}
                    disabled={isSubmitting}
                  />
                </>
              )}
            </Formik>

            <Text style={styles.writeMsg}>Follow us on social media.</Text>

            <View style={styles.socialContainer}>
              <View style={styles.instaContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      get(
                        data,
                        'screenContactCollection.items[0].instagramUrl',
                      ),
                    )
                  }
                  accessible
                  accessibilityLabel="Check Instagram"
                  accessibilityRole="link">
                  <AntDesign name="instagram" size={30} />
                  <Text style={styles.instaName}>
                    {get(data, 'screenContactCollection.items[0].instagram')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.instaContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      get(data, 'screenContactCollection.items[0].facebookUrl'),
                    )
                  }
                  accessible
                  accessibilityLabel="Check Facebook"
                  accessibilityRole="link">
                  <EvilIcons name="sc-facebook" size={30} />
                  <Text style={styles.instaName}>
                    {get(data, 'screenContactCollection.items[0].facebook')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.writeMsg}>Need help? Call us.</Text>
            <View style={styles.serviceContainer}>
              <Text style={styles.serviceHeader}>Drybar Services</Text>
              <TouchableOpacity
                onPress={() =>
                  call(get(data, 'screenContactCollection.items[0].phone1'))
                }
                accessible
                accessibilityLabel="Contact us"
                accessibilityRole="button">
                <View style={styles.serviceInnerCont}>
                  <Text style={styles.number}>
                    {get(data, 'screenContactCollection.items[0].phone1')}
                  </Text>
                  <Image
                    resizeMode="contain"
                    style={styles.callIcon}
                    source={Images.call}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceContainer}>
              <Text style={styles.serviceHeader}>Drybar Products</Text>
              <TouchableOpacity
                onPress={() =>
                  call(get(data, 'screenContactCollection.items[0].phone1'))
                }
                accessible
                accessibilityLabel="Contact us"
                accessibilityRole="button">
                <View style={styles.serviceInnerCont}>
                  <Text style={styles.number}>
                    {get(data, 'screenContactCollection.items[0].phone2')}
                  </Text>
                  <Image
                    resizeMode="contain"
                    style={styles.callIcon}
                    source={Images.call}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.dotContainer}>
              <DottedView number={200} />
            </View>

            <View style={styles.bottomImg}>
              <Image source={Images.hint} style={styles.bottomIcon} />
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      {loading && <Indicator />}
    </View>
  );
};

export default Contactus;
