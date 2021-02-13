import React, {useState} from 'react';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import Button from 'components/Button';
import {Images} from 'constant';

import {View, Image, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import rootStyle from 'rootStyle';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DottedView from 'components/DottedView';
import { submitContact } from "services/Wufoo";

const contactUsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short')
    .nullable()
    .required('Name Field is required'),
  email: Yup.string().email().nullable().required('Email Field is required'),
  phoneNumber: Yup.string()
    .nullable()
    .required('This field is required')
    .matches(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g, 'Invalid phone number'),
  message: Yup.string().nullable().required('This Field is required.'),
});

const Contactus = () => {

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (values) => {
    console.log('Values:', values);
    try {
      const data = await submitContact(values);
      console.log('Response: ', data);
      if (data.Success) {
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
            resizeMode="contain"
            style={styles.topImage}
            source={Images.get_touch}
          />
        </View>
        {
          showSuccess &&
          <Text style={[styles.writeMsg, {fontSize: 20, textAlign: 'center'}]}>You have submitted successfully</Text>
        }
        {
          !showSuccess && <View style={rootStyle.innerContainer}>
            <Text style={styles.writeMsg}>Write us a message.</Text>
            <Formik
              initialValues={{}}
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
                  <Button onButtonPress={submitForm} name={'Submit'} disabled={isSubmitting} />
                </>
              )}
            </Formik>

            <Text style={styles.writeMsg}>Follow us on social media.</Text>

            <View style={styles.socialContainer}>
              <View style={styles.instaContainer}>
                <AntDesign name="instagram" size={30} />
                <Text style={styles.instaName}>@thedrybar</Text>
              </View>

              <View style={styles.instaContainer}>
                <EvilIcons name="sc-facebook" size={30} />
                <Text style={styles.instaName}>/thedrybar</Text>
              </View>
            </View>

            <Text style={styles.writeMsg}>Need another help? Call Us.</Text>
            <View style={styles.serviceContainer}>
              <Text style={styles.serviceHeader}>Drybar Services</Text>
              <View style={styles.serviceInnerCont}>
                <Text style={styles.number}>(877) 379-2279</Text>
                <Image
                  resizeMode="contain"
                  style={styles.callIcon}
                  source={Images.call}
                />
              </View>
            </View>

            <View style={styles.serviceContainer}>
              <Text style={styles.serviceHeader}>Drybar Products</Text>
              <View style={styles.serviceInnerCont}>
                <Text style={styles.number}>(800) 646-4479</Text>
                <Image
                  resizeMode="contain"
                  style={styles.callIcon}
                  source={Images.call}
                />
              </View>
            </View>

            <View style={styles.dotContainer}>
              <DottedView number={200} />
            </View>

            <View style={styles.bottomImg}>
              <Image source={Images.giftcard} style={styles.bottomIcon} />
            </View>
          </View>
        }
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Contactus;
