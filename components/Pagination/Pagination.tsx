import { Box, Flex, Square } from "@chakra-ui/react";
import { ELLIPSIS, usePagination } from "hooks";
import { IcoButton } from "..";

type PaginationProps = {
	pageSize: number;
	totalCount?: number;
	currentPage: number;
	onPageChange: (_page: number) => void;
	isSmallScreen: boolean;
	tableDataSize?: number;
	[key: string]: any;
};

/**
 * A Pagination component.
 * @param 	{PaginationProps} props - Properties passed to the component.
 * @param	{number}	props.pageSize - The number of items per page.
 * @param	{number}	[props.totalCount] - The total number of items. If undefined, pagination is based on `tableDataSize` and `pageSize`.
 * @param	{number}	props.currentPage - The current page number.
 * @param	{Function}	props.onPageChange - Callback function to handle page changes.
 * @param	{boolean}	props.isSmallScreen - Boolean indicating if the screen size is small.
 * @param	{number}	[props.tableDataSize] - The size of the table data. Required if `totalCount` is undefined.
 * @param	{...any}	rest - Rest of the props passed to this component.
 * @example	<Pagination pageSize={10} totalCount={100} currentPage={1} onPageChange={handlePageChange} isSmallScreen={false} />
 */
const Pagination = ({
	pageSize,
	totalCount,
	currentPage,
	onPageChange,
	isSmallScreen,
	tableDataSize,
	...rest
}: PaginationProps) => {
	let pagination = usePagination({
		currentPage,
		totalCount,
		pageSize,
		tableDataSize,
	});

	let lastPage = pagination?.[pagination?.length - 1] as number;
	let hasNextPage = false;

	if (totalCount === undefined) {
		hasNextPage = pagination as unknown as boolean;
	}

	return (
		<Flex
			my="20px"
			justifyContent={
				!isSmallScreen && totalCount ? "space-between" : "flex-end"
			}
			w="100%"
			fontSize={isSmallScreen ? "md" : "xs"}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
			{...rest}
		>
			{!isSmallScreen && totalCount && (
				<Flex gap="1.5" color="light">
					<span>Results</span>
					<Box as="span" color="dark">
						{currentPage * pageSize - (pageSize - 1)}-
						{currentPage * pageSize > totalCount
							? totalCount
							: currentPage * pageSize}
					</Box>
					<span>of</span>
					<span>{totalCount}</span>
				</Flex>
			)}

			<Flex align="center" gap={isSmallScreen ? "8" : "4"}>
				<IcoButton
					size={isSmallScreen ? "md" : "sm"}
					theme={null}
					iconName="chevron-left"
					iconStyle={{
						color: currentPage !== 1 ? "light" : "hint",
					}}
					iconSize={isSmallScreen ? "sm" : "xs"}
					onClick={() => {
						if (currentPage > 1) {
							onPageChange(currentPage - 1);
						}
					}}
				/>

				<Flex align="center" gap="4" h="100%">
					{!isSmallScreen && totalCount ? (
						pagination?.map((pageNumber, index) => {
							if (pageNumber === ELLIPSIS) {
								return <span key={index}>{ELLIPSIS}</span>;
							}
							return (
								<Square
									px="7px"
									borderRadius="6px"
									key={index}
									cursor="pointer"
									bg={
										currentPage === pageNumber
											? "primary.DEFAULT"
											: undefined
									}
									color={
										currentPage === pageNumber
											? "white"
											: "light"
									}
									onClick={() =>
										onPageChange(pageNumber as number)
									}
								>
									<span>{pageNumber}</span>
								</Square>
							);
						})
					) : (
						<span>{currentPage}</span>
					)}
				</Flex>

				<IcoButton
					size={isSmallScreen ? "md" : "sm"}
					theme={null}
					iconName="chevron-right"
					iconStyle={{
						color:
							(totalCount && currentPage !== lastPage) ||
							(!totalCount && hasNextPage)
								? "light"
								: "hint",
					}}
					iconSize={isSmallScreen ? "sm" : "xs"}
					onClick={() => {
						if (totalCount && currentPage !== lastPage) {
							onPageChange(currentPage + 1);
						} else if (!totalCount && hasNextPage) {
							onPageChange(currentPage + 1);
						}
					}}
				/>
			</Flex>
		</Flex>
	);
};

export default Pagination;
