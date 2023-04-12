import { Circle, Flex, Text } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import useRequest from "hooks/useRequest";
import { useEffect, useState } from "react";
import { Icon } from "..";

/**
 * A <StatusCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<StatusCard></StatusCard>`
 */
const StatusCard = () => {
	const [disabled, setDisabled] = useState(false);
	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		body: {
			interaction_type_id: 9,
		},
	});

	useEffect(() => {
		mutate();
	}, []);

	const handleWalletClick = () => {
		if (!disabled) {
			setDisabled(true);
			// fetch updated account balance here, call status hook
			setTimeout(() => setDisabled(false), 10000); // enable button after 10 sec
		}
	};

	const handleAddClick = () => {
		console.log("clicked");
	};

	return (
		<Flex
			w="100%"
			h={{ base: "64px", md: "54px", xl: "58px", "2xl": "78px" }}
			px="15px"
			align="center"
			justify="space-between"
			bg="sidebar.card-bg-dark"
			borderBottom="br-sidebar"
		>
			<Flex align="flex-start" gap="2.5">
				<Icon
					name="wallet-outline"
					color={!disabled ? "#556fef" : "hint"}
					cursor={!disabled ? "pointer" : "default"}
					w={{ base: "24px", md: "24px", "2xl": "32px" }}
					h={{ base: "22px", md: "22px", "2xl": "30px" }}
					onClick={handleWalletClick}
				/>
				<Flex direction="column">
					<Text
						textColor="white"
						fontSize={{
							base: "10px",
							md: "8px",
							"2xl": "12px",
						}}
					>
						Wallet Balance
					</Text>
					<Flex color="#FFD93B" align="center" gap="0.25">
						<Icon
							name="rupee"
							w={{ base: "14px", md: "12px", "2xl": "16px" }}
							h={{ base: "14px", md: "12px", "2xl": "16px" }}
						/>
						<Text
							fontSize={{
								base: "14px",
								md: "12px",
								"2xl": "16px",
							}}
							fontWeight="medium"
						>
							{data?.data?.balance}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex>
				<Circle
					size={{ base: "6", "2xl": "8" }}
					bg={"success"}
					color="white"
					boxShadow="0px 3px 6px #00000029"
					border="2px solid #FFFFFF"
					cursor="pointer"
					onClick={handleAddClick}
				>
					<Icon name="add" width={{ base: "12px", "2xl": "16px" }} />
				</Circle>
			</Flex>
		</Flex>
	);
};

export default StatusCard;
