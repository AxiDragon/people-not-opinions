import 'react-native-gesture-handler';
import { ScrollView, StyleSheet, View, Text } from "react-native";
import MessageUI from "./MessageUI";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import Message from '@/models/Message';
import { COLORS } from '@/constants/colors';

type Props = {
	messages: Message[];
	onEnd?: () => void;
}

export type ChatHandle = {
	continueChat: () => void;
}

const Chat = forwardRef<ChatHandle, Props>(({ messages, onEnd = () => { } }: Props, ref) => {
	const scrollViewRef = useRef<ScrollView>(null);
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
	const [conversationEnded, setConversationEnded] = useState(false);

	//TODO: Maybe contemplate if this is the best way to handle this
	//it works for now though! I'll learn along the way
	const handleTap = useCallback(() => {
		if (messages[currentMessageIndex].continueCondition()) {
			continueChat();
		}
	}, [currentMessageIndex, messages.length]);

	const continueChat = useCallback(() => {
		if (currentMessageIndex < messages.length - 1 || messages[currentMessageIndex].addsContentOnContinue) {
			messages[currentMessageIndex].onContinue && messages[currentMessageIndex].onContinue();
			setCurrentMessageIndex(currentMessageIndex + 1);
		}
		else if (currentMessageIndex === messages.length - 1 && !conversationEnded) {
			onEnd();
			window.dispatchEvent(new Event("onConversationEnd"));
			setConversationEnded(true);
		}
	}, [currentMessageIndex, messages.length]);

	useImperativeHandle(ref, () => ({
		continueChat,
	}), [continueChat]);

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}
	}, [currentMessageIndex]);

	const tap = Gesture.Tap().onStart(handleTap);

	//TODO: The last message still blocks scrolling due to GestureDetector - find a way to deal with that
	//TODO: See if there's a way to check if the previous message was from the same user and if so, don't show the UserUI
	//TODO: Find a better way to handle this. just, for now, gotta tap the bottom one
	//TODO: Display 'Tap here to continue' only when the current message can be progressed
	return (
		<GestureHandlerRootView style={{
			flex: 1,
			width: 500,
			maxWidth: "100%",
		}}>
			<ScrollView
				contentContainerStyle={styles.chatContainer}
				ref={scrollViewRef}
				showsVerticalScrollIndicator={false}
			>
				{messages.map((message, i) => (
					<MessageUI key={i}
						message={message}
						show={i <= currentMessageIndex}
						interactable={i === currentMessageIndex} />
				))}
			</ScrollView>
			<GestureDetector gesture={tap}>
				<View style={styles.tappable}>
					<Text style={styles.tappableText}>Tap here to continue</Text>
				</View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
});

const styles = StyleSheet.create({
	chatContainer: {
		display: "flex",
		padding: 20,
		paddingBottom: 350,
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 15,
		width: "100%",
	},
	tappable: {
		width: "100%",
		height: 150,
		alignContent: "center",
		justifyContent: "center",
	},
	tappableText: {
		color: COLORS.text,
		fontSize: 25,
		textAlign: "center",
	},
});

export default Chat;