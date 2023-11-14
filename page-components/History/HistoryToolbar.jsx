import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Menus, Modal, SearchBar } from "components";
import { Form } from "tf-components";

/**
 * A HistoryToolbar page-component
 * @example	`<HistoryToolbar></HistoryToolbar>` TODO: Fix example
 */
const HistoryToolbar = ({
	// activePillIndex,
	// pillsData,
	// handlePillClick,
	form_parameter_list,
	formValues,
	register,
	control,
	errors,
	// isSubmitting,
	searchValue,
	onSearchSubmit,
	clear,
	// handleChange,
	// formState,
	isOpen,
	onOpen,
	onClose,
	onFilterSubmit,
	onFilterClear,
	onReportDownload,
}) => {
	// const labelStyle = {
	// 	fontSize: { base: "sm" },
	// 	// color: "inputlabel",
	// };

	const menuList = [
		{
			id: 1,
			value: "xlsx",
			label: "Download Report(Excel)",
			onClick: (value) => {
				onReportDownload(value);
			},
		},
		{
			id: 2,
			value: "pdf",
			label: "Download Report(Pdf)",
			onClick: (value) => {
				onReportDownload(value);
			},
		},
	];

	return (
		<Flex
			justifyContent={"space-between"}
			direction={{ base: "column-reverse", lg: "row" }}
			alignItems={{ base: "none", lg: "center" }}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			{/* <===========================Toggles Button ===============================> */}
			{/* <Flex gap="8px" overflowX="auto" mt={{ base: "40px", lg: "0px" }}>
                            {pillsData.map((pill, index) => (
                                <Box key={index} onClick={() => handlePillClick(index)}>
                                    <Pill
                                        name={pill.name}
                                        activePillIndex={activePillIndex}
                                        index={index}
                                    />
                                </Box>
                            ))}
                        </Flex> */}
			<Flex w="100%" gap="2" justify="flex-end" align="center">
				{/* <==========Clear Filter Button =========> */}
				{clear && (
					<Button
						size="xs"
						variant="link"
						onClick={onFilterClear}
						_hover={{ TextDecoration: "none" }}
					>
						Clear Filter
					</Button>
				)}

				{/* <==========Search =========> */}
				<SearchBar
					type="number"
					placeholder="Search by TID, Mobile, Account, etc"
					value={searchValue}
					setSearch={onSearchSubmit}
					minSearchLimit={2}
				/>

				{/* <==========Filter Button =========> */}
				<Button size="lg" onClick={onOpen}>
					<Icon name="filter" width="18px" />
					&nbsp;
					<Text display={{ base: "none", md: "flex" }}>Filter</Text>
				</Button>

				{/* <========== Export Reports =========> */}
				<Menus
					as={Button}
					type="everted"
					size="lg"
					title="Export"
					menulist={menuList}
					iconPos="left"
					iconName="file-download"
					iconStyles={{ width: "18px" }}
					rounded="10px"
					listStyles={{
						width: "250px",
						fontSize: "20px",
					}}
				/>

				{/* <===================Filter Modal Code ==========================> */}
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					title="Filter"
					submitText="Apply Now"
					isCentered={{ base: false, lg: true }}
					onSubmit={onFilterSubmit}
					motionPreset="slideInBottom"
					scrollBehavior="inside"
					size={{ base: "sm", md: "lg" }}
				>
					<form>
						<Form
							{...{
								parameter_list: form_parameter_list,
								register,
								control,
								formValues,
								errors,
								gap: "2",
							}}
						/>
						{/* <Input
								label="TID"
								name="tid"
								type="number"
								labelStyle={labelStyle}
								value={formState.tid}
								onChange={handleChange}
							/>

							<Input
								label="Account Number"
								name="account"
								type="number"
								labelStyle={labelStyle}
								value={formState.account}
								onChange={handleChange}
							/>
							<Input
								label="Customer Mobile No."
								name="customer_mobile"
								type="number"
								labelStyle={labelStyle}
								value={formState.customer_mobile}
								onChange={handleChange}
							/>
							<Calenders
								label="From"
								name="start_date"
								labelStyle={labelStyle}
								value={formState.start_date}
								onChange={handleChange}
								mb={{ base: 2, "2xl": "1rem" }}
							/>
							<Calenders
								label="To"
								name="tx_date"
								labelStyle={labelStyle}
								value={formState.tx_date}
								onChange={handleChange}
								mb={{ base: 2, "2xl": "1rem" }}
							/>
							<Input
								label="Amount"
								name="amount"
								type="number"
								labelStyle={labelStyle}
								value={formState.amount}
								onChange={handleChange}
								inputLeftElement={
									<Icon
										name="rupee"
										height="14px"
										color="light"
									/>
								}
							/>
							<Input
								label="Tracking Number"
								name="rr_no"
								labelStyle={labelStyle}
								value={formState.rr_no}
								onChange={handleChange}
								type="number"
							/> */}
					</form>
				</Modal>
			</Flex>
		</Flex>
	);
};

export default HistoryToolbar;
