import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal } from "components";
import { Form } from "tf-components";

/**
 * A NetworkToolbar page-component
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
}) => {
	return (
		<Flex
			gap="2"
			w="100%"
			justify="space-between"
			align="center"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			<Flex>
				<Form {...searchBarConfig} />
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
						<>
							<Button
								key={id}
								size="lg"
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
								<form onSubmit={handleSubmit(handleFormSubmit)}>
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
											}}
										/>
										<Flex gap="4">
											<Button
												w="100%"
												size="lg"
												variant="link"
												color="primary.dark"
												onClick={secondaryButtonAction}
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
						</>
					)
				)}
			</Flex>
		</Flex>
	);
};

export default NetworkToolbar;
