import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Icon } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'
import AuthContext from '../contexts/authContext'
import COLORS from '../theme/colors'

export default function SettingScreen() {
  const { auth, setAuth } = useContext(AuthContext)
  const [studyReminders, setStudyReminders] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const displayName = auth?.username ?? 'Guest'
  const email = auth?.email ?? 'Add your email to stay in the loop'
  const avatarInitial = displayName.charAt(0).toUpperCase() || '?'

  const showToast = (message) => {
    showMessage({ message, type: 'info' })
  }

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: logout
      }
    ])
  }

  async function logout() {
    await setAuth({
      userId: null,
      token: null,
      username: null,
      passed: false,
      verified: false,
      email: null
    })

    await AsyncStorage.multiRemove([
      '@userId',
      '@token',
      '@username',
      '@verified',
      '@passed',
      '@email',
      '@password'
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.primaryChip}
              onPress={() => showToast('Profile editing is coming soon')}
              activeOpacity={0.8}
            >
              <Icon name='create-outline' type='ionicon' color={COLORS.brandPrimary} size={18} />
              <Text style={styles.primaryChipText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryChip, styles.secondaryChip]}
              onPress={() => showToast('Achievements are coming soon')}
              activeOpacity={0.8}
            >
              <Icon name='ribbon-outline' type='ionicon' color={COLORS.brandPrimary} size={18} />
              <Text style={styles.primaryChipText}>Achievements</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <ToggleRow
            label='Study reminders'
            subtitle='Daily push to keep you practicing'
            value={studyReminders}
            onValueChange={setStudyReminders}
          />
          <ToggleRow
            label='Email updates'
            subtitle='Monthly round-up of new kanji content'
            value={emailUpdates}
            onValueChange={setEmailUpdates}
          />
          <ToggleRow
            label='Dark mode'
            subtitle='Match bun.dai to the night shift'
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsRow
            icon='person-circle-outline'
            label='Account details'
            subtitle='Update your name and learning goal'
            onPress={() => showToast('Account settings are coming soon')}
          />
          <SettingsRow
            icon='shield-checkmark-outline'
            label='Privacy & security'
            subtitle='Manage passwords and sign-in options'
            onPress={() => showToast('Security settings are coming soon')}
          />
          <SettingsRow
            icon='cloud-download-outline'
            label='Backup & restore'
            subtitle='Export your progress safely'
            onPress={() => showToast('Backup tools are coming soon')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsRow
            icon='help-buoy-outline'
            label='Help center'
            subtitle='Guides and FAQs for getting started'
            onPress={() => showToast('Opening help center soon')}
          />
          <SettingsRow
            icon='chatbubble-ellipses-outline'
            label='Contact support'
            subtitle='We usually reply within one day'
            onPress={() => showToast('Support chat is coming soon')}
          />
          <SettingsRow
            icon='star-outline'
            label='Rate bundai'
            subtitle='Tell us what you think of the journey so far'
            onPress={() => showToast('Ratings are coming soon')}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout} activeOpacity={0.85}>
          <Icon name='log-out-outline' type='ionicon' color={COLORS.surface} size={20} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const SettingsRow = ({ icon, label, subtitle, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
    <View style={styles.rowIconWrapper}>
      <Icon name={icon} type='ionicon' color={COLORS.brandPrimary} size={22} />
    </View>
    <View style={styles.rowTextContainer}>
      <Text style={styles.rowLabel}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Icon name='chevron-forward' type='ionicon' color={COLORS.textMuted} size={18} />
  </TouchableOpacity>
)

const ToggleRow = ({ label, subtitle, value, onValueChange }) => (
  <View style={styles.toggleRow}>
    <View style={styles.rowTextContainer}>
      <Text style={styles.rowLabel}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor={value ? COLORS.brandPrimary : COLORS.surface}
      trackColor={{ false: COLORS.divider, true: COLORS.brandSecondary }}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    padding: 20
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brandSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.brandPrimary
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.textSecondary
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'center'
  },
  primaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    marginHorizontal: 6
  },
  secondaryChip: {
    backgroundColor: COLORS.surfaceElevated
  },
  primaryChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.brandPrimary,
    fontWeight: '600'
  },
  section: {
    marginBottom: 28
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  rowIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  rowTextContainer: {
    flex: 1
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  rowSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.textSecondary
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  logoutButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentDanger,
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: COLORS.accentDanger,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface
  }
})
