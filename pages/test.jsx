import { Center } from "@chakra-ui/react";
import { /* MultiSelect */ Button } from "components";
// import { useState } from "react";
import { useWallet } from "contexts";
const dummyOptions = [
	{ mobile: "apple", name: "Apple" },
	{ mobile: "banana", name: "Banana" },
	{ mobile: "orange", name: "Orange" },
	{ mobile: "pear", name: "Pear" },
	{ mobile: "grape", name: "Grape" },
	{ mobile: "kiwi", name: "Kiwi" },
	{ mobile: "mango", name: "Mango" },
	{ mobile: "pineapple", name: "Pineapple" },
	{ mobile: "watermelon", name: "Watermelon" },
	{ mobile: "strawberry", name: "Strawberry" },
	{ mobile: "blueberry", name: "Blueberry" },
	{ mobile: "raspberry", name: "Raspberry" },
	{ mobile: "blackberry", name: "Blackberry" },
	{ mobile: "pomegranate", name: "Pomegranate" },
	{ mobile: "peach", name: "Peach" },
	{ mobile: "apricot", name: "Apricot" },
	{ mobile: "plum", name: "Plum" },
	{ mobile: "cherry", name: "Cherry" },
	{ mobile: "grapefruit", name: "Grapefruit" },
	{ mobile: "lemon", name: "Lemon" },
	{ mobile: "lime", name: "Lime" },
	{ mobile: "tangerine", name: "Tangerine" },
	{ mobile: "mandarin", name: "Mandarin" },
	{ mobile: "peppermint", name: "Peppermint" },
	{ mobile: "persimmon", name: "Persimmon" },
	{ mobile: "guava", name: "Guava" },
	{ mobile: "papaya", name: "Papaya" },
	{ mobile: "dragonfruit", name: "Dragonfruit" },
	{ mobile: "starfruit", name: "Starfruit" },
	{ mobile: "passionfruit", name: "Passionfruit" },
];

const Test = () => {
	// const [data, setData] = useState([]);
	// console.log("data", data);
	// const renderer = {
	// 	value: "mobile",
	// 	label: "name",
	// };
	const { refreshWallet, setBalance, balance } = useWallet();
	return (
		<Center height="100vh">
			<Button onClick={() => setBalance("1000")}>Update Balance</Button>
			<Button onClick={() => refreshWallet()}>refreshWallet</Button>
			{/* <Flex direction="column" rowGap="2">
				<Text fontSize="16px" fontWeight="bold">
					Select Distributor
				</Text>
				<MultiSelect
					options={dummyOptions}
					renderer={renderer}
					setData={setData}
				/>
			</Flex> */}
		</Center>
	);
};

export default Test;
