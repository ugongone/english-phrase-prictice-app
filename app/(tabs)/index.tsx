import { StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { RandomPhrase } from '@/components/RandomPhrase';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handlePress = () => {
    setUpdateTrigger(prev => !prev);
  };

  return (
    <Pressable 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed
      ]}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<ThemedView />}>
        <ThemedView style={styles.container}>
          <RandomPhrase onUpdate={updateTrigger} />
        </ThemedView>
      </ParallaxScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.98,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});
