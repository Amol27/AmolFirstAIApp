import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../theme';

const Card = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 16,
    ...shadows.card,
  },
});

export default Card;
