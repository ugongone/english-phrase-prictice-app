import { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Pressable, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Audio } from "expo-av";

interface Phrase {
  pageId: string;
  properties: {
    id: string;
    english: string;
    japanese: string;
    date: string;
    status: string;
  };
}

interface PhraseCardProps {
  phraseIndex: number;
  phrases: Phrase[];
  showEnglish: boolean;
  // 英語の表示/非表示を切り替えるコールバック
  onToggleEnglish: (phraseIndex: number) => void;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function PhraseCard({
  phraseIndex,
  phrases,
  showEnglish,
  onToggleEnglish,
}: PhraseCardProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const phrase =
    phrases.length > 0
      ? phrases[phraseIndex % phrases.length]
      : {
          pageId: "",
          properties: {
            id: "",
            english: "",
            japanese: "",
            date: "",
            status: "",
          },
        };

  async function playSound() {
    try {
      // ボタンを押した瞬間に「再生中」扱いにして、二重押下を防ぐ
      setIsPlaying(true);

      if (sound) {
        await sound.unloadAsync();
      }

      const response = await fetch(`${apiUrl}/api/openai/getVoiceData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: phrase.properties.english,
        }),
      });
      const data = await response.json();
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: data.audio },
        { shouldPlay: true }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          // 多重再生を防ぐために再生終了後にサウンドをクリーンアップ
          newSound.setOnPlaybackStatusUpdate(() => {});
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
    }
  }

  // コンポーネントがアンマウントされる際に、サウンドをクリーンアップしてメモリを解放
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.contentContainer}>
          <ThemedView style={styles.phraseContainer}>
            <ThemedText type="title" style={styles.japanese}>
              {phrase.properties.japanese}
            </ThemedText>
            <ThemedView style={styles.englishContainer}>
              {showEnglish ? (
                <ThemedView style={styles.englishWrapper}>
                  <ThemedText type="title" style={styles.english}>
                    {phrase.properties.english}
                  </ThemedText>
                  <Pressable
                    onPress={playSound}
                    disabled={isPlaying}
                    style={[
                      styles.speakerButton,
                      isPlaying && styles.speakerButtonDisabled,
                    ]}
                  >
                    <Image
                      source={require("../assets/images/speaker-filled-audio-tool.png")}
                      style={styles.logo}
                    />
                  </Pressable>
                </ThemedView>
              ) : (
                <ThemedView style={styles.placeholder} />
              )}
            </ThemedView>
          </ThemedView>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleEnglish(phraseIndex);
            }}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.buttonText}>
              {showEnglish ? "英語を非表示" : "英語を表示"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 550,
    height: 360,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  contentContainer: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  phraseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
  },
  englishContainer: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  englishWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  placeholder: {
    height: 48,
  },
  japanese: {
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 16,
    position: "absolute",
    top: 40,
    width: "100%",
    lineHeight: 28,
  },
  english: {
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#A1CEDC",
    alignItems: "center",
    alignSelf: "center",
    minWidth: 120,
    elevation: 2, // Androidのシャドウ
    shadowColor: "#000", // iOSのシャドウ
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  speakerButton: {
    opacity: 1,
  },
  speakerButtonDisabled: {
    opacity: 0.5,
  },
});
