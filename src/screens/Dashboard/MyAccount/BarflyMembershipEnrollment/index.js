import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {ScrollView, View, Text, TextInput} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import Header from 'components/Header/Header';
import Button from 'components/Button';
import Input from 'components/Input';

import Indicator from 'components/Indicator';
import {getCustomerDetails} from '../thunks';
import usStates from 'constant/usStates';
import cardTypes from 'constant/cardType';

import rootStyle from 'rootStyle';
import styles from './styles';

const CustomerSchema = Yup.object().shape({
  FirstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  LastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  Address: Yup.object().shape({
    Street1: Yup.string().nullable().required('This field is required'),
    City: Yup.string().nullable().required('This field is required'),
    Zip: Yup.string().nullable().required('This field is required'),
  }),
  Email: Yup.string().email().required('This field is required'),
  CellPhone: Yup.string()
    .nullable()
    .required('This field is required')
    .matches(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g, 'Invalid phone number'),
  CustomField: Yup.object().shape({
    Card: Yup.object().shape({
      NameOnCard: Yup.string().nullable().required('This field is required'),
      Number: Yup.string().nullable().required('This field is required'),
      Type: Yup.string().nullable().required('This field is required'),
      SecurityCode: Yup.string().nullable().required('This field is required'),
      Address: Yup.object().shape({
        City: Yup.string().nullable().required('This field is required'),
      }),
      Year: Yup.number().required('This field is required'),
      Month: Yup.number().required('This field is required'),
    }),
    Birth: Yup.object().shape({
      Year: Yup.number().required('This field is required'),
      Month: Yup.number().required('This field is required'),
      Day: Yup.number().required('This field is required'),
    }),
  }),
});

const BarflyMembershipEnrollment = ({navigation, route}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const customerDetails = useSelector((state) => state.account.details);
  const customerDetailsLoading = useSelector(
    (state) => state.account.accountLoading,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!route.params.membership) {
      navigation.navigate('BarflyMembership');
    }
  }, [route]);

  useEffect(() => {
    const customerId = get(userInfo, 'profile.bookerId');
    if (customerId) {
      dispatch(getCustomerDetails(customerId));
    }
  }, [userInfo]);

  const goToConfirmBarfly = (values) => {
    const updatedBirth = values.CustomField.Birth;
    const updatedCard = values.CustomField.Card;

    delete values.CustomField;

    let dateOfBirthOffset = new Date(
      updatedBirth.Year,
      updatedBirth.Month,
      updatedBirth.Day,
    ).toISOString();
    dateOfBirthOffset = `${dateOfBirthOffset.split('T')[0]}T00:00:00+00:00`;
    const customer = {
      ...values,
      DateOfBirthOffset: dateOfBirthOffset,
    };

    navigation.navigate('BarflyConfirm', {
      customer,
      card: updatedCard,
      membership: route.params.membership,
      thankMessage: route.params.thankMessage,
    });
  };

  const CustomerField = (label, fieldName) => (
    <Field name={fieldName}>
      {({field, meta, form: {setFieldValue}}) => (
        <View>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            onChangeText={(t) => setFieldValue(fieldName, t)}
            value={field.value}
            name={fieldName}
            style={[styles.inputContainer]}
          />
          {!!meta.error && meta.touched && (
            <Text style={styles.errorText}>{meta.error}</Text>
          )}
        </View>
      )}
    </Field>
  );

  const MonthElems = () => {
    const monthOptions = [];

    for (let i = 0; i < 12; i++) {
      monthOptions.push(
        <Picker.Item
          style={{padding: 20}}
          value={i}
          key={i}
          label={`${i + 1}`}
        />,
      );
    }
    return monthOptions;
  };

  const DayElems = () => {
    const dayOptions = [];

    for (let i = 0; i < 31; i++) {
      dayOptions.push(
        <Picker.Item
          style={{padding: 20}}
          value={i}
          key={i}
          label={`${i + 1}`}
        />,
      );
    }
    return dayOptions;
  };

  const YearElems = () => {
    const yearOptions = [];

    const currentYear = new Date().getFullYear();
    const firstYear = currentYear - 100;

    for (let i = 0; i < 100; i++) {
      yearOptions.push(
        <Picker.Item
          style={{padding: 20}}
          value={firstYear + i}
          key={i}
          label={`${firstYear + i + 1}`}
        />,
      );
    }
    return yearOptions;
  };

  const CardYearElems = () => {
    const firstYear = new Date().getFullYear();
    const yearOptions = [];

    for (let i = 0; i < 10; i++) {
      yearOptions.push(
        <Picker.Item
          style={{padding: 20}}
          value={firstYear + i}
          key={i}
          label={`${firstYear + i}`}
        />,
      );
    }

    return yearOptions;
  };

  return (
    <View style={rootStyle.container}>
      <Header isTab title="BARFLY MEMBERSHIP" />

      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <Formik
            initialValues={{
              ...customerDetails,
              CustomField: {
                Card: {},
                Birth: {},
              },
            }}
            enableReinitialize
            onSubmit={goToConfirmBarfly}
            validationSchema={CustomerSchema}>
            {({submitForm, errors}) => (
              <View>
                {console.log(errors)}
                <View>
                  <Text style={styles.title}>GENERAL INFORMATION</Text>
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />

                  {CustomerField('First Name', 'FirstName')}
                  {CustomerField('Last Name', 'LastName')}
                  {CustomerField('Email', 'Email')}
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>State</Text>
                    <Field name="State">
                      {({field, form: {setFieldValue}}) => (
                        <Picker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue('State', itemValue)
                          }
                          style={styles.innerContainer}>
                          {usStates.map((s) => (
                            <Picker.Item
                              value={s.name}
                              key={s['alpha-2']}
                              label={s.name}
                            />
                          ))}
                        </Picker>
                      )}
                    </Field>
                  </View>
                  {CustomerField('Address 1', 'Address.Street1')}
                  {CustomerField('Address 2', 'Address.Street2')}
                  {CustomerField('City', 'Address.City')}
                  {CustomerField('Postal Code', 'Address.Zip')}
                  {CustomerField('Phone Number', 'CellPhone')}
                </View>

                <View>
                  <Text style={styles.title}>PAYMENT INFORMATION</Text>
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />
                  {CustomerField('Name on Card', 'CustomField.Card.NameOnCard')}
                  {CustomerField(
                    'Credit Card Number',
                    'CustomField.Card.Number',
                  )}
                  {CustomerField('City', 'CustomField.Card.Address.City')}
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>State</Text>
                    <Field name="CustomField.Card.Address.State">
                      {({field, form: {setFieldValue}}) => (
                        <Picker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue(field.name, itemValue)
                          }>
                          {usStates.map((s) => (
                            <Picker.Item
                              value={s.name}
                              key={s['alpha-2']}
                              label={s.name}
                            />
                          ))}
                        </Picker>
                      )}
                    </Field>
                  </View>
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>Type</Text>
                    <Field name="CustomField.Card.Type">
                      {({field, form: {setFieldValue}}) => (
                        <Picker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue(field.name, itemValue)
                          }>
                          {cardTypes.map((s) => (
                            <Picker.Item
                              value={s.id}
                              key={s.id}
                              label={s.label}
                            />
                          ))}
                        </Picker>
                      )}
                    </Field>
                  </View>
                  <View style={styles.birthdayWrapper}>
                    <View style={[styles.birthdayElem, styles.inputContainer]}>
                      <Text style={styles.inputLabel}>Month</Text>
                      <Field name="CustomField.Card.Month">
                        {({field, form: {setFieldValue}}) => (
                          <Picker
                            selectedValue={field.value}
                            onValueChange={(itemValue) =>
                              setFieldValue(field.name, itemValue)
                            }>
                            {MonthElems()}
                          </Picker>
                        )}
                      </Field>
                    </View>
                    <View style={[styles.birthdayElem, styles.inputContainer]}>
                      <Text style={styles.inputLabel}>Year</Text>
                      <Field name="CustomField.Card.Year">
                        {({field, form: {setFieldValue}}) => (
                          <Picker
                            selectedValue={field.value}
                            onValueChange={(itemValue) => {
                              setFieldValue(field.name, itemValue);
                            }}
                            style={styles.innerContainer}>
                            {CardYearElems()}
                          </Picker>
                        )}
                      </Field>
                    </View>
                    <View style={styles.birthdayElem}>
                      {CustomerField('CVV', 'CustomField.Card.SecurityCode')}
                    </View>
                  </View>
                </View>

                <View>
                  <Text style={styles.title}>DATE OF BIRTH</Text>
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />

                  <View style={styles.birthdayWrapper}>
                    <View style={styles.birthdayElem}>
                      <Text style={styles.inputLabel}>Month</Text>
                      <Field name="CustomField.Birth.Month">
                        {({field, form: {setFieldValue}}) => (
                          <Picker
                            selectedValue={field.value}
                            onValueChange={(itemValue) =>
                              setFieldValue(field.name, itemValue)
                            }
                            style={styles.innerContainer}>
                            {MonthElems()}
                          </Picker>
                        )}
                      </Field>
                    </View>
                    <View style={styles.birthdayElem}>
                      <Text style={styles.inputLabel}>Day</Text>
                      <Field name="CustomField.Birth.Day">
                        {({field, form: {setFieldValue}}) => (
                          <Picker
                            selectedValue={field.value}
                            onValueChange={(itemValue) => {
                              setFieldValue(field.name, itemValue);
                            }}
                            style={styles.innerContainer}>
                            {DayElems()}
                          </Picker>
                        )}
                      </Field>
                    </View>
                    <View style={styles.birthdayElem}>
                      <Text style={styles.inputLabel}>Year</Text>
                      <Field name="CustomField.Birth.Year">
                        {({field, form: {setFieldValue}}) => (
                          <Picker
                            selectedValue={field.value}
                            onValueChange={(itemValue) => {
                              setFieldValue(field.name, itemValue);
                            }}
                            style={styles.innerContainer}>
                            {YearElems()}
                          </Picker>
                        )}
                      </Field>
                    </View>
                  </View>
                </View>
                <View>
                  <Button name="Save" onButtonPress={submitForm} />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>

      {customerDetailsLoading ? <Indicator /> : null}
    </View>
  );
};

export default BarflyMembershipEnrollment;
