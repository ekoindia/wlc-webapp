import { Flex, Image, Text } from "@chakra-ui/react";
import { Button } from "..";

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
				image: "/images/Success2x.png",
			};
		case 1:
			return {
				label: "Failed",
				color: "error",
				image: "/images/Failed2x.png",
			};
		default:
			return {
				label: "Pending",
				color: "highlight",
				image: "/images/Pending2x.png",
			};
	}
};

//TODO change name of comp (stub)
/**
 * A StatusDisplay component to display status of transaction.
 * @param	{Number}	status  status code of the transaction
 * @param 	{object}	details details of the transaction which will be visible in StatusDisplay
 * @param   {string}    redirect    redirect link to redirect user on back or continue click
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<StatusDisplay></StatusDisplay>` TODO: Fix example
 */
const StatusDisplay = ({ status = 0, details, message, redirect, ...rest }) => {
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
				gap="2"
				w={{ base: "100%", md: "500px" }}
			>
				<Image src={image} w="40%" alt={message} />
				<Text
					fontSize="3xl"
					fontWeight="bold"
					color={color}
					align="center"
				>
					{message}
				</Text>
				{/* <Flex
					direction="column"
					justify="center"
					align="center"
					w="100%"
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
			</Flex>
			<Button onClick={redirect} size="lg">
				Continue
			</Button>
		</Flex>
	);
};

export default StatusDisplay;
