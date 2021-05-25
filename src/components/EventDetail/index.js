import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import {Formik, Field} from 'formik';

import * as Yup from 'yup';

import {get} from 'lodash';
import Input from 'components/Input';
import HTMLView from 'react-native-htmlview';

import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';

import {AlertHelper} from 'utils/AlertHelper';

import Button from 'components/Button';

import {documentToHtmlString} from '@contentful/rich-text-html-renderer';
import NativePicker from 'components/NativePicker';
import config from 'constant/config';

const WufooSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Error: first name is Too Short!')
    .max(50, 'Error: first name is Too Long!')
    .required('Error: first name is required'),
  lastName: Yup.string()
    .min(2, 'Error: last name is Too Short!')
    .max(50, 'Error: last name is Too Long!')
    .required('Error: last name is required'),
  email: Yup.string().email().required('Error: email is required'),
  address1: Yup.string().nullable().required('Error: address1 is required'),
  city: Yup.string().required('Error: city is required'),
  state: Yup.string().required('Error: state is required'),
  postalCode: Yup.string().required('Error: postal code is required'),
  preferredShop: Yup.string().required('Error: preferred shop is required'),
  preferredStartTime: Yup.string().required(
    'Error: preferred start time is required',
  ),
  occasion: Yup.string().required('Error: occasion is required'),
  partySize: Yup.string().required('Error: party size is required'),
  phoneNumber: Yup.string()
    .nullable()
    .required('Error: phone number is required')
    .matches(
      /^\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g,
      'Error: phone number is invalid',
    ),
});

const EventDetail = ({
  preferredShopChoices,
  // preferredDateChoices,
  preferredStartTimeChoices,
  partySizeChoices,
  occasions,
  title,
  description,
  dividerIcon,
  action,
  setHeight,
}) => {
  const onSubmit = (values, {resetForm}) => {
    console.log('Values:', values);

    let formdata = new FormData();
    formdata.append('Field1', values.firstName);
    formdata.append('Field2', values.lastName);
    formdata.append('Field3', values.email);
    formdata.append('Field10', values.phoneNumber);
    formdata.append('Field4', values.address1);
    formdata.append('Field5', values.address2);
    formdata.append('Field6', values.city);
    formdata.append('Field7', values.states);
    formdata.append('Field8', values.postalCode);
    formdata.append('Field12', values.preferredShop);
    formdata.append('Field15', values.preferredStartTime);
    formdata.append('Field17', values.partySize);
    formdata.append('Field19', values.notes);
    formdata.append('Field25', values.occasion);
    formdata.append('Field21', (title || '').toUpperCase());

    return fetch(
      `https://${config.wufoo.subDomain}.wufoo.com/api/v3/forms/${config.wufoo.genericPartyFormId}/entries.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(config.wufoo.apiKey + ':password')}`,
        },
        body: formdata,
        redirect: 'follow',
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res.Success) {
          AlertHelper.showSuccess(
            'Someone from the Drybar team will contact you shortly!',
          );
          resetForm({
            values: {
              preferredShop: '',
              occasion: '',
              preferredStartTime: '',
              partySize: '',
            },
          });
        } else {
          AlertHelper.showError(
            'Sorry it looks like some information is not quite right.',
          );
        }
      })
      .catch((error) => console.log('Error:', error));
  };

  return (
    <View
      style={styles.container}
      onLayout={({nativeEvent}) => {
        setHeight(nativeEvent.layout.height);
      }}>
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <View style={styles.dashedLine} />
        <Image source={dividerIcon} />
        <View style={styles.dashedLine} />
      </View>
      <Text style={styles.detailHeaderText}>{(title || '').toUpperCase()}</Text>
      <View style={styles.detailDescWrapper}>
        {description && (
          <HTMLView
            value={documentToHtmlString(get(description, 'json'))}
            stylesheet={DescriptionStyle}
          />
        )}
      </View>
      <View style={styles.formWrapper}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            address1: '',
            city: '',
            state: '',
            postalCode: '',
            preferredShop: '',
            preferredStartTime: '',
            occasion: '',
            partySize: '',
            phoneNumber: '',
          }}
          onSubmit={onSubmit}
          validationSchema={WufooSchema}>
          {({submitForm, isSubmitting, errors}) => (
            <>
              <Field name={'firstName'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'First Name'}
                      inputName={'firstName'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'lastName'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Last Name'}
                      inputName={'lastName'}
                      value={field.value}
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
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Email'}
                      inputName={'email'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'address1'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Address 1'}
                      inputName={'address1'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'address2'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Address 2'}
                      inputName={'address2'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'city'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'City'}
                      inputName={'city'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'state'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'State'}
                      inputName={'state'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>
              <Field name={'postalCode'}>
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Postal Code'}
                      inputName={'postalCode'}
                      value={field.value}
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
                  <View style={styles.inputContainer}>
                    <Input
                      name={'Phone Number'}
                      inputName={'phoneNumber'}
                      value={field.value}
                      onChangeText={(e) => setFieldValue(field.name, e)}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>

              <Field name="preferredShop">
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>Preferred Shop</Text>
                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('preferredShop', itemValue)
                      }
                      items={preferredShopChoices}
                      placeholder={{
                        label: 'Select Preferred Shop',
                        value: '',
                      }}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>

              <Field name="preferredStartTime">
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>Preferred Start Time</Text>

                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('preferredStartTime', itemValue)
                      }
                      items={preferredStartTimeChoices}
                      placeholder={{
                        label: 'Select Preferred Start Time',
                        value: '',
                      }}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>

              <Field name="partySize">
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>Party Size</Text>
                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('partySize', itemValue)
                      }
                      items={partySizeChoices}
                      placeholder={{
                        label: 'Select Part Size',
                        value: '',
                      }}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>

              <Field name="occasion">
                {({field, meta, form: {setFieldValue}}) => (
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputLabel}>Occasion</Text>
                    <NativePicker
                      selectedValue={field.value}
                      items={occasions}
                      onValueChange={(itemValue) =>
                        setFieldValue('occasion', itemValue)
                      }
                      placeholder={{
                        label: 'Select Occasion',
                        value: '',
                      }}
                    />
                    {!!meta.error && meta.touched && (
                      <Text style={styles.errorText}>{meta.error}</Text>
                    )}
                  </View>
                )}
              </Field>

              <View style={styles.inputContainer}>
                <Field name={'notes'}>
                  {({field, meta, form: {setFieldValue}}) => (
                    <View style={styles.inputContainer}>
                      <Input
                        name={'Notes'}
                        inputName={'notes'}
                        value={field.value}
                        onChangeText={(e) => setFieldValue(field.name, e)}
                        multiline={true}
                      />
                      {!!meta.error && meta.touched && (
                        <Text style={styles.errorText}>{meta.error}</Text>
                      )}
                    </View>
                  )}
                </Field>
              </View>
              <View style={styles.inputContainer}>
                <Button onButtonPress={submitForm} name={'Submit'} />
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {},
  detailHeaderText: {
    fontSize: 31,
    lineHeight: 51,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: Fonts.DCondensed,
  },
  detailDescWrapper: {
    padding: 15,
    backgroundColor: Colors.white,
    marginBottom: 15,
  },
  formWrapper: {
    padding: 15,
    backgroundColor: Colors.white,
  },
  dashedLine: {
    height: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderColor: Colors.dashed,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  inputLabel: {
    fontSize: 15,
    color: Colors.light_gray,
    marginTop: 25,
    fontFamily: Fonts.AvenirNextRegular,
  },
  errorText: {
    color: Colors.error,
    fontSize: 15,
    marginTop: 10,
  },
});

const DescriptionStyle = StyleSheet.create({
  p: {
    fontSize: 15,
    lineHeight: 30,
    color: Colors.input_text,
    fontFamily: Fonts.AvenirNextRegular,
  },
});
