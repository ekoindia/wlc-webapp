import { Divider, Flex, Text } from "@chakra-ui/react";
import { Button, Card } from "components";
import { useSession } from "contexts";
import UpdateBankDetailsModal from "page-components/Admin/Network/NetworkMenu/UpdateBankDetailsModalContent";
import { useState } from "react";

const maskAccount = (acc = "") => {
	if (!acc) return "—";
	if (acc.length <= 4) return acc;
	return `${acc.slice(0, 2)}******${acc.slice(-2)}`;
};

const hasValue = (value) =>
	value !== undefined && value !== null && value !== "" && value !== "—";

const BankPane = ({ data = {}, eko_code, mobile, onUpdate }) => {
	const { isAdmin, accessToken } = useSession();
	const [isOpen, setOpen] = useState(false);
	const { bank_name, account, ifsc } = data || {};

	return (
		<Card h="auto">
			<Flex
				direction="column"
				gap={{ base: "6", lg: "8" }}
				fontSize="sm"
				h="100%"
			>
				<Flex direction="column" gap="3">
					<Text as="b" color="light">
						Bank Details
					</Text>
					{hasValue(bank_name) ? (
						<Flex direction="column" color="light">
							<Text fontSize="xs" color="gray.400">
								Bank
							</Text>
							<Text fontWeight="medium" color="dark">
								{bank_name}
							</Text>
						</Flex>
					) : null}
					{hasValue(account) ? (
						<>
							{hasValue(bank_name) ? <Divider /> : null}
							<Flex direction="column" color="light">
								<Text fontSize="xs" color="gray.400">
									Account Number
								</Text>
								<Text fontWeight="medium" color="dark">
									{maskAccount(account)}
								</Text>
							</Flex>
						</>
					) : null}
					{hasValue(ifsc) ? (
						<>
							{hasValue(bank_name) || hasValue(account) ? (
								<Divider />
							) : null}
							<Flex direction="column" color="light">
								<Text fontSize="xs" color="gray.400">
									IFSC
								</Text>
								<Text fontWeight="medium" color="dark">
									{ifsc}
								</Text>
							</Flex>
						</>
					) : null}
				</Flex>
				<Flex direction="column" align="center">
					{/* Show update button for admins or when viewing own profile (mobile matches) */}
					{isAdmin || !mobile ? (
						<Button
							onClick={() => setOpen(true)}
							w={{ base: "100%", lg: "240px" }}
							h="60px"
						>
							Update Bank Details
						</Button>
					) : (
						<Button
							onClick={() => setOpen(true)}
							w={{ base: "100%", lg: "240px" }}
							h="60px"
						>
							Raise Update Request
						</Button>
					)}
				</Flex>

				<UpdateBankDetailsModal
					isOpen={isOpen}
					onClose={() => setOpen(false)}
					eko_code={eko_code}
					agentMobile={mobile}
					accessToken={accessToken}
					onUpdateBankDetails={(_code, _bankData) => {
						onUpdate?.();
						setOpen(false);
					}}
				/>
			</Flex>
		</Card>
	);
};

export { BankPane };

export default BankPane;
