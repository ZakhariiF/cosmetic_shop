import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {ScrollView, View, Text, TextInput} from 'react-native';

import Header from 'components/Header/Header';
import Button from 'components/Button';

import Indicator from 'components/Indicator';
import {getCustomerDetails} from '../thunks';
import usStates from 'constant/usStates';
import cardTypes from 'constant/cardType';

import rootStyle from 'rootStyle';
import styles from './styles';
import NativePicker from 'components/NativePicker';
import CheckBox from 'components/Checkbox';

const CustomerSchema = Yup.object()
  .shape({
    FirstName: Yup.string()
      .min(2, 'Error: first name is Too Short!')
      .max(50, 'Error: first name is Too Long')
      .required('Error: first name is required'),
    LastName: Yup.string()
      .min(2, 'Error: last name is Too Short!')
      .max(50, 'Error: last name is Too Long!')
      .required('Error: last name is required'),
    Address: Yup.object().shape({
      Street1: Yup.string().nullable().required('Error: home address1 is required'),
      City: Yup.string().nullable().required('Error: city is required'),
      Zip: Yup.string().nullable().required('Error: zip is required'),
      State: Yup.string().nullable().required('Error: state is required'),
    }),
    Email: Yup.string().email().required('Error: email is required'),
    CellPhone: Yup.string()
      .nullable()
      .required('Error: phone number is required')
      .matches(
        /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g,
        'Error: phone number is invalid',
      ),
    CustomField: Yup.object().shape({
      Card: Yup.object().shape({
        NameOnCard: Yup.string()
          .nullable()
          .required('Error: card name is required'),
        Number: Yup.string()
          .nullable()
          .required('Error: card number is required'),
        Type: Yup.string().nullable().required('Error: card type is required'),
        SecurityCode: Yup.string()
          .nullable()
          .required('Error: card security code is required'),
        Address: Yup.object().shape({
          Street1: Yup.string()
            .nullable()
            .required('Error: address1 is required'),
          City: Yup.string().nullable().required('Error: city is required'),
          State: Yup.string().nullable().required('Error: state is required'),
        }),
        Year: Yup.number().required('Error: exp year is required'),
        Month: Yup.number().required('Error: exp month is required'),
      }),
      Birth: Yup.object().shape({
        Year: Yup.number().required('Error: year is required'),
        Month: Yup.number().required('Error: month is required'),
        Day: Yup.number().required('Error: day is required'),
      }),
    }),
  })
  .required();

const BarflyMembershipEnrollment = ({navigation, route}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const customerDetails = useSelector((state) => state.account.details);
  const customerDetailsLoading = useSelector(
    (state) => state.account.accountLoading,
  );
  const dispatch = useDispatch();

  const [sameAddress, setSameAddress] = useState(false);

  useEffect(() => {
    if (!route.params.membership) {
      navigation.navigate('BarflyMembership');
    }
  }, [route]);

  useEffect(() => {
    const customerId = get(userInfo, 'bookerID');
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
            style={[
              styles.inputContainer,
              {marginTop: 20},
              meta.error ? {marginBottom: 10} : {},
            ]}
          />
          {!!meta.error && <Text style={styles.errorText}>{meta.error}</Text>}
        </View>
      )}
    </Field>
  );

  const months = () => {
    const monthOptions = [];

    for (let i = 0; i < 12; i++) {
      monthOptions.push({
        label: `${i + 1}`,
        value: i,
      });
    }
    return monthOptions;
  };

  const days = () => {
    const dayOptions = [];

    for (let i = 0; i < 31; i++) {
      dayOptions.push({
        value: i,
        label: `${i + 1}`,
      });
    }
    return dayOptions;
  };

  const years = () => {
    const yearOptions = [];

    const currentYear = new Date().getFullYear();
    const firstYear = currentYear - 100;

    for (let i = 0; i < 100; i++) {
      yearOptions.push({
        value: firstYear + i,
        label: `${firstYear + i + 1}`,
      });
    }
    return yearOptions;
  };

  const cardYears = () => {
    const firstYear = new Date().getFullYear();
    const yearOptions = [];

    for (let i = 0; i < 10; i++) {
      yearOptions.push({
        value: firstYear + i,
        label: `${firstYear + i}`,
      });
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
            {({submitForm, errors, values, setFieldValue}) => (
              <View>
                <View>
                  <Text style={styles.title}>Home Information</Text>
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />

                  {CustomerField('First Name', 'FirstName')}
                  {CustomerField('Last Name', 'LastName')}
                  {CustomerField('Email', 'Email')}

                  {CustomerField('Home Address 1', 'Address.Street1')}
                  {CustomerField('Home Address 2', 'Address.Street2')}
                  {CustomerField('City', 'Address.City')}
                  <Field name="Address.State">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>State</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(val) =>
                            setFieldValue(field.name, val)
                          }
                          items={usStates.map((s) => ({
                            label: s.name,
                            value: s.name,
                          }))}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a state',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>
                  {CustomerField('Postal Code', 'Address.Zip')}
                  {CustomerField('Phone Number', 'CellPhone')}
                </View>

                <View>
                  <Text style={styles.title}>BILLING INFORMATION</Text>
                  <CheckBox
                    title={'Billing address same as Home address'}
                    isChecked={sameAddress}
                    onPressed={() => {
                      if (!sameAddress) {
                        setFieldValue(
                          'CustomField.Card.Address',
                          values.Address,
                        );
                      } else {
                        setFieldValue('CustomField.Card.Address', {});
                      }
                      setSameAddress(!sameAddress);
                    }}
                  />
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />

                  {CustomerField(
                    'Address 1',
                    'CustomField.Card.Address.Street1',
                  )}
                  {CustomerField(
                    'Address 2',
                    'CustomField.Card.Address.Street2',
                  )}
                  {CustomerField('City', 'CustomField.Card.Address.City')}

                  <Field name="CustomField.Card.Address.State">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>State</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(val) =>
                            setFieldValue(field.name, val)
                          }
                          items={usStates.map((s) => ({
                            label: s.name,
                            value: s.name,
                          }))}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a state',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>
                  {CustomerField('Postal Code', 'Address.Zip')}
                </View>

                <View>
                  <Text style={styles.title}>PAYMENT INFORMATION</Text>
                  {CustomerField('Name on Card', 'CustomField.Card.NameOnCard')}
                  {CustomerField(
                    'Credit Card Number',
                    'CustomField.Card.Number',
                  )}
                  <Field name="CustomField.Card.Type">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Type</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue(field.name, itemValue)
                          }
                          items={cardTypes.map((s) => ({
                            value: s.id,
                            label: s.label,
                          }))}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a card type',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>

                  <Field name="CustomField.Card.Month">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Exp Month</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue(field.name, itemValue)
                          }
                          items={months()}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a month',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>


                  <Field name="CustomField.Card.Year">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Exp Year</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) => {
                            setFieldValue(field.name, itemValue);
                          }}
                          style={styles.innerContainer}
                          items={cardYears()}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a year',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>
                  {CustomerField('CVV', 'CustomField.Card.SecurityCode')}

                </View>

                <View>
                  <Text style={styles.title}>DATE OF BIRTH</Text>
                  <Text style={styles.subtitle}>For your free blowout!</Text>
                  <View style={[rootStyle.seprator, {marginBottom: 10}]} />
                  <Field name="CustomField.Birth.Month">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Month</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) =>
                            setFieldValue(field.name, itemValue)
                          }
                          items={months()}
                          placeholder={{
                            label: 'Select a month',
                            value: undefined,
                          }}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                        />
                        {!!meta.error && meta && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>

                  <Field name="CustomField.Birth.Day">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Day</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) => {
                            setFieldValue(field.name, itemValue);
                          }}
                          style={styles.innerContainer}
                          items={days()}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a day',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && meta && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>

                  <Field name="CustomField.Birth.Year">
                    {({field, meta, form: {setFieldValue}}) => (
                      <View>
                        <Text style={styles.inputLabel}>Year</Text>
                        <NativePicker
                          selectedValue={field.value}
                          onValueChange={(itemValue) => {
                            setFieldValue(field.name, itemValue);
                          }}
                          items={years()}
                          pickerContainer={{
                            ...styles.inputContainer,
                            marginBottom: meta.error ? 0 : 10,
                          }}
                          placeholder={{
                            label: 'Select a year',
                            value: undefined,
                          }}
                        />
                        {!!meta.error && (
                          <Text style={[styles.errorText, {marginTop: 10}]}>
                            {meta.error}
                          </Text>
                        )}
                      </View>
                    )}
                  </Field>
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
