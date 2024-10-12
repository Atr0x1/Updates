import { StyleSheet } from 'react-native';
import React from 'react';
import { hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { Image } from 'expo-image'; // Assuming you're using expo-image for optimized rendering
import { getUserImageSrc } from '../services/imageService';

const Avatar = ({
    uri,
    size = hp(4.5),
    rounded = theme.radius.md,
    style = {}
}) => {
  const imageSource = uri && uri.startsWith('file://') ? { uri } : getUserImageSrc(uri);

  return (
    <Image
      source={imageSource}
      transition={100}
      style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
