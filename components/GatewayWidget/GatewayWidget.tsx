import { EkoConnectWidget } from "components/EkoConnectWidget";
import { useOrgDetailContext, useUser } from "contexts";
import { Flex, Box } from "@chakra-ui/react";
import { OrgLogo } from "components";
import { useEffect, useState } from "react";
import { loginUsingRefreshTokenAndroid } from "helpers/loginHelper";
import { useFeatureFlag } from "hooks";

// Map available products for Gateway
const GatewayProducts: Record<string, number> = {
	aeps: 252,
};

// Props types
interface GatewayWidgetProps {
	id: Array<string>;
	token: string;
}

/**
 * <GatewayWidget> component to show the simplified Gateway redirection page
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {Array} prop.id - The name of the product to open in the Gateway
 * @param {string} prop.token - The SSO token for the user to login automatically in the gateway
 */
const GatewayWidget = ({ id, token }: GatewayWidgetProps) => {
	const { orgDetail } = useOrgDetailContext();

	// Check if the Eloka Gateway is enabled
	const [isGatewayAllowed] = useFeatureFlag("ELOKA_GATEWAY");

	if (!isGatewayAllowed) {
		return null;
	}

	if (!(id && id.length > 0)) {
		return null;
	}

	const product = id[0];

	if (!(product in GatewayProducts)) {
		return null;
	}

	// Starting transaction-type-id
	const start_id = GatewayProducts[product];

	// MARK: JSX
	return (
		<Flex direction="column" minH="100vh">
			<Flex px="1em" align="center" h="56px" shadow="lg">
				<OrgLogo
					size="md"
					// align="center"
					dark={orgDetail?.metadata?.theme?.navstyle === "light"}
					// minW={{ base: "auto", md: "250px" }}
				/>
			</Flex>
			<Flex bg="bg" flex="1">
				<Box
					maxW={{ base: "100%", md: "800px" }}
					w="full"
					mx="auto"
					pt={6}
				>
					<TransactionWidget
						start_id={start_id}
						paths={id}
						token={token}
					/>
				</Box>
			</Flex>
		</Flex>
	);
};

/**
 * Component to show the Transaction Widgets
 * @component
 * @param {object} props - The properties of the component
 * @param {string|number} props.start_id - The starting transaction-type-id
 * @param {Array} props.paths - The paths to the transaction
 * @param {string} props.token - The SSO token for the user to login automatically in the gateway
 * @returns {JSX.Element}
 */
const TransactionWidget = ({ start_id, paths, token }) => {
	const { /* accessToken, userData, */ isLoggedIn, updateUserInfo, login } =
		useUser();
	const [isLoggingIn /*, setIsLoggingIn */] = useState(false);
	const [invalidUser, setInvalidUser] = useState(false);

	// Use token to login the user, if not already logged in, or login is not already in progress
	useEffect(() => {
		if (isLoggedIn || isLoggingIn || invalidUser) {
			return;
		}

		if (!token) {
			setInvalidUser(true);
			return;
		}

		// Try to login using the token
		loginUsingRefreshTokenAndroid(
			token,
			updateUserInfo,
			login,
			null,
			false
		);
	}, [token, isLoggedIn, isLoggingIn, invalidUser]);

	if (!isLoggedIn) {
		return <div>Not logged in. Token = {token}</div>;
	}

	return (
		<Flex>
			<EkoConnectWidget start_id={start_id} paths={[paths]} />
		</Flex>
	);
};

export default GatewayWidget;
