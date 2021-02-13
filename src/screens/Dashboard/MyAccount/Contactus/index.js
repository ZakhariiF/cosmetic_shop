import Header from 'components/Header/Header';
import Input from 'components/Input';
import {Images} from 'constant';
import React from 'react';
import {View, Image, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import rootStyle from 'rootStyle';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import DottedView from 'components/DottedView';

const Contactus = () => {
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
        <View style={rootStyle.innerContainer}>
          <Text style={styles.writeMsg}>Write us a message.</Text>

          <View style={styles.inputContainer}>
            <Input name="Name" value="Lorem Ipsum" />
            <Input name="Email" value="lipsum@gmail.com" />
            <Input name="Phone Number" placeholder="Your phone here..." />
          </View>
          <Text style={styles.yourmsg}>YOUR MESSAGE</Text>

          <TextInput
            placeholder="Your message here..."
            style={styles.input}
            multiline
          />

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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Contactus;
