import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Phrase {
	id: string;
	english: string;
	japanese: string;
	date: string;
}

interface RandomPhraseProps {
	phraseIndex: number;
}

export function RandomPhrase({ phraseIndex }: RandomPhraseProps) {
	const [mockData, setMockData ] = useState<Phrase[]>([]);
	const [showEnglish, setShowEnglish] = useState(false);

	useEffect(() => {
		fetch('https://english-phrase-practice-app-be.vercel.app/api/notion/getData')
			.then(response => response.json())
			.then(jsonData => setMockData(jsonData.data))
			.catch(error => console.error('Error fetching phrases:', error));
	}, []);
	
	const phrase = mockData.length > 0 
	? mockData[phraseIndex % mockData.length] 
	: { id: '', english: '', japanese: '', date: '' };

	useEffect(() => {
		setShowEnglish(false);
	}, [phraseIndex]);

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.card}>
				<ThemedView style={styles.contentContainer}>
					<ThemedView style={styles.phraseContainer}>
						<ThemedText type="title" style={styles.japanese}>
							{phrase.japanese}
						</ThemedText>
						<ThemedView style={styles.englishContainer}>
							{showEnglish ? (
								<ThemedText type="title" style={styles.english}>
									{phrase.english}
								</ThemedText>
							) : (
								<ThemedView style={styles.placeholder} />
							)}
						</ThemedView>
					</ThemedView>

					<Pressable
						onPress={(e) => {
							e.stopPropagation();
							setShowEnglish(!showEnglish);
						}}
						style={({ pressed }) => [
							styles.button,
							pressed && styles.buttonPressed
						]}
					>
						<ThemedText>
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
		alignItems: 'center',
		width: '100%',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		width: '100%',
		maxWidth: 550,
		height: 320,
		shadowColor: 'rgba(0, 0, 0, 0.1)',
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
		justifyContent: 'space-between',
	},
	phraseContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 16,
		position: 'relative',
	},
	englishContainer: {
		minHeight: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16,
		position: 'absolute',
		bottom: 40,
		width: '100%',
	},
	placeholder: {
		height: 48,
	},
	japanese: {
		fontSize: 20,
		textAlign: 'center',
		paddingHorizontal: 16,
		position: 'absolute',
		top: 40,
		width: '100%',
		lineHeight: 28,
	},
	english: {
		fontSize: 20,
		textAlign: 'center',
		paddingHorizontal: 16,
	},
	button: {
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#A1CEDC',
		alignItems: 'center',
		alignSelf: 'center',
		minWidth: 120,
	},
	buttonPressed: {
		opacity: 0.7,
	}
}); 