import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const mockData = [
	{ english: "I haven't hear that.", japanese: "聞いたことなかった。" },
	{ english: "I preferred hers over mine.", japanese: "私のより彼女の(ラーメン)の方が好みだった。" },
	{ english: "I don't usually eat it that much.", japanese: "それは(普段)そんなに食べないなあ。" },
	{ english: "I'm not really a fan of daikon.", japanese: "あんまりダイコンが好きじゃないんだよね。" },
	{ english: "Konjac is just okay for me.", japanese: "こんにゃくは普通かな。" },
	{ english: "Changing the subject,", japanese: "話が変わるんだけど、" },
	{ english: "I haven't decided what to see or visit yet.", japanese: "どこ行くかまだ決めてないんだよね。" },
	{ english: "Out of what you said,", japanese: "あなたが言った中なら、" },
	{ english: "Do I need to pay a fee to enter it?", japanese: "そこに入るのに入場料はかかる？" },
	{ english: "What's ~ like?", japanese: "〜ってどんな感じなん？" },
	{ english: "That sounds very interesting for me.", japanese: "面白そうやな。" },
	{ english: "I kind of understand.", japanese: "何となく分かった気がする" },
	{ english: "I want you to give me a quiz to improve my listening skills.", japanese: "英語力を高めるためにクイズを出してほしい。" },
	{ english: "That's enough for today.", japanese: "今日はこれで十分かな。" },
	{ english: "Thank you for spending time with me.", japanese: "付き合ってくれてありがとう。" },
	{ english: "I ended up doing it until 10:00.", japanese: "結局10時までやっちゃったよ。" }
];

interface RandomPhraseProps {
	onUpdate: number;
}

export function RandomPhrase({ onUpdate }: RandomPhraseProps) {
	const [phrase, setPhrase] = useState(mockData[0]);
	const [showEnglish, setShowEnglish] = useState(false);

	useEffect(() => {
		const currentIndex = mockData.indexOf(phrase);
		const nextIndex = (currentIndex + 1) % mockData.length;
		setPhrase(mockData[nextIndex]);
		setShowEnglish(false);
	}, [onUpdate]);

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