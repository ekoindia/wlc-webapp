import { Box, Button, Flex, Progress, Skeleton, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { fadeSlideInTop12, rotateClockwise } from "libs/chakraKeyframes";
import { useEffect, useRef, useState } from "react";
import { ANIMATION } from "../constants";
import { WalletData } from "../context/types";

interface WalletCardProps {
	walletData: WalletData | null;
	isLoading: boolean;
	hasFetchedWallet: boolean;
	mobile?: string;
	onFetchBalance: () => void;
}

/**
 * Generate two-letter initials from a full name
 * @param name
 */
const getInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Animated count-up number display for wallet balance.
 * Counts from 0 to target over ~1.2 seconds with ease-out cubic.
 * @param root0
 * @param root0.target
 */
const BalanceCountUp = ({ target }: { target: number }): JSX.Element => {
	const [display, setDisplay] = useState(0);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		const start = performance.now();
		const duration = ANIMATION.BALANCE_COUNT_UP_MS;
		const step = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setDisplay(Math.floor(eased * target));
			if (progress < 1) rafRef.current = requestAnimationFrame(step);
		};
		rafRef.current = requestAnimationFrame(step);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [target]);

	return (
		<Text
			fontWeight="normal"
			fontSize={{ base: "3xl", md: "4xl" }}
			color="primary.DEFAULT"
			letterSpacing="tight"
			userSelect="none"
			lineHeight="none"
		>
			₹ {display.toLocaleString("en-IN")}
		</Text>
	);
};

/**
 * Small pill badge for wallet account status
 * @param root0
 * @param root0.status
 */
// const StatusPill = ({ status }: { status: string }): JSX.Element => {
// 	const isActive = status?.toLowerCase() === "active";
// 	return (
// 		<Flex
// 			as="span"
// 			display="inline-flex"
// 			align="center"
// 			gap={1}
// 			bg={isActive ? "green.100" : "red.100"}
// 			color={isActive ? "green.700" : "red.700"}
// 			borderRadius="full"
// 			px={2}
// 			py="2px"
// 		>
// 			<Box
// 				w="6px"
// 				h="6px"
// 				borderRadius="full"
// 				bg={isActive ? "success" : "error"}
// 				flexShrink={0}
// 			/>
// 			<Text fontSize="xxs" fontWeight="semibold" userSelect="none">
// 				{status ?? "Unknown"}
// 			</Text>
// 		</Flex>
// 	);
// };

/**
 * DigiKhata Wallet Card — persistent hero card shown at the top of every screen.
 *
 * Displays: holder name + initials avatar, account status, balance (with count-up
 * animation), monthly limit progress bar, and the Fetch/Refresh Balance button.
 * Shows a skeleton shimmer while loading.
 * @param root0
 * @param root0.walletData
 * @param root0.isLoading
 * @param root0.hasFetchedWallet
 * @param root0.mobile
 * @param root0.onFetchBalance
 */
export const WalletCard = ({
	walletData,
	isLoading,
	hasFetchedWallet,
	mobile,
	onFetchBalance,
}: WalletCardProps): JSX.Element => {
	const buttonLabel = hasFetchedWallet ? "Refresh Balance" : "Fetch Balance";

	const consumed = walletData?.walletToBankLimitConsumed ?? 0;
	const available = walletData?.walletToBankLimitAvailable ?? 0;
	const total = walletData?.totalMonthlyLimit ?? consumed + available;
	const consumedPercent =
		total > 0 ? Math.round((consumed / total) * 100) : 0;

	const initials = walletData?.walletHolderName
		? getInitials(walletData.walletHolderName)
		: "DK";

	const maskedMobile = mobile ? `XXXXXX${mobile.slice(-4)}` : null;

	return (
		<Box
			w="full"
			maxW={{ base: "full", lg: "800px" }}
			bg="white"
			borderRadius="10"
			border="card"
			boxShadow="sh-card"
			overflow="hidden"
			sx={{
				animation: `${fadeSlideInTop12} ${ANIMATION.WALLET_CARD_IN} ${ANIMATION.EASING} both`,
			}}
		>
			{isLoading ? (
				/* ── Skeleton loading state ── */
				<Flex p={5} gap={5} align="flex-start">
					<Skeleton
						w="60px"
						h="60px"
						borderRadius="12"
						flexShrink={0}
					/>
					<Flex flex={1} direction="column" gap={3}>
						<Skeleton h="22px" w="55%" borderRadius="md" />
						<Skeleton h="14px" w="30%" borderRadius="md" />
						<Skeleton h="8px" w="full" borderRadius="full" mt={1} />
						<Flex justify="space-between">
							<Skeleton h="12px" w="30%" borderRadius="md" />
							<Skeleton h="12px" w="30%" borderRadius="md" />
						</Flex>
					</Flex>
					<Flex
						direction="column"
						align="flex-end"
						gap={3}
						w={{ base: "full", md: "190px" }}
						flexShrink={0}
					>
						<Skeleton h="14px" w="130px" borderRadius="md" />
						<Skeleton h="40px" w="110px" borderRadius="md" />
						<Skeleton h="40px" w="160px" borderRadius="md" />
					</Flex>
				</Flex>
			) : (
				/* ── Card content ── */
				<Flex
					p={5}
					gap={{ base: 4, md: 6 }}
					align="stretch"
					direction={{ base: "column", md: "row" }}
				>
					{/* ── Left: Avatar + Name + Limits ── */}
					<Flex flex={1} direction="column" gap={4} minW={0}>
						{/* Avatar row */}
						<Flex gap={4} align="center">
							<Flex
								align="center"
								justify="center"
								w="60px"
								h="60px"
								borderRadius="12"
								bg="rgba(31, 58, 188, 0.08)"
								flexShrink={0}
							>
								<Text
									fontWeight="bold"
									fontSize="lg"
									color="primary.DEFAULT"
									userSelect="none"
								>
									{initials}
								</Text>
							</Flex>

							<Flex direction="column" gap={1.5} minW={0}>
								<Text
									fontWeight="bold"
									fontSize="xl"
									color="dark"
									userSelect="none"
									noOfLines={1}
								>
									{walletData?.walletHolderName ?? "—"}
								</Text>
								<Flex align="center" gap={2} wrap="wrap">
									{/* {walletData?.accountStatus ? (
										<StatusPill
											status={walletData.accountStatus}
										/>
									) : null} */}
									{maskedMobile ? (
										<Text
											fontSize="xs"
											color="light"
											userSelect="none"
										>
											{maskedMobile}
										</Text>
									) : null}
								</Flex>
							</Flex>
						</Flex>

						{/* Monthly limit progress */}
						<Flex direction="column" gap={2}>
							<Flex justify="space-between" align="center">
								<Text
									fontSize="sm"
									fontWeight="semibold"
									color="dark"
									userSelect="none"
								>
									Monthly Transaction Limit
								</Text>
								{total > 0 ? (
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="primary.DEFAULT"
										userSelect="none"
									>
										₹{total.toLocaleString("en-IN")}
									</Text>
								) : null}
							</Flex>

							<Progress
								value={consumedPercent}
								h="8px"
								borderRadius="full"
								colorScheme="blue"
								bg="darkShade"
							/>

							<Flex justify="space-between">
								<Text
									fontSize="xs"
									color="light"
									userSelect="none"
								>
									Consumed:{" "}
									<Text
										as="span"
										color="dark"
										fontWeight="medium"
									>
										₹{consumed.toLocaleString("en-IN")}
									</Text>
									{consumedPercent > 0 && (
										<Text
											as="span"
											color="light"
											fontSize="xxs"
											ml={1}
										>
											({consumedPercent}%)
										</Text>
									)}
								</Text>
								<Text
									fontSize="xs"
									color="light"
									userSelect="none"
								>
									Available:{" "}
									<Text
										as="span"
										color="dark"
										fontWeight="medium"
									>
										₹{available.toLocaleString("en-IN")}
									</Text>
								</Text>
							</Flex>
						</Flex>
					</Flex>

					{/* Vertical divider — md+ only */}
					<Box
						display={{ base: "none", md: "block" }}
						w="1px"
						bg="divider"
						alignSelf="stretch"
					/>

					{/* ── Right: Balance + Button ── */}
					<Flex
						direction="column"
						align={{ base: "flex-start", md: "flex-end" }}
						justify="space-between"
						gap={3}
						w={{ base: "full", md: "190px" }}
						flexShrink={0}
					>
						<Flex
							direction="column"
							gap={1}
							align={{ base: "flex-start", md: "flex-end" }}
						>
							<Text
								fontSize="xxs"
								fontWeight="semibold"
								color="light"
								textTransform="uppercase"
								letterSpacing="widest"
								userSelect="none"
							>
								Total Wallet Balance
							</Text>

							{walletData ? (
								<BalanceCountUp
									target={walletData.walletCurrentBalance}
								/>
							) : (
								<Text
									fontWeight="bold"
									fontSize={{ base: "3xl", md: "4xl" }}
									color="primary.DEFAULT"
									letterSpacing="tight"
									userSelect="none"
									lineHeight="none"
								>
									₹ —
								</Text>
							)}

							{walletData?.lastUpdatedAt ? (
								<Text
									fontSize="xxs"
									color="hint"
									userSelect="none"
								>
									Updated{" "}
									{new Date(
										walletData.lastUpdatedAt
									).toLocaleTimeString("en-IN", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
							) : null}
						</Flex>

						<Button
							w="full"
							bg="primary.DEFAULT"
							color="white"
							borderRadius="10"
							size="md"
							onClick={onFetchBalance}
							isDisabled={isLoading}
							_hover={{ bg: "primary.dark" }}
							_active={{ transform: "scale(0.98)" }}
						>
							<Flex align="center" gap={2}>
								<Icon
									name="refresh"
									color="white"
									size="14px"
									style={
										isLoading
											? {
													animation: `${rotateClockwise} 0.8s linear infinite`,
												}
											: undefined
									}
								/>
								<Text userSelect="none">{buttonLabel}</Text>
							</Flex>
						</Button>
					</Flex>
				</Flex>
			)}
		</Box>
	);
};
