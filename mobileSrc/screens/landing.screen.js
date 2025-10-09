import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// utils
import { FONTS } from '../components/fonts'
import COLORS from '../theme/colors'

export default function Landing({ navigation: { navigate } }) {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heroText}>文台</Text>
        <Text style={styles.heroText}>Bundai</Text>
        <Text style={styles.subtitleText}>Learn Japanese Using Anime</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigate('Login')}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.spacerH} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: '20%'
  },
  topContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    flex: 0.8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    height: '10%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
    backgroundColor: COLORS.brandPrimary,
    borderRadius: 10,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  buttonText: {
    ...FONTS.bold21,
    color: COLORS.surface
  },
  heroText: {
    ...FONTS.bold46,
    marginBottom: '2%',
    color: COLORS.brandPrimary
  },
  subtitleText: {
    ...FONTS.regular16,
    textAlign: 'center',
    paddingHorizontal: '5%',
    marginBottom: '2%',
    color: COLORS.textSecondary
  },
  spacerH: {
    height: '2%'
  }
})
