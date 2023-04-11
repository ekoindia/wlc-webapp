import { Center, Flex, Text } from "@chakra-ui/react";
import { MultiSelect } from "components";
import { useState } from "react";

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

const chakra = () => {
	const [data, setData] = useState([]);
	console.log("data", data);
	const renderer = {
		value: "mobile",
		label: "name",
	};
	return (
		<Center height="100vh">
			<Flex direction="column" rowGap="2">
				<Text fontSize="16px" fontWeight="bold">
					Select Distributor
				</Text>
				<MultiSelect
					options={dummyOptions}
					renderer={renderer}
					setData={setData}
				/>
			</Flex>
		</Center>
	);
};

export default chakra;
