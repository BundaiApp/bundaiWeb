import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen'
import { FONTS } from '../components/fonts'
import COLORS from '../theme/colors'
import FORGET_PASSWORD from '../mutations/forgetPassword.mutation'

export default function ForgotPasswordScreen({ navigation: { goBack } }) {
  const [email, setEmail] = useState('')
  const [requestReset, { loading }] = useMutation(FORGET_PASSWORD)

  const handleReset = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      Alert.alert('Reset Password', 'Please enter the email associated with your account.')
      return
    }

    try {
      const { data } = await requestReset({
        variables: { email: trimmedEmail }
      })

      const response = data?.forgetPassword

      if (response?.errorMessage) {
        Alert.alert('Reset Failed', response.errorMessage)
        return
      }

      Alert.alert(
        'Reset Link Sent',
        'Check your inbox for instructions on how to reset your password.',
        [{ text: 'OK', onPress: () => goBack() }]
      )
    } catch (error) {
      Alert.alert('Reset Failed', 'Something went wrong. Please try again later.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter the email you used to sign up and we will send you reset instructions.
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder={'you@example.com'}
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          onChangeText={setEmail}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.surface} />
          ) : (
            <Text style={styles.buttonText}>Send reset link</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={() => goBack()}>
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('10%'),
    paddingTop: hp('2%'),
    justifyContent: 'flex-start'
  },
  heading: {
    ...FONTS.bold24,
    color: COLORS.textPrimary,
    marginBottom: hp('2%')
  },
  subtitle: {
    ...FONTS.regular16,
    color: COLORS.textSecondary,
    marginBottom: hp('4%')
  },
  input: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.outline,
    color: COLORS.textPrimary,
    ...FONTS.regular16,
    paddingBottom: hp('1%'),
    height: hp('7%'),
    marginBottom: hp('4%')
  },
  button: {
    height: hp('7%'),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brandPrimary,
    borderRadius: wp('8%')
  },
  disabledButton: {
    opacity: 0.6
  },
  buttonText: {
    ...FONTS.bold18,
    color: COLORS.surface
  },
  backLink: {
    marginTop: hp('3%'),
    alignItems: 'center'
  },
  backText: {
    ...FONTS.medium16,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline'
  }
})
