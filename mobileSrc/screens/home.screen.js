import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

// components
import { Pill, SmallBlock } from '../components/blocks'
import { HorizontalSpacer, VerticalSpacer } from '../components/spacers'
import { TextBlock } from '../components/textBlock'
// utils
import { topics, words } from '../util/constants'
import COLORS from '../theme/colors'

export default function Home({ navigation: { navigate } }) {
  const [topic, setTopic] = useState('jlpt')

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <VerticalSpacer height={15} />

      <View style={styles.blockHolder}>
        <TextBlock tx1={'Kanji'} tx2={'Japanese characters'} />
        <VerticalSpacer height={5} />
        <View style={styles.basicRow}>
          {topics.map((i) => (
            <SmallBlock
              key={i.topicName}
              handlePress={() => setTopic(i.topicName)}
              blockHeader={i.header}
              sub={i.subtitle}
              isActive={topic === i.topicName}
            />
          ))}
        </View>

        <VerticalSpacer height={5} />

        <View style={styles.jlptRow}>
          {topic === 'jlpt' ? (
            <>
              {new Array(5).fill(1).map((i, index) => (
                <Pill
                  key={index}
                  index={index}
                  level={5}
                  subject={'JLPT'}
                  isAll={false}
                  handlePress={() =>
                    navigate('KanjiTemplate', {
                      jlptLevel: 5 - index,
                      title: `JLPT Level ${5 - index}`
                    })
                  }
                />
              ))}
              <Pill
                isAll={true}
                handlePress={() =>
                  navigate('AllKanji', { type: 'jlpt', jlpt: true, title: `All Kanji` })
                }
              />
            </>
          ) : null}

          {topic === 'strokes' ? (
            <>
              {new Array(24).fill(1).map((i, index) => (
                <Pill
                  key={index}
                  index={index}
                  subject={'Stroke'}
                  isAll={false}
                  handlePress={() =>
                    navigate('KanjiTemplate', {
                      strokes: index + 1,
                      title: `${index + 1} Stroke Kanji `
                    })
                  }
                />
              ))}
              <Pill
                subject={'tan'}
                isAll={true}
                handlePress={() =>
                  navigate('AllKanji', { type: 'strokes', strokes: true, title: `All Kanji` })
                }
              />
            </>
          ) : null}

          {topic === 'grades' ? (
            <>
              {new Array(9).fill(1).map((i, index) => (
                <Pill
                  key={index}
                  index={index}
                  subject={'Grade'}
                  isAll={false}
                  handlePress={() =>
                    navigate('KanjiTemplate', {
                      grades: index + 1,
                      title: `Grade ${index + 1}`
                    })
                  }
                />
              ))}
              <Pill
                subject={'tan'}
                isAll={true}
                handlePress={() =>
                  navigate('AllKanji', { type: 'grade', grades: true, title: 'All Kanji' })
                }
              />
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.blockHolder}>
        <TextBlock tx1={'Words 文甫'} tx2={'Words with Hiragana'} />
        <View style={styles.wordsRow}>
          {words.map((i) => (
            <SmallBlock
              key={i.topicName}
              handlePress={() =>
                navigate('KanjiTemplate', {
                  title: i.topicName,
                  jlptLevel: false,
                  grades: false,
                  strokes: false,
                  verbs: i.topicName === 'verbs' ?? false,
                  nouns: i.topicName === 'nouns' ?? false,
                  adjectives: i.topicName === 'adjectives' ?? false,
                  adverbs: i.topicName === 'adverbs' ?? false,
                  isWord:
                    i.topicName === 'verbs' || 'nouns' || 'adjectives' || 'adverbs' ? true : false
                })
              }
              blockHeader={i.header}
              sub={i.subtitle}
            />
          ))}
        </View>
      </View>

      <View style={styles.blockHolder}>
        <TextBlock tx1={'Hirgana & Katakana'} tx2={'Letters of Japanese Language'} />
        <View style={[styles.wordsRow, { justifyContent: 'flex-start' }]}>
          <SmallBlock
            handlePress={() =>
              navigate('KanjiTemplate', {
                hiragana: true,
                title: 'Hiragana'
              })
            }
            blockHeader={'Hiragana'}
            sub={'Japanese letters'}
          />
          <HorizontalSpacer width={10} />
          <SmallBlock
            handlePress={() =>
              navigate('KanjiTemplate', {
                katakana: true,
                title: 'Katakana'
              })
            }
            blockHeader={'Katakana'}
            sub={'Foreign sound Letters'}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.background
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingBottom: '50%'
  },
  blockHolder: {
    width: '95%',
    paddingHorizontal: '5%',
    borderRadius: 20,
    paddingVertical: 18,
    marginBottom: 15,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.interactivePrimaryPressed,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  jlptBlock: {
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    paddingVertical: '3%',
    marginBottom: '2%'
  },

  headerMedium: {
    fontWeight: '400',
    fontSize: 18,
    fontFamily: 'menlo'
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'flex-start',
    fontFamily: 'menlo'
  },
  h3: {
    fontWeight: '300',
    fontSize: 10,
    paddingVertical: '2%',
    fontFamily: 'menlo',
    color: COLORS.interactiveTextInactive
  },
  h4: {
    fontWeight: '300',
    fontSize: 15,
    fontFamily: 'menlo',
    color: COLORS.interactiveTextInactive
  },
  subtitleText: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: 'menlo',
    color: COLORS.interactiveTextInactive
  },
  basicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  wordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  jlptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})
