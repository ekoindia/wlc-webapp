import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal, SearchBar } from "components";
import { Form } from "tf-components";

/**
 * A HistoryToolbar page-component
 * @example	`<HistoryToolbar></HistoryToolbar>` TODO: Fix example
 */
const HistoryToolbar = ({
	searchValue,
	onSearchSubmit,
	isFiltered,
	onFilterClear,
	openModalId,
	setOpenModalId,
	actionBtnConfig,
}) => {
	return (
		<Flex
			gap="2"
			w="100%"
			justify="flex-end"
			align="center"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			<Button
				size="xs"
				display={isFiltered ? "block" : "none"}
				variant="link"
				onClick={onFilterClear}
				_hover={{ textDecoration: "none" }}
			>
				Clear Filter
			</Button>

			<SearchBar
				type="number"
				placeholder="Search by TID, Mobile, Account, etc"
				value={searchValue}
				setSearch={onSearchSubmit}
				minSearchLimit={2}
			/>

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
				}) => (
					<>
						<Button
							key={id}
							size="lg"
							variant="primary_outline"
							onClick={() =>
								setOpenModalId(id === openModalId ? null : id)
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
											gap: "2",
										}}
									/>
									<Button
										w="100%"
										size="lg"
										type="submit"
										loading={isSubmitting}
									>
										{submitButtonText}
									</Button>
								</Flex>
							</form>
						</Modal>
					</>
				)
			)}
		</Flex>
	);
};

export default HistoryToolbar;
