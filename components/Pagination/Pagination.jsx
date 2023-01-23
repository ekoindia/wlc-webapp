import { Box, Flex, Square } from "@chakra-ui/react";
import { DOTS, usePagination } from "hooks";
import { useState } from "react";
import { Icon } from "..";

const Pagination = (props) => {
	const [currPageNumber, setCurrPageNumber] = useState(1);

	const {
		onPageChange,
		totalCount,
		siblingCount = 1,
		currentPage,
		pageSize,
		className,
	} = props;

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<Flex gap={6} py="37px" justify={"center"}>
			<Flex
				w={"20px"}
				color={currentPage !== 1 ? "light" : "hint"}
				onClick={() => {
					onPageChange(
						currentPage !== 1 ? currentPage - 1 : currentPage
					);
					setCurrPageNumber(
						currentPage !== 1 ? currentPage - 1 : currentPage
					);
				}}
				cursor="pointer"
			>
				<Icon name="chevron-left" />
			</Flex>
			<Flex gap={6}>
				{paginationRange.map((pageNumber, index) => {
					if (pageNumber === DOTS) {
						return (
							<Box as="span" key={index}>
								&#8230;
							</Box>
						);
					}
					return (
						<Square
							size="auto"
							px="7px"
							borderRadius="6px"
							key={index}
							cursor="pointer"
							bg={
								currPageNumber === pageNumber
									? "accent.DEFAULT"
									: ""
							}
							color={
								currPageNumber === pageNumber
									? "white"
									: "light"
							}
							onClick={() => {
								onPageChange(pageNumber);
								setCurrPageNumber(pageNumber);
							}}
						>
							<Box>{pageNumber}</Box>
						</Square>
					);
				})}
			</Flex>
			<Flex
				w={"20px"}
				color={currentPage !== lastPage ? "light" : "hint"}
				cursor="pointer"
				onClick={() => {
					onPageChange(
						currentPage !== lastPage ? currentPage + 1 : currentPage
					);
					setCurrPageNumber(
						currentPage !== lastPage ? currentPage + 1 : currentPage
					);
				}}
			>
				<Icon name="chevron-right" />
			</Flex>
		</Flex>
	);
};

export default Pagination;
