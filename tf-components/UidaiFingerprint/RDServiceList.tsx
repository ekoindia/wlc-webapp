/**
 * @file RDServiceList — Selectable list of discovered biometric device drivers.
 */
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import { memo } from "react";
import { getBiometricIcon, getRdStatusIcon } from "./utils/biometricIcons";
import type { RDServiceInfo } from "./utils/rdServiceHelpers";

interface RDServiceListProps {
	rdServiceList: RDServiceInfo[];
	selectedIndex: number;
	onSelect: (_index: number) => void;
}

const RDServiceList = ({
	rdServiceList,
	selectedIndex,
	onSelect,
}: RDServiceListProps): JSX.Element | null => {
	if (rdServiceList.length === 0) return null;

	return (
		<VStack align="stretch" spacing={0} w="100%">
			{rdServiceList.map((rd, idx) => {
				const isFirst = idx === 0;
				const isLast = idx === rdServiceList.length - 1;
				const isSelected = idx === selectedIndex;

				return (
					<HStack
						key={`${rd.info}-${rd.type}-${idx}`}
						position="relative"
						align="center"
						minH="44px"
						py="6px"
						spacing={0}
						fontSize="0.8em"
						fontWeight={400}
						cursor={rd.ready ? "pointer" : "not-allowed"}
						opacity={rd.ready ? 1 : 0.8}
						onClick={() => {
							if (rd.ready) onSelect(idx);
						}}
					>
						{/* Continuous vertical connector line */}
						<Box
							position="absolute"
							left="29px"
							top={isFirst ? "50%" : 0}
							bottom={isLast ? "50%" : 0}
							w="2px"
							bg="primary.DEFAULT"
							zIndex={0}
						/>

						{/* Circle indicator — 60px column centres circle at x=30 */}
						<Box
							position="relative"
							zIndex={1}
							w="60px"
							flexShrink={0}
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							<Box
								boxSize="22px"
								borderRadius="50%"
								border="4px solid"
								borderColor="primary.DEFAULT"
								bg="white"
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								{isSelected ? (
									<Box
										boxSize="10px"
										borderRadius="50%"
										bg="primary.DEFAULT"
									/>
								) : null}
							</Box>
						</Box>

						{/* Device type icon */}
						<Icon name={getBiometricIcon(rd.type)} size="sm" />

						{/* Info text + status */}
						<HStack
							align="center"
							flexWrap="wrap"
							flex={1}
							spacing={1}
							ml={2}
						>
							<Text>{rd.info}</Text>

							{rd.android_package ? (
								<Text
									fontSize="0.7em"
									fontFamily="monospace"
									color="gray.500"
								>
									{rd.android_package}
								</Text>
							) : null}

							{/* Status icon */}
							<Icon
								name={getRdStatusIcon(rd.ready)}
								size="sm"
								color={rd.ready ? "success" : "error"}
							/>

							{/* Non-ready status text */}
							{!rd.ready ? (
								<Text
									fontSize="0.7em"
									fontWeight={700}
									color="error"
								>
									{rd.status}
								</Text>
							) : null}
						</HStack>
					</HStack>
				);
			})}
		</VStack>
	);
};

export default memo(RDServiceList);
