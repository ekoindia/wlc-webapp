import {
	Flex,
	Box,
	Switch,
	Text,
	Grid,
	useToast,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	UnorderedList,
	ListItem,
} from "@chakra-ui/react";
import { Button } from "components";
import { createSupportTicket } from "helpers";
// import useHslColor from "hooks/useHslColor";
import { useMenuContext, useSession, useOrgDetailContext } from "contexts";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { ProductRoleConfiguration } from "constants";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const TAT = "1";

/**
 * Disable services for the Admin's whole network by raising a ticket for the support team.
 */
const ToggleServices = () => {
	const { accessToken, isAdmin } = useSession();
	const { interactions } = useMenuContext();
	const { orgDetail } = useOrgDetailContext();
	const toast = useToast();
	const router = useRouter();
	const cancelRef = useRef();

	const [busy, setBusy] = useState(false);
	const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);

	// const [services, setServices] = useState([]);
	// const [value, setValue] = useState();
	const [feedbackTicket, setFeedbackTicket] = useState("");

	const [trxnServices, setTrxnServices] = useState([]);
	const [evalueServices, setEvalueServices] = useState([]);

	const [modifiedCount, setModifiedCount] = useState(0);
	const [enableLabelList, setEnableLabelList] = useState([]);
	const [disableLabelList, setDisableLabelList] = useState([]);
	const [toggleTaskMessage, setToggleTaskMessage] = useState("");
	const [toggleSummary, setToggleSummary] = useState("");

	/**
	 * Helper function to Reset/Initialize the list of enabled/disabled services based on the user's role.
	 */
	const initializeServiceLists = () => {
		// Filter ProductRoleConfiguration to get available products based on roles
		const { role_tx_list } = interactions;

		// Filter all available left-menu transactions
		setTrxnServices(
			getServiceList(ProductRoleConfiguration.products, role_tx_list)
		);

		// Filter all available evalue transactions
		setEvalueServices(
			getServiceList(ProductRoleConfiguration.evalue, role_tx_list)
		);
	};

	/**
	 * First-time initialization of the service lists.
	 */
	useEffect(() => {
		if (trxnServices?.length || evalueServices?.length) return;
		initializeServiceLists();
	}, [interactions]);

	/**
	 * Process modified services.
	 * Generate count of all modified services and prepare a summary message to display.
	 * Also prepare a message to raise ticket for the backend team, specifying exactly which
	 * services (and their roles) to enable/disable.
	 */
	useEffect(() => {
		let _enabled = 0;
		let _disabled = 0;
		let enableServices = [];
		let disableServices = [];
		let enableLabels = [];
		let disableLabels = [];
		let _msg = "";

		[...trxnServices, ...evalueServices].forEach((service) => {
			if (service.available !== service.selected) {
				console.log("Service: ", service);

				if (service.selected) {
					_enabled++;
					enableServices.push(
						`${service.label} (Role: ${service.value})`
					);
					enableLabels.push(service.label);
				} else {
					_disabled++;
					disableServices.push(`${service.label} (${service.value})`);
					disableLabels.push(service.label);
				}
			}
		});
		setModifiedCount(_enabled + _disabled);
		setEnableLabelList(enableLabels);
		setDisableLabelList(disableLabels);

		if (enableServices.length) {
			_msg += `\n\nSERVICES TO ENABLE: ${enableServices.join(", ")}`;
		}
		if (disableServices.length) {
			_msg += `\n\nSERVICES TO DISABLE: ${disableServices.join(", ")}`;
		}
		setToggleTaskMessage(_msg);
		setToggleSummary(
			[
				_enabled ? `Enabling ${_enabled} service(s)` : null,
				_disabled ? `Disabling ${_disabled} service(s)` : null,
			]
				.filter(Boolean)
				.join(", ")
		);
	}, [trxnServices, evalueServices]);

	/**
	 * Function to raise a ticket to disable the selected service for the whole network.
	 */
	const raiseTicket = () => {
		if (!modifiedCount) return;
		if (!isAdmin) return;
		if (busy) return;

		const context = `Eloka Admin has requested to enable/disable these product roles for their org. Add/remove these roles for the whole org (and, not just current users).\n\nEloka Org-ID: ${orgDetail.org_id},\n\nOrg-Name: ${orgDetail.org_name},\n\nApp-Name: ${orgDetail.app_name}`;

		setBusy(true);

		createSupportTicket({
			accessToken,
			summary: "Enable/Disable services for my organisation network",
			category: "Role Configuration",
			subCategory: "Eloka Role Configuration",
			feedback_origin: "Other",
			tat: TAT,
			comment: `Enable/disable services for all users in my org:${toggleTaskMessage}`,
			context: context,
		})
			.then((response) => {
				if (response.status == 0) {
					setFeedbackTicket(response?.data?.feedback_ticket_id || "");
					// TODO: remove the current product from the list of services
				} else {
					toast({
						title: "Failed to create support ticket.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				}
			})
			.catch((error) => {
				console.error("Error creating support ticket", error);
			})
			.finally(() => {
				setBusy(false);
			});
	};

	// MARK: Render Result
	if (feedbackTicket) {
		return (
			<Flex direction="column" gap="2em">
				<Flex direction="column" gap="1em">
					<Text>
						Ticket raised successfully to update the service(s) for
						your network.
					</Text>
					<Text>
						Our support team will get back to you shortly with
						further details. Expected resolution time is {TAT}{" "}
						day(s).
					</Text>
					<Flex direction="row" gap="0.4em">
						<Text fontWeight="700">Ticket ID:</Text>
						<Text>{feedbackTicket}</Text>
					</Flex>
					<Box pt="0.4em">
						<Button
							size={{ base: "sm", md: "md" }}
							variant="outline"
							onClick={() => {
								router.push("/admin/query");
							}}
						>
							Check Ticket Status
						</Button>
					</Box>
				</Flex>

				{/* <Button
					onClick={() => {
						setFeedbackTicket("");
						setValue(null);
					}}
				>
					Disable Another Service
				</Button> */}
			</Flex>
		);
	}

	// MARK: Render Form
	return (
		<Flex direction="column" gap="2em">
			<Flex
				direction={{ base: "column", md: "row" }}
				align={{ base: "flex-start", md: "center" }}
				gap={2}
				border="2px dashed #E2E8F0"
				borderRadius={8}
				p={{ base: 2, md: 3 }}
				// h={modifiedCount ? "calc(auto)" : "0px"}
				// opacity={modifiedCount ? 1 : 0}
				// transition="all 0.8s ease-out"
				// display={modifiedCount ? undefined : "none"}
			>
				<Text flex={1} fontSize="sm">
					{modifiedCount
						? toggleSummary
						: "Toggle the services below to hide or show them for your entire network."}
				</Text>
				<Flex
					direction="row"
					gap={3}
					w={{ base: "100%", sm: "auto" }}
					justify={{ base: "space-between", sm: "flex-start" }}
				>
					<Button
						size={{ base: "sm", md: "md" }}
						variant="outline"
						disabled={modifiedCount === 0 || busy}
						onClick={initializeServiceLists}
					>
						Reset
					</Button>
					<Button
						size={{ base: "sm", md: "md" }}
						disabled={modifiedCount === 0 || busy}
						loading={busy}
						onClick={() => setIsApplyAlertOpen(true)}
					>
						Apply Changes
					</Button>

					<ApplyChangesAlert
						isOpen={isApplyAlertOpen}
						onApply={() => {
							raiseTicket();
							setIsApplyAlertOpen(false);
						}}
						onClose={() => setIsApplyAlertOpen(false)}
						enableLabelList={enableLabelList}
						disableLabelList={disableLabelList}
						cancelRef={cancelRef}
					/>
				</Flex>
			</Flex>

			{trxnServices?.length > 0 ? (
				<Flex w="full" direction="column" gap="10px">
					<Text fontSize="lg" fontWeight="bold">
						Transactions
					</Text>
					<ProductGrid
						product_list={trxnServices}
						onToggleProduct={(product) => {
							console.log("Product Toggled: ", product);
							// Update trxnServices array for the selected product
							setTrxnServices((prev) => {
								const _services = prev.map((service) => {
									if (service.id === product.id) {
										return {
											...service,
											selected: !service.selected,
										};
									}
									return service;
								});
								return _services;
							});
						}}
					/>
				</Flex>
			) : null}

			{evalueServices?.length > 0 ? (
				<Flex w="full" direction="column" gap="10px">
					<Text fontSize="lg" fontWeight="bold">
						E-value
					</Text>
					<ProductGrid product_list={evalueServices} />
				</Flex>
			) : null}
		</Flex>
	);
};

/**
 * Grid component to display the list of products for toggling.
 * MARK: ProductGrid
 * @param {object} props
 * @param {Array} props.product_list List of product-slugs to display
 * @param {Function} props.onToggleProduct Function to handle the click on a product card to toggle its selection
 * @returns {Component} Grid
 */
const ProductGrid = ({ product_list, onToggleProduct }) => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fill,minmax(250px,1fr))",
				// md: "repeat(auto-fill,minmax(300px,1fr))",
			}}
			justifyContent="center"
			// py={{ base: "4", md: "0px" }}
			gap={{
				base: 2,
				md: 4,
			}}
		>
			{product_list?.map((product) => {
				const { id, label, desc, value, available, selected } = product;

				if (!(id && label && value)) return null;

				return (
					<Card
						key={id}
						label={label}
						desc={desc}
						selected={selected}
						modified={available !== selected}
						onToggle={() =>
							onToggleProduct && onToggleProduct(product)
						}
					/>
				);
			})}
		</Grid>
	);
};

/**
 * Product Card Component.
 * MARK: Card
 * @param {object} props
 * @param {string} props.label Label for the card
 * @param {string} props.desc Description for the card
 * @param {boolean} props.selected Flag to identify if the product is selected
 * @param {boolean} props.modified Flag to identify if the product-selection is modified by the user
 * @param {Function} props.onToggle Function to handle the click
 * @returns {Component} Card
 */
const Card = ({ label, desc, selected, modified, onToggle }) => {
	// const { h } = useHslColor(label);

	return (
		<Flex
			w="100%"
			bg="white"
			p={{ base: "3", md: "3 4" }}
			borderRadius="6"
			border="1px solid #E2E8F0"
			align="center"
			gap="4"
			transition="background 0.3s ease-out"
			_hover={{
				bg: "gray.50",
				cursor: "pointer",
			}}
			shadow={modified ? "md" : "none"}
			onClick={() => onToggle && onToggle()}
		>
			{/* <Flex
					align="center"
					justify="center"
					w="22px"
					h="22px"
					border="2px solid"
					borderColor={selected ? "primary.DEFAULT" : "error"}
					borderRadius="full"
					bg={selected ? "primary.DEFAULT" : "transparent"}
				>
					{selected ? (
						<Icon size="14px" name="check" color="white" />
					) : null}
				</Flex> */}
			<Switch
				size={{ base: "sm", md: "md" }}
				colorScheme="teal"
				isChecked={selected}
				pointerEvents="none"
			/>

			<Flex direction="column" flex={1} gap="1">
				{label?.length > 0 ? (
					<Text
						fontSize="0.9em"
						fontWeight="medium"
						userSelect="none"
						color={modified ? "primary.DEFAULT" : "inherit"}
					>
						{label}
					</Text>
				) : null}
				{desc?.length > 0 ? (
					<Text fontSize="xxs" userSelect="none" noOfLines={3}>
						{desc}
					</Text>
				) : null}
			</Flex>
		</Flex>
	);
};

/**
 * Alert Dialog to confirm the changes before applying.
 * MARK: Alert
 * @param {object} props
 * @param {boolean} props.isOpen Flag to identify if the alert is open
 * @param {Function} props.onApply Function to handle the Apply button click
 * @param {Function} props.onClose Function to handle the Close button click
 * @param {Array} props.enableLabelList List of services to be enabled
 * @param {Array} props.disableLabelList List of services to be disabled
 * @param {Ref} props.cancelRef Ref to the cancel button (least-destructive option)
 * @returns {Component} AlertDialog
 */
const ApplyChangesAlert = ({
	isOpen,
	onApply,
	onClose,
	enableLabelList,
	disableLabelList,
	cancelRef,
}) => {
	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Are You Sure?
					</AlertDialogHeader>

					<AlertDialogBody>
						<Flex direction="column" gap={4}>
							{enableLabelList?.length ? (
								<Flex direction="column">
									<Flex
										fontSize="sm"
										fontWeight="bold"
										direction="row"
										align="center"
										gap="5px"
										color="success"
									>
										<FaCheckCircle size="18px" />
										{enableLabelList.length} service(s) to
										be enabled:
									</Flex>
									<Text pl="23px">
										{enableLabelList.join(", ")}
									</Text>
								</Flex>
							) : null}
							{disableLabelList?.length ? (
								<Flex direction="column">
									<Flex
										fontSize="sm"
										fontWeight="bold"
										direction="row"
										align="center"
										gap="5px"
										color="error"
									>
										<FaTimesCircle size="18px" />
										{disableLabelList?.length} service(s) to
										be disabled:
									</Flex>
									<Text pl="23px">
										{disableLabelList.join(", ")}
									</Text>
								</Flex>
							) : null}
							<Flex direction="column" gap="0.4em" fontSize="sm">
								<Text fontWeight="bold">Note:</Text>
								<Box>
									<UnorderedList pl="10px">
										<ListItem>
											The changes will be applied to all
											existing and new users in your
											network!
										</ListItem>
										<ListItem>
											It will take {TAT} day(s) to process
											the changes.
										</ListItem>
									</UnorderedList>
								</Box>
							</Flex>
						</Flex>
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							variant="outline"
							ref={cancelRef}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button onClick={onApply} ml={3}>
							Confirm
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

/**
 * Function to generate a list of services with current status (whether enabled or not) based on the current role of teh user
 * MARK: getServiceList
 * @param {Array} products List of all available products
 * @param {object} role_tx_list List of all available transactions based on the user's role
 * @returns {Array} List of services with their current status
 */
const getServiceList = (products, role_tx_list) => {
	const _serviceList = [];
	products.forEach((product) => {
		if (!product.roles) return;
		if (product.roles.length && product.trxn_id) {
			const available = product.trxn_id in role_tx_list;
			_serviceList.push({
				id: product.trxn_id,
				label: product.label,
				value: product.roles.join(","),
				desc: product.comment,
				available: available,
				selected: available,
			});
		}
	});
	return _serviceList;
};

export { ToggleServices };
