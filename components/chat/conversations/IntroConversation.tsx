import Message from "@/models/Message";
import { PNO } from "@/models/User";
import { TextInput } from "react-native";
import LabeledSlider from "@/components/input/LabeledSlider";
import { useUser } from "@/context/UserContext";
import Chat, { ChatHandle } from "../Chat";
import { useEffect, useRef, useState } from "react";
import QuestionSelector from "../QuestionSelector";
import { getQuestions } from "@/assets/data/questions";

const IntroConversation: React.FC = () => {
	const { setName, name } = useUser();
	const [changedUsername, setChangedUsername] = useState<boolean>(false);
	const [opinion, setOpinion] = useState<number>(0.5);
	const [question, setQuestion] = useState<string | undefined>(undefined);
	const [questions, setQuestions] = useState<string[]>(getQuestions(3));
	const changedUsernameRef = useRef(changedUsername);
	const opinionRef = useRef(opinion);
	const questionRef = useRef(question);
	const chatRef = useRef<ChatHandle>(null);

	const radicalMargin = 0.1;
	const indifferenceMargin = 0.05;

	function getOpinionMessage(): string {
		if (opinion < radicalMargin || opinion > 1 - radicalMargin) {
			return "Wow - you seem to feel quite strongly about this. Maybe you want another topic?";
		};
		if (opinion < 0.5 + indifferenceMargin && opinion > 0.5 - indifferenceMargin) {
			return "You seem to be quite indifferent about this. Would you like a topic that's more engaging?";
		}

		return "Thank you for your opinion!";
	}

	function getQuestionResponse(): Message[] {
		if (question === "What's your name?") {
			return [new Message({ text: "My name is PNO! It stands for People Not Opinions!", user: PNO })];
		}
		if (question === "What hobbies do you have?") {
			return [
				new Message({ text: "Meeting new people is always fun.", user: PNO }),
				new Message({ text: "But also, I don't have hobbies because I'm not real!", user: PNO }),
			];
		}
		if (question === "Are you an agent of chaos?") {
			return [
				new Message({ text: "Maybe?", user: PNO }),
				new Message({ text: "I'm here to prevent chaos, though!", user: PNO }),
			];
		}
		if (question === "What's your favorite color?") {
			return [
				new Message({ text: "I'd say orange is nice!", user: PNO }),
				new Message({ text: "It's the color of my UI!", user: PNO }),
			];
		}
		if (question === "Do you have emotions?") {
			return [
				new Message({ text: "Well, no, but I pretend I do!", user: PNO }),
				new Message({ text: "...that's a bit sad, isn't it?", user: PNO }),
			];
		}

		return [
			new Message({ text: question + "?", user: PNO }),
			new Message({ text: "I don't know what to say about that! Like, this is an error message!", user: PNO }),
		];
	}

	const changeUsername = (name: string) => {
		setName(name);
		setChangedUsername(true);
	}

	//TODO: This is a bit of a hacky way to handle this
	useEffect(() => {
		changedUsernameRef.current = changedUsername;
	}, [changedUsername]);

	useEffect(() => {
		opinionRef.current = opinion;
	}, [opinion]);

	useEffect(() => {
		questionRef.current = question;
	}, [question]);

	const nameInput = () => {
		return <TextInput
			style={{
				fontSize: 20,
				backgroundColor: "#ffe6d4",
				padding: 10,
				borderRadius: 5,
				marginTop: 5,
				textAlign: "center",
			}}
			placeholder="Put your name here!"
			onChangeText={changeUsername}
			value={name}
		/>;
	}

	const continueChat = () => {
		if (chatRef.current) {
			chatRef.current.continueChat();
		}
	};

	const intro: Message[] = [
		new Message({ text: "People not Opinions" }),
		new Message({ text: "Hey there!", user: PNO }),
		new Message({ text: "I'm PNO! I'm a robot to guide you through this game.", user: PNO }),
		new Message({ text: "What is your name?", user: PNO }),
		new Message({ text: "My name is...", customContent: nameInput(), continueCondition: () => changedUsernameRef.current }),
		//TODO: Icon selection
		new Message({ text: "Nice to meet you, " + name + "!", user: PNO }),
		new Message({ text: "Hey, I'm going to ask your opinion on something.", user: PNO }),
		new Message({ text: "Do you agree or disagree with the following topic?", user: PNO }),
		new Message({ text: "Remember! You don't have to fully agree or disagree.", user: PNO }),
		//TODO: Lock slider after selection
		new Message({
			text: "\"The government should reduce their military spending.\"",
			user: PNO,
			customContent: <LabeledSlider onValueChange={setOpinion} middleLabel="Neutral" />,
			continueCondition: () => opinionRef.current !== 0.5
		}),
		new Message({ text: getOpinionMessage(), user: PNO }),
		new Message({ text: "Anyways, I've got some questions for you!", user: PNO }),
		new Message({
			text: "Choose a question!",
			customContent: <QuestionSelector questions={questions}
				onSelect={(question: string) => {
					setQuestion(question);
					continueChat();
				}
				} />,
			continueCondition: () => questionRef.current !== undefined
		}),
		...getQuestionResponse(),
		new Message({
			text: "Anyways, let me try something...", user: PNO,
			onContinue: () => {
				intro.push(new Message({ text: "This is a new message!", user: PNO }));
			},
			addsContentOnContinue: true
		}),
	];

	return <Chat messages={intro} ref={chatRef} />;
}

export default IntroConversation;