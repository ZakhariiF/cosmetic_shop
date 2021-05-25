import React from 'react';
import {
  View,
  Modal,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Formik, Field} from 'formik';
import Input from 'components/Input';
import Button from 'components/Button';
import config from 'constant/config';
import {AlertHelper} from 'utils/AlertHelper';
import * as Yup from 'yup';
import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';
import Fontisto from 'react-native-vector-icons/Fontisto';
const {height} = Dimensions.get('window');

const membershipSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short')
    .nullable()
    .required('First name Field is required'),
  lastName: Yup.string()
    .min(2, 'Too Short')
    .nullable()
    .required('Last name Field is required'),
  address1: Yup.string().nullable().required('Address1 Field is required'),
  city: Yup.string().nullable().required('City Field is required'),
  region: Yup.string().nullable().required('Region Field is required'),
  postalCode: Yup.string().nullable().required('Postal Code Field is required'),
  country: Yup.string().nullable().required('Country Field is required'),
  location: Yup.string().nullable().required('Location Field is required'),
  birthday: Yup.string().nullable().required('Birthday Field is required'),
  email: Yup.string().email().nullable().required('Email Field is required'),
  phoneNumber: Yup.string()
    .nullable()
    .required('This field is required')
    .matches(/^\(?\d{3}\)?-? *\d{3}-? *-?\d{4}$/g, 'Invalid phone number'),
});

const BarflyFormModal = ({visible, onRequestClose, membershipAction}) => {
  const onSubmit = (values, {resetForm}) => {
    let formdata = new FormData();
    formdata.append('Field1', values.firstName);
    formdata.append('Field2', values.lastName);
    formdata.append('Field3', values.email);
    formdata.append('Field4', values.address1);
    formdata.append('Field5', values.address2);
    formdata.append('Field6', values.city);
    formdata.append('Field7', values.region);
    formdata.append('Field8', values.postalCode);
    formdata.append('Field9', values.country);
    formdata.append('Field10', values.phoneNumber);
    formdata.append('Field18', values.birthday);
    formdata.append('Field12', values.location);
    formdata.append('Field20', membershipAction);
    return fetch(
      `https://${config.wufoo.subDomain}.wufoo.com/api/v3/forms/${config.wufoo.membershipSignupFormId}/entries.json`,
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
        if (res.EntryId) {
          AlertHelper.showSuccess(
            'Someone from the Drybar team will contact you shortly!',
          );
          resetForm({
            values: {},
          });
          onRequestClose();
        } else {
          AlertHelper.showError(
            'Sorry it looks like some information is not quite right.',
          );
        }
      })
      .catch((error) => console.log('Error:', error));
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <View style={{width: '20%'}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.title} numberOfLines={1}>
                Please input contact information.
              </Text>
            </View>
            <View style={{width: '20%', alignItems: 'center'}}>
              <Fontisto
                name="close-a"
                color={Colors.header_title}
                size={20}
                onPress={onRequestClose}
              />
            </View>
          </View>
          <ScrollView>
            <Formik
              initialValues={{}}
              enableReinitialize
              onSubmit={onSubmit}
              validationSchema={membershipSchema}>
              {({submitForm, isSubmitting}) => (
                <>
                  <View style={styles.inputContainer}>
                    <Field name={'firstName'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'firstName'}
                            name={'First Name'}
                            inputName={'firstName'}
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
                        <View>
                          <Input
                            id={'lastName'}
                            name={'Last Name'}
                            inputName={'lastName'}
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
                    <Field name={'address1'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'address1'}
                            name={'Address 1'}
                            inputName={'address1'}
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
                        <View>
                          <Input
                            id={'address2'}
                            name={'Address 2'}
                            inputName={'address2'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'country'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'country'}
                            name={'Country'}
                            inputName={'country'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'region'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'region'}
                            name={'State'}
                            inputName={'region'}
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
                        <View>
                          <Input
                            id={'city'}
                            name={'City'}
                            inputName={'city'}
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
                        <View>
                          <Input
                            id={'postalCode'}
                            name={'Postal Code'}
                            inputName={'postalCode'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'birthday'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'birthday'}
                            name={'Birthday'}
                            inputName={'birthday'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                    <Field name={'location'}>
                      {({field, meta, form: {setFieldValue}}) => (
                        <View>
                          <Input
                            id={'location'}
                            name={'Location'}
                            inputName={'location'}
                            onChangeText={(e) => setFieldValue(field.name, e)}
                          />
                          {!!meta.error && meta.touched && (
                            <Text style={styles.errorText}>{meta.error}</Text>
                          )}
                        </View>
                      )}
                    </Field>
                  </View>
                  <Button
                    onButtonPress={submitForm}
                    name={'Submit'}
                    disabled={isSubmitting}
                  />
                </>
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default BarflyFormModal;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    paddingBottom: 25,
    ...rootStyle.shadow,
    marginBottom: 20,
  },
  input: {
    height: 312,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.seprator,
    marginTop: 10,
    fontFamily: Fonts.AvenirNextItalic,
    paddingTop: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.modal_bg,
  },
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    height: height * 0.9,
    paddingHorizontal: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.DCondensed,
    color: Colors.header_title,
    textAlign: 'left',
  },
});
