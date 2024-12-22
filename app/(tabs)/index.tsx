import { StyleSheet, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { RandomPhrase } from '@/components/RandomPhrase';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const prevSlideAnim = useRef(new Animated.Value(-350)).current;
  const currentSlideAnim = useRef(new Animated.Value(0)).current;
  const nextSlideAnim = useRef(new Animated.Value(350)).current;

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.velocityX < -50) {
        Animated.parallel([
          Animated.timing(prevSlideAnim, {
            toValue: 350,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(currentSlideAnim, {
            toValue: -400,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(nextSlideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          setCurrentPhraseIndex(prev => prev + 1);
          prevSlideAnim.setValue(-350);
          currentSlideAnim.setValue(0);
          nextSlideAnim.setValue(350);
        });
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <ThemedView 
        style={styles.pressable}
        lightColor="#F5F5F5"
        darkColor="#F5F5F5">
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={<ThemedView />}>
          <ThemedView style={styles.container}
            lightColor="#F5F5F5"
            darkColor="#F5F5F5">
            <Animated.View style={[
              styles.cardContainer,
              {
                position: 'absolute',
                transform: [{ translateX: prevSlideAnim }]
              }
            ]}>
              <RandomPhrase phraseIndex={currentPhraseIndex} />
            </Animated.View>

            <Animated.View style={[
              styles.cardContainer,
              {
                position: 'absolute',
                transform: [{ translateX: currentSlideAnim }]
              }
            ]}>
              <RandomPhrase phraseIndex={currentPhraseIndex} />
            </Animated.View>

            <Animated.View style={[
              styles.cardContainer,
              {
                position: 'absolute',
                transform: [{ translateX: nextSlideAnim }]
              }
            ]}>
              <RandomPhrase phraseIndex={currentPhraseIndex + 1} />
            </Animated.View>
          </ThemedView>
        </ParallaxScrollView>
      </ThemedView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    minHeight: 400,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    transform: [{ translateY: -180 }],
  }
});
