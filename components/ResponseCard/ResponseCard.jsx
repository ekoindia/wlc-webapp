import { Flex, Text } from "@chakra-ui/react";
import { Button, ShowcaseCircle } from "..";

/**
 * This function will return object containing image and color based on status code
 * @param {number}  status
 * @returns {Object}    object contains label, image & color
 */
const getStatus = (status) => {
	switch (status) {
		case 0:
			return {
				label: "Success",
				color: "success",
				image: "/images/success.png",
			};
		case 1:
			return {
				label: "Failed",
				color: "error",
				image: "/images/failed.png",
			};
		default:
			return {
				label: "Pending",
				color: "highlight",
				image: "/images/pending.png",
			};
	}
};

//TODO change name of comp (stub)
/**
 * A ResponseCard component
 * @param	{Number}	status  status code of the transaction
 * @param 	{object}	details details of the transaction which will be visible in StatusDisplay
 * @param   {string}    onClick  onClick handler when clicking on continue
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ResponseCard></ResponseCard>` TODO: Fix example
 */
const ResponseCard = ({ status, details, message, onClick, ...rest }) => {
	const { color, image } = getStatus(status);

	return (
		<Flex
			direction="column"
			justify="center"
			align="center"
			bg="white"
			borderRadius="10px"
			gap="10"
			py="20"
			{...rest}
		>
			<Flex
				direction="column"
				justify="center"
				align="center"
				gap="8"
				px="4"
			>
				<ShowcaseCircle>
					<img
						src={image}
						alt="store"
						width="160px"
						height="160px"
						loading="lazy"
						style={{ pointerEvents: "none" }}
					/>
				</ShowcaseCircle>
				<Text
					fontSize="3xl"
					fontWeight="bold"
					color={color}
					align="center"
				>
					{`${message}.` ?? "Something went wrong."}
				</Text>
			</Flex>

			{/* <Flex
				direction="column"
				justify="center"
				align="center"
				w={{ base: "100%", md: "500px" }}
				gap="2"
			>
				<Text fontSize="sm" color="light">
					Below are the details:
				</Text>
				<Flex
					direction="column"
					borderTop="4px"
					borderStyle="solid"
					borderColor={color}
					borderRadius="4"
					width="80%"
					height="200px"
					bg="shade"
					boxShadow="basic"
				></Flex>
			</Flex> */}

			<Button onClick={onClick} size="lg">
				Continue
			</Button>
		</Flex>
	);
};

export default ResponseCard;
