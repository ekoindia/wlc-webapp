import { Box, Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal, SearchBar, SegmentedControl } from "components";
import { useFeatureFlag } from "hooks";
import React from "react";
import { MdAccountTree, MdOutlineTableRows } from "react-icons/md";
import { Form } from "tf-components";

/**
 * **NetworkToolbar** — Composite toolbar rendered at the top of the Network
 * page containing search, filter, export, and column-toggle controls.
 *
 * - **Search**: renders a `SearchBar` fed with the full `networkUsersList` for
 * client-side fuzzy type-ahead (by name & mobile). Selecting an item navigates
 * to the agent profile page via `onItemSelect` callback.
 * - **Filter / Export**: each entry in `actionBtnConfig` gets an icon-button
 * that opens a modal containing a `tf-components <Form>` or a custom
 * `Component` (e.g. `NetworkToggleColumns`).
 * - **View toggle**: shows a segmented "List / Tree" control when the
 * `NETWORK_TREE_VIEW` feature flag is enabled.
 * @param {object}   props
 * @param {boolean}  props.isFiltered          - Whether a filter is currently active.
 * @param {Function} props.clearFilter         - Clears the active filter and resets the query.
 * @param {number|null} props.openModalId      - ID of the currently open action modal, or `null`.
 * @param {Function} props.setOpenModalId      - Setter for `openModalId`.
 * @param {Array<object>} props.actionBtnConfig - Config array for Filter / Export / Columns buttons.
 *   Each entry may contain `id`, `label`, `icon`, `parameter_list`, `handleSubmit`,
 *   `handleFormSubmit`, `submitButtonText`, `secondaryButtonText`, `secondaryButtonAction`,
 *   `styles`, `desktopOnly`, and optionally a custom `Component` with `columns`,
 *   `hiddenColumns`, `onToggle`, `onReset`.
 * @param {"sm"|"md"|"lg"} [props.size]  - Size passed to action icon-buttons.
 * @param {"list"|"tree"} props.viewType       - Current view mode.
 * @param {Function} props.setViewType         - Setter for `viewType`.
 * @param {boolean}  [props.hideFilter]  - When `true`, hides all filter/export buttons.
 * @param {boolean}  [props.hideSearch]  - When `true`, hides the search bar.
 * @param {Array<object>} props.networkUsersList - Full list of network agents used for
 *   client-side type-ahead. Each item should have at least `name` and `mobile` fields.
 * @param {Function} props.onItemSelect        - Called with the selected agent object when
 *   the user clicks a dropdown suggestion. Typically navigates to the agent profile page.
 * @returns {JSX.Element}
 * @example
 * <NetworkToolbar
 *   isFiltered={false}
 *   clearFilter={handleClearFilter}
 *   openModalId={null}
 *   setOpenModalId={setOpenModalId}
 *   actionBtnConfig={actionBtnConfig}
 *   viewType="list"
 *   setViewType={setViewType}
 *   networkUsersList={networkUsersList}
 *   onItemSelect={(item) => router.push(`/my-network/profile?mobile=${item.mobile}`)}
 * />
 */
const NetworkToolbar = ({
	isFiltered,
	clearFilter,
	openModalId,
	setOpenModalId,
	actionBtnConfig,
	size = "md",
	viewType,
	hideFilter = false,
	hideSearch = false,
	setViewType,
	networkUsersList,
	onItemSelect,
}) => {
	const [isTreeViewEnabled] = useFeatureFlag("NETWORK_TREE_VIEW");

	return (
		<Flex
			gap={{ base: "2px", md: 2 }}
			w="100%"
			wrap={true}
			align="center"
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
				<SearchBar
					setSearch={() => {}}
					placeholder="Search by Name or Mobile Number"
					dataList={networkUsersList}
					onItemSelect={onItemSelect}
					maxDropdownItems={5}
					renderItem={(item) => (
						<Flex align="center" justify="space-between" w="100%">
							<Flex direction="column" gap={0}>
								<Text
									fontSize="sm"
									fontWeight="600"
									color="gray.800"
									textTransform="capitalize"
								>
									{item.name?.toLowerCase()}
								</Text>
								<Text
									fontSize="xs"
									color="gray.500"
									fontWeight="500"
								>
									{item.mobile}
								</Text>
							</Flex>
							<Icon
								name="arrow-forward"
								size="14px"
								color="gray.400"
							/>
						</Flex>
					)}
					searchKeys={["name", "mobile"]}
				/>
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
							Component,
							columns,
							hiddenColumns,
							onToggle,
							onReset,
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
							desktopOnly,
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
									display={
										desktopOnly
											? { base: "none", md: "flex" }
											: "flex"
									}
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
									{Component ? (
										<Component
											columns={columns}
											hiddenColumns={hiddenColumns}
											onToggle={onToggle}
											onReset={onReset}
										/>
									) : (
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
									)}
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
