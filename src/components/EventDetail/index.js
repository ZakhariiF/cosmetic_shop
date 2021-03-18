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
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  email: Yup.string().email().required('This field is required'),
  address1: Yup.string().nullable().required('This field is required'),
  city: Yup.string().required('This field is required'),
  state: Yup.string().required('This field is required'),
  postalCode: Yup.string().required('This field is required'),
  preferredShop: Yup.string().required('This field is required'),
  preferredStartTime: Yup.string().required('This field is required'),
  occasion: Yup.string().required('This field is required'),
  partySize: Yup.string().required('This field is required'),
  phoneNumber: Yup.string()
    .nullable()
    .required('This field is required')
    .matches(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g, 'Invalid phone number'),
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
          initialValues={{}}
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
              <View style={[styles.inputContainer]}>
                <Text style={styles.inputLabel}>Preferred Shop</Text>
                <Field name="preferredShop">
                  {({field, form: {setFieldValue}}) => (
                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('preferredShop', itemValue)
                      }
                      items={preferredShopChoices}
                    />
                  )}
                </Field>
              </View>

              <View style={[styles.inputContainer]}>
                <Text style={styles.inputLabel}>Preferred Start Time</Text>
                <Field name="preferredStartTime">
                  {({field, form: {setFieldValue}}) => (
                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('preferredStartTime', itemValue)
                      }
                      items={preferredStartTimeChoices}
                    />
                  )}
                </Field>
              </View>
              <View style={[styles.inputContainer]}>
                <Text style={styles.inputLabel}>Party Size</Text>
                <Field name="partySize">
                  {({field, form: {setFieldValue}}) => (
                    <NativePicker
                      selectedValue={field.value}
                      onValueChange={(itemValue) =>
                        setFieldValue('partySize', itemValue)
                      }
                      items={partySizeChoices}
                    />
                  )}
                </Field>
              </View>
              <View style={[styles.inputContainer]}>
                <Text style={styles.inputLabel}>Occasion</Text>
                <Field name="occasion">
                  {({field, form: {setFieldValue}}) => (
                    <NativePicker
                      selectedValue={field.value}
                      items={occasions}
                      onValueChange={(itemValue) =>
                        setFieldValue('occasion', itemValue)
                      }
                    />
                  )}
                </Field>
              </View>
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
});

const DescriptionStyle = StyleSheet.create({
  p: {
    fontSize: 15,
    lineHeight: 30,
    color: Colors.input_text,
    fontFamily: Fonts.AvenirNextRegular,
  },
});
