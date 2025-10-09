import { useQuery } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFocusEffect } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import COLORS from './theme/colors'

// Words stack
import AllKanji from './screens/allKanji.screen'
import HomeScreen from './screens/home.screen'
import KanjiDetailScreen from './screens/kanjiDetails.screen'
import KanjiTemplateScreen from './screens/kanjiTemplate.screen'

// Quiz Screens
import { QuizEngine } from './screens/quizEngine.screen'
import { QuizHome } from './screens/quizHome.screen'
import LocalQuiz from './screens/quizSettings.screen'
import { SRS_Engine } from './screens/srsEngine.screen'
import { LevelDetails } from './screens/levelDetails.screen'

// signup stack
import LandingScreen from './screens/landing.screen'
import LoginScreen from './screens/logIn.screen'
import SignUpScreen from './screens/signUp.screen'

// settings screen
import SettingScreen from './screens/settings.screen'
// Similar screen
import SimilarDetailScreen from './screens/similarDetail.screen'
import SimilarScreen from './screens/similars.screen'
// TestScreen
import TestScreen from './screens/test.screen.js'
// Game Screen
import GameScreen from './screens/game.screen.js'
// Levels Screen
import LevelsScreen from './screens/levels.screen.js'
// Forgot password screen
import ForgotPasswordScreen from './screens/forgotPassword.screen.js'
// utils
import AuthContext from './contexts/authContext'

// query
import FIND_PENDING_FLASHCARDS from './queries/findPendingCards.query'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.textPrimary
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="KanjiDetail"
        component={KanjiDetailScreen}
        options={() => ({ headerTitle: ' ' })}
      />
      <Stack.Screen
        name="AllKanji"
        component={AllKanji}
        options={({ route }) => ({ headerTitle: route.params.title })}
      />
      <Stack.Screen
        name="KanjiTemplate"
        component={KanjiTemplateScreen}
        options={({ route }) => ({ headerTitle: route.params.title })}
      />
    </Stack.Navigator>
  )
}

function QuizStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.textPrimary
      }}>
      <Stack.Screen name="QuizHome" component={QuizHome} options={{ headerShown: false }} />
      <Stack.Screen name="SRSEngine" component={SRS_Engine} options={{ headerShown: false }} />
      <Stack.Screen
        name="LevelDetails"
        component={LevelDetails}
        options={({ route }) => ({ headerTitle: `Level ${route.params.level}` })}
      />
      <Stack.Screen name="LevelsHome" component={LevelsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function LocalQuizStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.textPrimary
      }}>
      <Stack.Screen
        name="LocalQuiz"
        component={LocalQuiz}
        options={() => ({ headerTitle: 'Local Quiz' })}
      />
      <Stack.Screen name="QuizEngine" component={QuizEngine} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

// function LevelStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: COLORS.surface },
//         headerBackTitleVisible: false,
//         headerTintColor: COLORS.textPrimary
//       }}>
//       <Stack.Screen name="LevelsHome" component={LevelsScreen} options={{ headerShown: false }} />
//       <Stack.Screen
//         name="LevelDetails"
//         component={LevelDetails}
//         options={({ route }) => ({ headerTitle: `Level ${route.params.level}` })}
//       />
//     </Stack.Navigator>
//   )
// }

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surfaceMuted },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.textPrimary
      }}>
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={() => ({ headerTitle: 'Sign Up' })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={() => ({ headerTitle: 'Log In' })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={() => ({ headerTitle: 'Forgot Password' })}
      />
    </Stack.Navigator>
  )
}

function SimilarStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerBackTitleVisible: false,
        headerTintColor: COLORS.textPrimary
      }}>
      <Stack.Screen
        name="SimilarList"
        component={SimilarScreen}
        options={() => ({ headerTitle: 'Similar Kanjis' })}
      />
      <Stack.Screen
        name="SimilarDetail"
        component={SimilarDetailScreen}
        options={({ route }) => ({ headerTitle: route.params.kanji })}
      />
    </Stack.Navigator>
  )
}

function TabNav() {
  // context
  const { auth } = useContext(AuthContext)

  const { data, loading, refetch } = useQuery(FIND_PENDING_FLASHCARDS, {
    variables: {
      userId: auth.userId
    }
  })

  useFocusEffect(
    useCallback(() => {
      ;(async function fetch() {
        await refetch()
      })()
    }, [])
  )

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: {
          borderTopColor: COLORS.divider,
          backgroundColor: COLORS.surface
        },
        tabBarIcon: ({ color }) => {
          let iconName
          switch (route.name) {
            case 'Words':
              iconName = 'file-tray-full'
              break
            case 'Similars':
              iconName = 'document-sharp'
              break
            case 'Talk':
              iconName = 'mic-circle'
              break
            case 'Local Quiz':
              iconName = 'archive'
              break
            case 'SRS':
              iconName = 'barbell'
              break
            case 'Settings':
              iconName = 'cog'
              break
            case 'Levels':
              iconName = 'trophy'
              break
            default:
              iconName = 'book'
          }
          // You can return any component that you like here!
          return <Icon name={iconName} type={'ionicon'} size={26} color={color} />
        }
      })}>
      <Tab.Screen name="Kanji" component={HomeStack} />
      <Tab.Screen name="Local Quiz" component={LocalQuizStack} />
      <Tab.Screen
        name="SRS"
        component={QuizStack}
        options={{
          tabBarBadge: loading ? (
            <ActivityIndicator size="small" color={COLORS.accentSuccess} />
          ) : data?.getPendingFlashCards?.length === 0 ? null : (
            data?.getPendingFlashCards?.length
          )
        }}
      />
      <Tab.Screen name="Similars" component={SimilarStack} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  )
}

export default function Navigator() {
  const [loading, setIsLoading] = useState(false)
  const [auth, setAuth] = useState({
    loggedIn: false,
    passed: false,
    username: null
  })

  const authValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth])

  const LoadingInd = () => {
    return <ActivityIndicator size="large" color={COLORS.brandPrimary} />
  }

  async function fetchUsers() {
    setIsLoading(true)
    const passed = await AsyncStorage.getItem('@passed')
    const username = await AsyncStorage.getItem('@username')
    const userId = await AsyncStorage.getItem('@userId')
    const token = await AsyncStorage.getItem('@token')
    const avatar = await AsyncStorage.getItem('@avatar')
    const verified = await AsyncStorage.getItem('@verified')
    const email = await AsyncStorage.getItem('@email')
    const password = await AsyncStorage.getItem('@password')

    userInfo = {
      passed,
      username,
      userId,
      token,
      avatar,
      verified,
      email,
      password,
      loggedIn: Boolean(token && userId)
    }

    setAuth(userInfo)
    setIsLoading(false)
    return userInfo
  }

  useEffect(() => {
    ;(async function fetchData() {
      await fetchUsers()
    })()
  }, [])

  return (
    <AuthContext.Provider value={authValue}>
      {loading ? <LoadingInd /> : auth.loggedIn ? <TabNav /> : <AuthStack />}
    </AuthContext.Provider>
  )
}
