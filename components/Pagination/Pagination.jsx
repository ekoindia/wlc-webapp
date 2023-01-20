import { Box, Flex, Square } from "@chakra-ui/react";
import { DOTS, usePagination } from "hooks";
import { useState } from "react";

const Pagination = (props) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

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

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<>
			<>
				<Flex>
					<Box w={"20px"} onClick={onPrevious} cursor="pointer">
						&lt;
					</Box>
					<Box display={"flex"}>
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
									bg="divider"
									// TODO selected where pageNumber === currentPage
									onClick={() => onPageChange(pageNumber)}
									key={index}
									cursor="pointer"
								>
									&nbsp; &nbsp;{pageNumber}&nbsp;&nbsp;
								</Square>
							);
						})}
					</Box>
					<Box w={"20px"} onClick={onNext} cursor="pointer">
						&gt;
					</Box>
				</Flex>
			</>
		</>
	);
};

export default Pagination;
