import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JourneyDecorations = ({ type, style }) => {
  const getDecoration = () => {
    switch (type) {
      case 'mountain':
        return (
          <View style={[styles.mountain, style]}>
            <Text style={styles.mountainText}>🗻</Text>
          </View>
        );
      case 'temple':
        return (
          <View style={[styles.temple, style]}>
            <Text style={styles.templeText}>⛩️</Text>
          </View>
        );
      case 'cherry':
        return (
          <View style={[styles.cherry, style]}>
            <Text style={styles.cherryText}>🌸</Text>
          </View>
        );
      case 'lantern':
        return (
          <View style={[styles.lantern, style]}>
            <Text style={styles.lanternText}>🏮</Text>
          </View>
        );
      case 'bridge':
        return (
          <View style={[styles.bridge, style]}>
            <Text style={styles.bridgeText}>🌉</Text>
          </View>
        );
      case 'wave':
        return (
          <View style={[styles.wave, style]}>
            <Text style={styles.waveText}>🌊</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return getDecoration();
};

const styles = StyleSheet.create({
  mountain: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mountainText: {
    fontSize: 24,
  },
  temple: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  templeText: {
    fontSize: 20,
  },
  cherry: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cherryText: {
    fontSize: 16,
  },
  lantern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lanternText: {
    fontSize: 18,
  },
  bridge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgeText: {
    fontSize: 22,
  },
  wave: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveText: {
    fontSize: 20,
  },
});

export default JourneyDecorations; 