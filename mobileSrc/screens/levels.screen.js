import React, { useState } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions
} from "react-native";
import COLORS from "../theme/colors";

const { width } = Dimensions.get('window');

const Levels = ({ navigation: { navigate } }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Journey path configuration
  const totalLevels = 50;

  const getLevelStatus = (level) => {
    // You can implement actual progress logic here
    // For now, let's simulate some completed levels
    if (level <= 15) return 'completed';
    if (level <= 20) return 'current';
    return 'locked';
  };

  const getLevelIcon = (level, status) => {
    const icons = {
      completed: '🏆',
      current: '⭐',
      locked: '🔒'
    };
    return icons[status];
  };

  const STATUS_COLORS = {
    completed: { accent: COLORS.accentSuccess, background: COLORS.successSoft },
    current: { accent: COLORS.accentWarning, background: COLORS.warningSoft },
    locked: { accent: COLORS.textMuted, background: COLORS.mutedSoft }
  };

  const getLevelColor = (status) => STATUS_COLORS[status].accent;
  const getLevelBackground = (status) => STATUS_COLORS[status].background;



  const renderJourneyPath = () => {
    const pathElements = [];
    
    for (let level = 1; level <= totalLevels; level++) {
      const status = getLevelStatus(level);
      const isSelected = selectedLevel === level;
      
      // Determine position (alternating left-right in a serpentine pattern)
      const isEven = level % 2 === 0;
      const leftSide = !isEven;
      
      pathElements.push(
        <View key={level} style={[
          styles.serpentineLevelContainer,
          leftSide ? styles.leftLevel : styles.rightLevel
        ]}>
          {/* Curved path connector */}
          {level > 1 && (
            <View style={[
              styles.pathConnector,
              leftSide ? styles.leftConnector : styles.rightConnector
            ]}>
              <View style={[
                styles.curvedPath,
                { backgroundColor: getLevelColor(getLevelStatus(level - 1)) }
              ]} />
            </View>
          )}
          
          {/* Level button */}
          <TouchableOpacity
            style={[
              styles.serpentineLevelButton,
              { backgroundColor: getLevelBackground(status) },
              { borderColor: getLevelColor(status) },
              isSelected && styles.selectedLevelBox
            ]}
            onPress={() => {
              setSelectedLevel(level);
              if (status !== 'locked') {
                navigate("LevelDetails", { level });
              }
            }}
            disabled={status === 'locked'}
          >
            <Text style={styles.levelIcon}>{getLevelIcon(level, status)}</Text>
            <Text style={[
              styles.levelText,
              { color: getLevelColor(status) }
            ]}>
              {level}
            </Text>
            
            {status === 'completed' && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    
    return pathElements;
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Master Japanese, one level at a time</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.journeyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.journeyPath}>
          {renderJourneyPath()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  journeyContainer: {
    paddingVertical: 20,
  },
  journeyPath: {
    paddingHorizontal: 20,
  },
  serpentineLevelContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftLevel: {
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
  rightLevel: {
    alignItems: 'flex-end',
    paddingRight: 40,
  },
  pathConnector: {
    position: 'absolute',
    top: -60,
    height: 60,
    width: width * 0.8,
    zIndex: 1,
  },
  leftConnector: {
    right: 40,
  },
  rightConnector: {
    left: 40,
  },
  curvedPath: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 30,
  },
  serpentineLevelButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    position: 'relative',
    zIndex: 2,
  },
  selectedLevelBox: {
    borderColor: COLORS.brandPrimary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
    shadowColor: COLORS.brandPrimary,
    shadowOpacity: 0.3,
  },
  levelIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.accentSuccess,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
    shadowColor: COLORS.brandPrimaryDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  completedText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Levels;
