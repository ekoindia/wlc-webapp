import { Box, Fade, Flex, Text, VStack } from "@chakra-ui/react";
import { Icon, OrgLogo } from "components";
import { useOrgDetailContext } from "contexts";
import Link from "next/link";
import packageJson from "../../package.json";

interface AboutTabProps {
	/**
	 * Callback to navigate to different views
	 */
	onNavigate: (_view: "troubleshoot") => void;
}

/**
 * About tab displaying app logo, name, version, and menu items
 * @param {AboutTabProps} props - Component props
 * @returns {JSX.Element} AboutTab component
 */
const AboutTab = ({ onNavigate }: AboutTabProps): JSX.Element => {
	const { orgDetail } = useOrgDetailContext();

	return (
		<Fade in>
			<Box
				minW="400px"
				bg="white"
				color="dark"
				p={{ base: "6", md: "8" }}
				borderRadius="10"
				textAlign="center"
			>
				<VStack spacing={{ base: "4", md: "6" }}>
					{/* App Logo */}
					<OrgLogo size="lg" onlyImageLogo={true} />

					{/* App Name */}
					{orgDetail?.app_name && (
						<Text
							fontSize={{ base: "xl", md: "2xl" }}
							fontWeight="bold"
							lineHeight="shorter"
						>
							{orgDetail.app_name}
						</Text>
					)}

					{/* Organization Name */}
					{orgDetail?.org_name && (
						<Text
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="normal"
							opacity="0.9"
						>
							{orgDetail.org_name}
						</Text>
					)}

					{/* App Version */}
					<Box bg="primary.light" px="3" py="1" borderRadius="full">
						<Text fontSize="xs" fontWeight="medium" color="white">
							{packageJson.version}
						</Text>
					</Box>
				</VStack>

				{/* Menu Items */}
				<VStack
					spacing="0"
					mt="6"
					w="full"
					border="1px solid #CCC"
					// borderColor="divider"
					borderRadius="lg"
					overflow="hidden"
					boxShadow="sm"
					fontSize={{ base: "md", md: "md" }}
					color="dark"
				>
					{/* Privacy Policy */}
					<Link
						href="/privacy"
						prefetch={false}
						style={{ width: "100%" }}
					>
						<Flex
							align="center"
							justify="space-between"
							p="4"
							bg="white"
							cursor="pointer"
							_hover={{ bg: "gray.50" }}
							borderBottom="1px solid #CCC"
						>
							<Text>Privacy Policy</Text>
							<Icon name="open-in-new" size="sm" color="light" />
						</Flex>
					</Link>

					{/* Report an Issue */}
					{/* <Link
						href="/raise-issue"
						prefetch={false}
						style={{ width: "100%" }}
					>
						<Flex
							align="center"
							justify="space-between"
							p="4"
							bg="white"
							cursor="pointer"
							_hover={{ bg: "gray.50" }}
							borderBottom="1px solid #CCC"
						>
							<Text
								fontSize={{ base: "md", md: "lg" }}
								color="dark"
							>
								Report an Issue
							</Text>
							<Icon name="chevron-right" size="sm" color="light" />
						</Flex>
					</Link> */}

					{/* Troubleshoot */}
					<Flex
						w="100%"
						align="center"
						justify="space-between"
						p="4"
						bg="white"
						cursor="pointer"
						_hover={{ bg: "gray.50" }}
						onClick={() => onNavigate("troubleshoot")}
					>
						<Text>Troubleshoot</Text>
						<Icon name="chevron-right" size="sm" color="light" />
					</Flex>
				</VStack>
			</Box>
		</Fade>
	);
};

export default AboutTab;
