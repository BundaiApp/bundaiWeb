import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
// components
import { VerticalSpacer } from '../components/spacers'

// utils
import { whichColor, whichTextColor } from '../util/constants'
import COLORS from '../theme/colors'

const ACTIVE_SMALL_BLOCK_COLOR = COLORS.interactivePrimary

export const SmallBlock = ({ handlePress, blockHeader, sub, isActive = false }) => {
  const baseColor = whichColor[blockHeader] || COLORS.interactiveSurface
  const baseTextColor = whichTextColor[blockHeader] || COLORS.interactiveTextInactive
  const backgroundColor = isActive ? ACTIVE_SMALL_BLOCK_COLOR : baseColor
  const headingColor = isActive ? COLORS.interactiveTextOnPrimary : COLORS.textPrimary
  const subtitleColor = isActive ? COLORS.interactiveTextOnPrimary : baseTextColor

  return (
    <TouchableOpacity
      style={[styles.jlptBlock, { backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.85}>
      <Text
        style={[
          styles.headerMedium,
          { color: headingColor }
        ]}>
        {blockHeader}
      </Text>
      <VerticalSpacer height={2} />
      <Text
        style={[
          styles.subtitleText,
          { color: subtitleColor }
        ]}>
        {sub}
      </Text>
    </TouchableOpacity>
  )
}

export const Pill = ({ index, handlePress, subject, level, isAll, isSelected }) => {
  const key = isAll ? 'LevelAll' : subject
  const baseColor = whichColor[key] || COLORS.interactiveSurface
  const baseTextColor = whichTextColor[key] || COLORS.interactiveTextInactive
  const backgroundColor = isSelected ? COLORS.interactivePrimary : baseColor
  const textColor = isSelected ? COLORS.interactiveTextOnPrimary : baseTextColor

  return (
    <TouchableOpacity style={[styles.pill, { backgroundColor }]} onPress={handlePress}>
      <Text
        style={[
          styles.subtitleText,
          { color: textColor }
        ]}>
        {isAll ? 'All' : subject === 'JLPT' ? 'N' : null}
        {isAll ? null : subject === 'JLPT' ? level - index : index + 1}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  jlptBlock: {
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    paddingVertical: '3%',
    marginBottom: '2%',
    backgroundColor: COLORS.interactiveSurface,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  headerMedium: {
    fontWeight: '400',
    fontSize: 18,
    fontFamily: 'menlo',
    color: COLORS.textPrimary
  },

  // pill component
  pill: {
    backgroundColor: COLORS.interactiveSurface,
    borderRadius: 10,
    width: '18%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    marginRight: '2%',
    marginBottom: '2%',
    shadowColor: COLORS.brandPrimaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },

  // common to all
  subtitleText: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: 'menlo',
    color: COLORS.interactiveTextInactive
  }
})
