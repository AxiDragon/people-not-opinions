import Message from "@/models/Message";
import { PNO } from "@/models/User";
import { TextInput } from "react-native";
import { getUsername, hasSetUsername, setUsername } from "../data/globalVars";
import LabelledSlider from "@/components/input/LabelledSlider";

const intro: Message[] = [
	new Message("People not Opinions"),
	new Message("Hey there!", PNO),
	new Message("What is your name?", PNO),
	new Message("My name is...", undefined,
		<TextInput
			style={{
				fontSize: 24,
				backgroundColor: "papayawhip",
				padding: 5,
				borderRadius: 5,
				marginTop: 5
			}}
			placeholder="Put your name here!"
			onChangeText={setUsername}
		/>,
		hasSetUsername
	),
	//TODO: Icon selection
	new Message(() => "Nice to meet you, " + getUsername() + "!", PNO),
	new Message("I'd like to ask if you agree or disagree on the following:", PNO),
	new Message("The government should reduce their military spending.", PNO,
		<LabelledSlider onValueChange={(value) => console.log(value)} middleLabel="No Opinion" />
	),
];

export default intro;