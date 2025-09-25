import { Box, Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal, SegmentedControl } from "components";
import { useFeatureFlag } from "hooks";
import React from "react";
import { MdAccountTree, MdOutlineTableRows } from "react-icons/md";
import { Form } from "tf-components";

/**
 * A NetworkToolbar page-component
 * @param {object} props
 * @param {boolean} props.isSearched
 * @param {Function} props.clearSearch
 * @param {boolean} props.isFiltered
 * @param {Function} props.clearFilter
 * @param {string} props.openModalId
 * @param {Function} props.setOpenModalId
 * @param {object} props.searchBarConfig
 * @param {object} props.actionBtnConfig
 * @param {string} props.size Size of the toolbar: "sm" | "md" | "lg"
 * @param {string} props.viewType List or Tree view
 * @param {boolean} props.hideFilter Hide the filter button, if true.
 * @param {boolean} props.hideSearch Hide the search bar, if true.
 * @param {Function} props.setViewType
 * @example	`<NetworkToolbar></NetworkToolbar>` TODO: Fix example
 */
const NetworkToolbar = ({
	isSearched,
	clearSearch,
	isFiltered,
	clearFilter,
	openModalId,
	setOpenModalId,
	searchBarConfig,
	actionBtnConfig,
	size = "md",
	viewType,
	hideFilter = false,
	hideSearch = false,
	setViewType,
}) => {
	const [isTreeViewEnabled] = useFeatureFlag("NETWORK_TREE_VIEW");

	return (
		<Flex
			gap={{ base: "2px", md: 2 }}
			w="100%"
			wrap={true}
			// justify="space-between"
			align="center"
			mb="20px"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			{/* MARK: Switch View */}
			{isTreeViewEnabled ? (
				<SegmentedControl
					segments={[
						{
							id: 0,
							value: "list",
							label: "List View",
							icon: <MdOutlineTableRows />,
						},
						{
							id: 1,
							value: "tree",
							label: "Tree View",
							icon: <MdAccountTree />,
						},
					]}
					value={viewType}
					onChange={(value) => setViewType(value)}
					equalWidth={false}
					minSegmentWidth={"40px"}
					size="md"
					minWidth="80px"
					hideLabelsOnMobile
				/>
			) : null}

			{/* MARK: Spacer */}
			<Box flex="1" />

			{/* MARK: Search */}
			{hideSearch ? null : (
				<Flex>
					<Form {...searchBarConfig} hideOptionalMark size={size} />
					<Button
						size="xs"
						display={{
							base: "none",
							md: isSearched ? "block" : "none",
						}}
						variant="link"
						onClick={clearSearch}
						_hover={{ textDecoration: "none" }}
					>
						Clear Search
					</Button>
				</Flex>
			)}

			{/* MARK: Filter */}
			{hideFilter ? null : (
				<Flex gap="2">
					<Button
						size="xs"
						display={{
							base: "none",
							md: isFiltered ? "block" : "none",
						}}
						variant="link"
						onClick={clearFilter}
						_hover={{ textDecoration: "none" }}
					>
						Clear Filter
					</Button>
					{actionBtnConfig.map(
						({
							id,
							label,
							icon,
							parameter_list,
							handleSubmit,
							register,
							control,
							errors,
							isSubmitting,
							formValues,
							handleFormSubmit,
							submitButtonText,
							secondaryButtonAction,
							secondaryButtonText,
							styles,
						}) => (
							<React.Fragment key={id}>
								<Button
									size={size}
									variant="primary_outline"
									onClick={() =>
										setOpenModalId(
											id === openModalId ? null : id
										)
									}
									{...styles}
								>
									<Icon name={icon} size="sm" />
									&nbsp;
									<Text
										display={{ base: "none", md: "flex" }}
										fontSize="md"
									>
										{label}
									</Text>
								</Button>
								<Modal
									isOpen={openModalId === id}
									onClose={() => setOpenModalId(null)}
									title={label}
								>
									<form
										onSubmit={handleSubmit(
											handleFormSubmit
										)}
									>
										<Flex
											direction="column"
											w="100%"
											gap="8"
											mb="4"
										>
											<Form
												{...{
													parameter_list,
													register,
													control,
													formValues,
													errors,
													hideOptionalMark: true,
												}}
											/>
											<Flex gap="4">
												<Button
													w="100%"
													size="lg"
													variant="link"
													color="primary.dark"
													onClick={
														secondaryButtonAction
													}
												>
													{secondaryButtonText}
												</Button>
												<Button
													w="100%"
													size="lg"
													type="submit"
													loading={isSubmitting}
												>
													{submitButtonText}
												</Button>
											</Flex>
										</Flex>
									</form>
								</Modal>
							</React.Fragment>
						)
					)}
				</Flex>
			)}
		</Flex>
	);
};

export default NetworkToolbar;
