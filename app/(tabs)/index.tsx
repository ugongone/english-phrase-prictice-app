import { StyleSheet, Animated, useWindowDimensions} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { RandomPhrase } from '@/components/RandomPhrase';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface Phrase {
  id: string;
  english: string;
  japanese: string;
  date: string;
}

export default function HomeScreen() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [phrases, setPhrases] = useState<Phrase[]>([]);

  // シャッフル関数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // データフェッチを親コンポーネントで1回だけ実行
  useEffect(() => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API_URL is not set');
    }

    fetch(`${apiUrl}/api/notion/getData`)
      .then(response => response.json())
      .then(jsonData => setPhrases(shuffleArray(jsonData.data)))
      .catch(error => console.error('Error fetching phrases:', error));
  }, []);

  // 画面の横幅を取得
  const { width: screenWidth } = useWindowDimensions();
  // Webだと初期描画時にscreenWidthが0になることがあるので、
  // その場合はnullを返して描画をスキップする
  if (screenWidth === 0) {
    return null
  }
  // カードの横幅を計算
  const cardWidth = screenWidth * 0.9;
  // 画面端からのカードのはみ出し量(30px)
  const peekWidth = 30;

  // カードの位置を初期化
  const prevSlideAnim = useRef(new Animated.Value(-cardWidth + peekWidth)).current;
  const currentSlideAnim = useRef(new Animated.Value(0)).current;
  const nextSlideAnim = useRef(new Animated.Value(cardWidth - peekWidth)).current;

  // 初期位置の設定
  useEffect(() => {
    if (cardWidth > 0) {
      prevSlideAnim.setValue(-cardWidth + peekWidth);
      currentSlideAnim.setValue(0);
      nextSlideAnim.setValue(cardWidth - peekWidth);
    }
  }, [cardWidth]);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.velocityX < -50) {
        Animated.parallel([
          // 前のカードはさらに左に移動して画面外に
          Animated.timing(prevSlideAnim, {
            toValue: -cardWidth * 2,
            duration: 300,
            useNativeDriver: true,
          }),
          // 現在のカードは左に移動
          Animated.timing(currentSlideAnim, {
            toValue: -cardWidth + peekWidth,
            duration: 300,
            useNativeDriver: true,
          }),
          // 次のカードは中央に移動
          Animated.timing(nextSlideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          setCurrentPhraseIndex(prev => prev + 1);
          prevSlideAnim.setValue(-cardWidth + peekWidth);
          currentSlideAnim.setValue(0);
          nextSlideAnim.setValue(cardWidth - peekWidth);
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
              <RandomPhrase phraseIndex={currentPhraseIndex} phrases={phrases} />
            </Animated.View>

            <Animated.View style={[
              styles.cardContainer,
              {
                position: 'absolute',
                transform: [{ translateX: currentSlideAnim }]
              }
            ]}>
              <RandomPhrase phraseIndex={currentPhraseIndex} phrases={phrases} />
            </Animated.View>

            <Animated.View style={[
              styles.cardContainer,
              {
                position: 'absolute',
                transform: [{ translateX: nextSlideAnim }]
              }
            ]}>
              <RandomPhrase phraseIndex={currentPhraseIndex + 1} phrases={phrases} />
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
