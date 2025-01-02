import { StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { RandomPhrase } from '@/components/RandomPhrase';
import { ThemedView } from '@/components/ThemedView';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  const cardWidth = screenWidth * 0.8;
  // 画面端からのカードのはみ出し幅(px)
  const peekWidth = 10;

  // 各カードの初期位置
  const initialCardPositionLeft = -screenWidth/2 -cardWidth/2 + peekWidth;
  const initialCardPositionMiddle = 0;
  const initialCardPositionRight = screenWidth/2 + cardWidth/2 - peekWidth;

  const translateXLeft = useSharedValue(initialCardPositionLeft);
  const translateXMiddle = useSharedValue(initialCardPositionMiddle);
  const translateXRight = useSharedValue(initialCardPositionRight);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 初期描画場所から、実際のスワイプ距離に合わせて全てのカードを移動
      translateXLeft.value = initialCardPositionLeft + event.translationX;
      translateXMiddle.value = initialCardPositionMiddle + event.translationX;
      translateXRight.value = initialCardPositionRight + event.translationX;
    })
    .onEnd((event) => {
      // スワイプ距離が左に50pxより大きい場合は、カードを左に移動
      if (event.translationX < -50) {
        translateXLeft.value = withTiming(initialCardPositionLeft * 2, { duration: 300 });
        translateXMiddle.value = withTiming(initialCardPositionLeft, { duration: 300 });
        translateXRight.value = withTiming(initialCardPositionMiddle, { duration: 300 }, () => {
          // 次のカードを表示するために、カードのインデックスを更新
          // 状態更新はJSスレッドで行う必要があるため、runOnJSを使用
          runOnJS(setCurrentPhraseIndex)(prev => prev + 1);
          translateXLeft.value = initialCardPositionLeft;
          translateXMiddle.value = initialCardPositionMiddle;
          translateXRight.value = initialCardPositionRight;
        });
      } else {
        // スワイプ距離が左に50pxより小さい場合は、カードを初期位置に戻す
        translateXLeft.value = withTiming(initialCardPositionLeft, { duration: 300 });
        translateXMiddle.value = withTiming(initialCardPositionMiddle, { duration: 300 });
        translateXRight.value = withTiming(initialCardPositionRight, { duration: 300 });
      }
    });
  const animatedStyleLeft = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXLeft.value }]
    };
  });

  const animatedStyleMiddle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXMiddle.value }]
    };
  });

  const animatedStyleRight = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateXRight.value }]
    };
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={swipeGesture}>
        <ThemedView style={styles.container}
          lightColor="#F5F5F5"
          darkColor="#F5F5F5">

          <Animated.View style={[
            styles.cardContainer,
            animatedStyleLeft,
          ]}>
            <RandomPhrase phraseIndex={currentPhraseIndex} phrases={phrases} />
          </Animated.View>

          <Animated.View style={[
            styles.cardContainer,
            animatedStyleMiddle,
          ]}>
            <RandomPhrase phraseIndex={currentPhraseIndex + 1} phrases={phrases} />
          </Animated.View>

          <Animated.View style={[
            styles.cardContainer,
            animatedStyleRight,
          ]}>
            <RandomPhrase phraseIndex={currentPhraseIndex + 2} phrases={phrases} />
          </Animated.View>
        </ThemedView>
      </GestureDetector>
    </GestureHandlerRootView>
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
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'absolute',
  }
});
