import { Flex, Text } from "@chakra-ui/react";
import { Dropzone, Headings } from "components";
import { useState } from "react";
/**
 * A <BulkOnboarding> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<BulkOnboarding></BulkOnboarding>` TODO: Fix example
 */
const BulkOnboarding = () => {
	const [file, setFile] = useState(null);
	return (
		<>
			<Headings title="Bulk Onboarding" hasIcon={false} />
			<Flex
				direction="column"
				w="100%"
				p={{ base: "1em", md: "2em" }}
				bg="white"
				borderRadius={8}
				fontSize="md"
			>
				<Flex
					direction="column"
					gap="2"
					w={{ base: "100%", md: "500px" }}
				>
					<Text fontWeight="semibold">Upload your network list</Text>
					<Dropzone
						file={file}
						setFile={setFile}
						// accept=".xls,.xlsx,.xlsm,.xlsb,.csv,.xlt,.xltx,.xlam"
					/>
				</Flex>
				{/* <Flex direction="column" gap="2">
					<Text fontWeight="semibold">Result</Text>
					<BulkOnboardingResponse />
				</Flex> */}
			</Flex>
		</>
	);
};

export default BulkOnboarding;
