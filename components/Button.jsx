// Button.jsx

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

const Button = ({ title, loading, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading} // Disable the button when loading
      style={[styles.button, loading && styles.loadingButton, style]} // Change style based on loading state
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.white} /> // Show loading indicator
      ) : (
        <Text style={styles.buttonText}>{title}</Text> // Show button text
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary, // Normal button background
    padding: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  loadingButton: {
    backgroundColor: theme.colors.grey, // Background when loading
  },
  buttonText: {
    color: theme.colors.white, // Button text color 
    fontSize: 16,
  },
});

export default Button;
