import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

// components
import { FONTS } from '../components/fonts'
import { VerticalSpacer } from '../components/spacers'

// utils
import AuthContext from '../contexts/authContext.js'
import { kana, topics, words } from '../util/constants'

// data
import Hiragana from '../util/hiragana.json'
import { provideData, provideTopWordsData } from '../util/jlptArray'
import Katakana from '../util/katakana.json'

// graphQL
import ADD_BULK_FLASHCARD from '../mutations/addBulkFlashCard.mutation.js'
import COLORS from '../theme/colors'

//const QUIZ_PRIMARY = '#2F8FC9'
// const QUIZ_PRIMARY = '#58AAD6'
// const QUIZ_PRIMARY_DARK = '#2677AD'
// const QUIZ_PRIMARY_LIGHT = '#D8EEF9'

const QUIZ_PRIMARY = COLORS.interactivePrimary
const QUIZ_PRIMARY_DARK = COLORS.interactivePrimaryPressed

const ACTIVE_PILL_COLOR = COLORS.interactivePrimary
const INACTIVE_PILL_COLOR = COLORS.interactiveSurface
const INACTIVE_TEXT_COLOR = COLORS.interactiveTextInactive
const INACTIVE_BORDER_COLOR = COLORS.interactiveBorder

export default function LocalQuiz({ navigation: { navigate } }) {
  const [type, setType] = useState('jlpt')
  const [level, setLevel] = useState(5)
  const [selected, setSelected] = useState([])
  const [quizType, setQuizType] = useState('meaning')
  const [isWritten, setIsWritten] = useState(false)
  const [itemCount, setItemCount] = useState(10)

  // context
  const { auth } = useContext(AuthContext)

  // mutation
  const [addBulk, { loading }] = useMutation(ADD_BULK_FLASHCARD)

  async function addCardsInBulk() {
    const modifiedSelected = selected.map((item) => ({
      kanjiName: item.kanjiName,
      meanings: item.meanings,
      quizAnswers: item.quizAnswers
    }))
    await addBulk({
      variables: {
        userId: auth.userId,
        kanjis: modifiedSelected
      }
    })
  }

  const checkIfSelected = (item) => {
    return selected.includes(item)
      ? setSelected(selected.filter((i) => i !== item))
      : setSelected([...selected, item])
  }

  const selectAll = () => {
    return type === 'jlpt' || type === 'strokes' || type === 'grades'
      ? setSelected([...selected, ...dataTypes[type][level]])
      : setSelected([...selected, ...dataTypes[type]])
  }

  const checkThenNavigate = () => {
    return selected.length === 0
      ? alert('please select some kanji')
      : navigate('QuizEngine', { questionsArray: selected, quizType, isWritten })
  }

  const dataTypes = {
    jlpt: provideData('jlpt', level, true),
    strokes: provideData('strokes', level, true),
    grades: provideData('grade', level, true),
    verbs: provideTopWordsData('verbs', `n${level}`, itemCount),
    adjectives: provideTopWordsData('adjectives', `n${level}`, itemCount),
    adverbs: provideTopWordsData('adverbs', `n${level}`, itemCount),
    nouns: provideTopWordsData('nouns', `n${level}`, itemCount),
    hiragana: Hiragana,
    katakana: Katakana
  }

  const ITEM_COUNTS = [10, 20, 50, 100, 'All']

  const RenderItemCountFilter = () => (
    <View style={styles.filterContainer}>
      {ITEM_COUNTS.map((count) => (
        <TouchableOpacity
          key={count}
          style={[styles.filterButton, itemCount === count && styles.selectedFilterButton]}
          onPress={() => setItemCount(count)}>
          <Text
            style={[
              styles.filterButtonText,
              itemCount === count && styles.selectedFilterButtonText
            ]}>
            {count}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* #################  first container ################## */}
      <View style={styles.firstContainer}>
        {[...topics, ...words, ...kana].map((item) => {
          const isActive = type === item.topicName
          return (
            <TouchableOpacity
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                  borderColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
                }
              ]}
              key={item.header}
              onPress={() => setType(item.topicName)}>
              <Text
                style={[
                  styles.pillText,
                  isActive ? styles.onPrimaryText : styles.pillTextInactive
                ]}>
                {item.header}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* #################  second container ################## */}
      <View style={styles.secondContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {type === 'jlpt' ||
          type === 'verbs' ||
          type === 'adjectives' ||
          type === 'adverbs' ||
          type === 'nouns'
            ? new Array(5).fill(1).map((_, index) => {
                const value = 5 - index
                const isActive = value === level
                return (
                  <TouchableOpacity
                    key={`jlpt${value}`}
                    style={[
                      styles.pillForSecondRow,
                      {
                        backgroundColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                        borderColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
                      }
                    ]}
                    onPress={() => setLevel(value)}>
                    <Text
                      style={[
                        styles.buttonTextSmall,
                        isActive ? styles.buttonTextOnPrimary : styles.buttonTextInactive
                      ]}>
                      {'N'}
                      {value}
                    </Text>
                  </TouchableOpacity>
                )
              })
            : null}
          {type === 'grades'
            ? new Array(9).fill(1).map((_, index) => {
                const value = index + 1
                const isActive = value === level
                return (
                  <TouchableOpacity
                    key={`grades${value}`}
                    style={[
                      styles.pillForSecondRow,
                      {
                        backgroundColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                        borderColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
                      }
                    ]}
                    onPress={() => setLevel(value)}>
                    <Text
                      style={[
                        styles.buttonTextSmall,
                        isActive ? styles.buttonTextOnPrimary : styles.buttonTextInactive
                      ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                )
              })
            : null}
          {type === 'strokes'
            ? new Array(24).fill(1).map((_, index) => {
                const value = index + 1
                const isActive = value === level
                return (
                  <TouchableOpacity
                    key={`stroke${value}`}
                    style={[
                      styles.pillForSecondRow,
                      {
                        backgroundColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                        borderColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
                      }
                    ]}
                    onPress={() => setLevel(value)}>
                    <Text
                      style={[
                        styles.buttonTextSmall,
                        isActive ? styles.buttonTextOnPrimary : styles.buttonTextInactive
                      ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                )
              })
            : null}
        </ScrollView>
      </View>

      {/* #################  count container ################## */}
      {type === 'verbs' || type === 'adjectives' || type === 'adverbs' || type === 'nouns' ? (
        <RenderItemCountFilter />
      ) : null}

      {/* #################  third container ################## */}
      <View style={styles.flatlist}>
        <FlatList
          data={
            type === 'jlpt' || type === 'strokes' || type === 'grades'
              ? dataTypes[type][level]
              : dataTypes[type]
          }
          renderItem={({ item }) => {
            const isActive = selected.includes(item)
            return (
              <TouchableOpacity
                style={[
                  styles.block,
                  {
                    backgroundColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                    borderColor: isActive ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
                  },
                  { width: type === 'jlpt' || type === 'strokes' || type === 'grades' ? 50 : 100 }
                ]}
                onPress={() => checkIfSelected(item)}>
                <Text style={[styles.kanjiText, isActive ? styles.buttonTextOnPrimary : null]}>
                  {type === 'jlpt' ||
                  type === 'strokes' ||
                  type === 'grades' ||
                  type === 'hiragana' ||
                  type === 'katakana'
                    ? item.kanjiName
                    : item.kanji}
                </Text>
              </TouchableOpacity>
            )
          }}
          numColumns={Platform.OS !== 'ios' && Platform.OS !== 'android' ? 7 : 3}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <VerticalSpacer height={Platform.OS !== 'ios' && Platform.OS !== 'android' ? 2 : 10} />

      {/* #################  fourth container ################## */}
      <View style={styles.selectionRow}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.selectButtonTopRow} onPress={selectAll}>
            <Text style={styles.buttonTextTopRow}>select all</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectButtonTopRow} onPress={() => setSelected([])}>
            <Text style={styles.buttonTextTopRow}>unselect</Text>
          </TouchableOpacity>
          {loading ? (
            <View style={styles.selectButtonTopRow}>
              <Text style={styles.buttonTextTopRow}>loading...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectButtonTopRow} onPress={() => addCardsInBulk()}>
              <Text style={styles.buttonTextTopRow}>save all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isWritten ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                borderColor: isWritten ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
              }
            ]}
            onPress={() => setIsWritten(!isWritten)}>
            <Text
              style={[
                styles.buttonText,
                isWritten ? styles.buttonTextOnPrimary : styles.buttonTextInactive
              ]}>
              Written
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: isWritten ? INACTIVE_PILL_COLOR : ACTIVE_PILL_COLOR,
                borderColor: isWritten ? INACTIVE_BORDER_COLOR : ACTIVE_PILL_COLOR
              }
            ]}
            onPress={() => setIsWritten(!isWritten)}>
            <Text
              style={[
                styles.buttonText,
                !isWritten ? styles.buttonTextOnPrimary : styles.buttonTextInactive
              ]}>
              MCQ
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.selectSmallButton,
              {
                backgroundColor: quizType === 'meaning' ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                borderColor: quizType === 'meaning' ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
              }
            ]}
            onPress={() => setQuizType('meaning')}>
            <Text
              style={[
                styles.buttonTextSmall,
                quizType === 'meaning' ? styles.buttonTextOnPrimary : styles.buttonTextInactive
              ]}>
              meaning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectSmallButton,
              {
                backgroundColor: quizType === 'part' ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                borderColor: quizType === 'part' ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
              }
            ]}
            onPress={() => setQuizType('part')}>
            <Text
              style={[
                styles.buttonTextSmall,
                quizType === 'part' ? styles.buttonTextOnPrimary : styles.buttonTextInactive
              ]}>
              on
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectSmallButton,
              {
                backgroundColor: quizType === 'full' ? ACTIVE_PILL_COLOR : INACTIVE_PILL_COLOR,
                borderColor: quizType === 'full' ? ACTIVE_PILL_COLOR : INACTIVE_BORDER_COLOR
              }
            ]}
            onPress={() => setQuizType('full')}>
            <Text
              style={[
                styles.buttonTextSmall,
                quizType === 'full' ? styles.buttonTextOnPrimary : styles.buttonTextInactive
              ]}>
              kun
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ################# last container ################## */}
      <View style={styles.endContainer}>
        <TouchableOpacity style={styles.quizButton} onPress={checkThenNavigate}>
          <Text style={[styles.buttonTextMain, styles.buttonTextOnPrimary]}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: '5%',
    backgroundColor: COLORS.background
  },
  firstContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 10
  },
  secondContainer: {
    marginBottom: 16
  },
  flatlist: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  selectionRow: {
    width: '100%',
    marginTop: 8
  },
  endContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingVertical: 24,
    marginTop: 4
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12
  },
  block: {
    height: 50,
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR,
    borderRadius: 10
  },
  kanjiText: {
    fontSize: 22,
    fontWeight: '400',
    color: COLORS.textPrimary
  },
  quizButton: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: QUIZ_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 52,
    shadowColor: QUIZ_PRIMARY_DARK,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  selectButton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: INACTIVE_PILL_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  selectButtonTopRow: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: INACTIVE_PILL_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 30,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  selectSmallButton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: INACTIVE_PILL_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 40,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  buttonText: {
    ...FONTS.medium14,
    color: COLORS.textPrimary
  },
  buttonTextMain: {
    ...FONTS.bold14,
    color: COLORS.textPrimary
  },
  buttonTextTopRow: {
    ...FONTS.medium14,
    color: COLORS.textPrimary
  },
  buttonTextSmall: {
    ...FONTS.medium14,
    color: COLORS.textPrimary
  },
  buttonTextOnPrimary: {
    color: COLORS.interactiveTextOnPrimary
  },
  buttonTextInactive: {
    color: INACTIVE_TEXT_COLOR
  },
  pill: {
    borderRadius: 10,
    minWidth: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2%',
    paddingHorizontal: 12,
    marginRight: '2%',
    marginBottom: '2%',
    shadowColor: QUIZ_PRIMARY_DARK,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  pillText: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: 'menlo',
    color: INACTIVE_TEXT_COLOR
  },
  onPrimaryText: {
    color: COLORS.interactiveTextOnPrimary
  },
  pillTextInactive: {
    color: INACTIVE_TEXT_COLOR
  },
  text: {
    ...FONTS.bold24
  },
  pillForSecondRow: {
    width: 100,
    height: 40,
    marginBottom: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10
  },
  filterButton: {
    padding: 5,
    backgroundColor: INACTIVE_PILL_COLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER_COLOR
  },
  selectedFilterButton: {
    backgroundColor: COLORS.interactivePrimary
  },
  selectedFilterButtonText: {
    color: COLORS.interactiveTextOnPrimary
  },
  filterButtonText: {
    ...FONTS.bold14,
    color: INACTIVE_TEXT_COLOR
  }
})
