import { DownloadIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Badge,
	Box,
	Divider,
	Flex,
	HStack,
	IconButton,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Card, Icon } from "components";
import { formatDateTime } from "libs/dateFormat";
import type { ApiBatch } from "./BatchHistory";

interface HistoryCardProps {
	batch: ApiBatch;
	statusProps: { colorScheme: string; label: string; icon: string };
	isProcessing: boolean;
	processedCount: number;
	canDownload: boolean;
	onDownload: (_batchNumber: string) => void;
}

const StatItem = ({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color?: string;
}): JSX.Element => (
	<Box>
		<Text fontSize="xs" color="light">
			{label}
		</Text>
		<Text fontSize="sm" fontWeight="semibold" color={color ?? "dark"}>
			{value}
		</Text>
	</Box>
);

const HistoryCard = ({
	batch,
	statusProps,
	isProcessing,
	processedCount,
	canDownload,
	onDownload,
}: HistoryCardProps): JSX.Element => {
	return (
		<Card w="100%" gap="4">
			<Flex justify="space-between" align="flex-start" gap="3">
				<HStack align="center" gap="3">
					<Avatar
						name={batch.customerName}
						size="md"
						bg="primary.light"
						color="white"
						fontSize="sm"
					/>
					<Box>
						<Text
							fontWeight="semibold"
							fontSize={{ base: "sm", md: "md" }}
							color="dark"
						>
							{batch.customerName}
						</Text>
						<Text fontSize="xs" color="light">
							{formatDateTime(batch.batchUploadDate)}
						</Text>
					</Box>
				</HStack>
				<Stack direction="row" spacing="3" align="center">
					<Badge
						colorScheme={statusProps.colorScheme}
						justifyContent="center"
						fontSize="xs"
						px="2"
						py="1"
						borderRadius="full"
						whiteSpace="nowrap"
						display="inline-flex"
						alignItems="center"
						gap="1"
					>
						<Box
							as="span"
							display="inline-flex"
							alignItems="center"
						>
							<Icon name={statusProps.icon} size="xs" />
						</Box>
						<Text as="span">{statusProps.label}</Text>
						{isProcessing && (
							<Text as="span" ml="1" fontWeight="semibold">
								{processedCount.toString().padStart(2, "0")}|
								{batch.totalRecords.toString().padStart(2, "0")}
							</Text>
						)}
					</Badge>
					{isProcessing ? (
						<Spinner size="sm" color="blue.500" thickness="2px" />
					) : canDownload ? (
						<IconButton
							aria-label="Download Report"
							icon={<DownloadIcon />}
							size="sm"
							variant="ghost"
							onClick={() => onDownload(batch.batchNumber)}
							title="Download Report"
						/>
					) : (
						<Text fontSize="xs" color="light">
							-
						</Text>
					)}
				</Stack>
			</Flex>
			<Divider />
			<SimpleGrid columns={2} spacingY="3" spacingX="8">
				<StatItem
					label="Records"
					value={batch.totalRecords.toString()}
				/>
				<StatItem
					label="Amount"
					value={`₹${batch.totalAmount.toLocaleString("en-IN")}`}
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 3, sm: 5 }} spacingY="3" spacingX="6">
				<StatItem
					label="Approved"
					value={batch.totalRecordsApproved.toString()}
					color="green.600"
				/>
				<StatItem
					label="Invalid"
					value={batch.invalidRecords.toString()}
					color="red.600"
				/>
				<StatItem
					label="Successful"
					value={batch.successCount.toString()}
					color="green.600"
				/>
				<StatItem
					label="Pending"
					value={batch.pendingCount.toString()}
					color="yellow.600"
				/>
				<StatItem
					label="Failed"
					value={batch.failureCount.toString()}
					color="red.600"
				/>
			</SimpleGrid>
		</Card>
	);
};

export default HistoryCard;
