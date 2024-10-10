import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Icon from '../../assets/icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { updateUser } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getUserImageSrc, uploadFile } from '../../services/imageService';

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();  
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: '',
  });

  useEffect(() => {
    setUser({
      name: currentUser.name || '',
      phoneNumber: currentUser.phoneNumber || '',
      image: currentUser.image || null,
      address: currentUser.address || '',
      bio: currentUser.bio || '',
    });
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Set the image URI directly
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;
  
    // Check if all fields are filled
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert('Profile', "Please fill all the fields");
      return;
    }
  
    setLoading(true);
  
    // Check if the image is a local URI string
    if (image.startsWith('file://')) {
      console.log('Local file detected:', image);  // Debugging
  
      // Upload the file
      let imageRes = await uploadFile('profiles', image, true);
  
      // Check if upload was successful
      if (imageRes.success) {
        userData.image = imageRes.data;  // Set the image path returned from Supabase
      } else {
        userData.image = null;  // Handle failure
        Alert.alert('Image Upload', imageRes.msg || 'Failed to upload image');
      }
    }
  
    // Update the user profile with new data (including the uploaded image)
    const res = await updateUser(currentUser?.id, { name, phoneNumber, address, bio, image: userData.image });
    setLoading(false);
  
    // Handle success or failure of the update
    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();  // Navigate back on success
    } else {
      Alert.alert('Profile', res.message || "Failed to update profile.");
    }
  };

  // Use the user.image directly to render the Avatar
  let imageSource = user.image && typeof user.image == 'object' ? user.image.uri : getUserImageSrc(user.image);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />
          
          {/* Form */}
          <View style={styles.form}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image} 
                size={hp(12)} 
                rounded={theme.radius.sm} 
                style={{ borderWidth: 2 }} 
              />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={value => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={value => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={value => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value => setUser({ ...user, bio: value })}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View> 
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
});
