import {
	Box,
	Flex,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { mockData } from "constants/mockTableData";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Icon, Pagination } from "../../../";

let PageSize = 10;

const AccountStatementTable = ({ className = "", ...props }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentSort, setCurrentSort] = useState("default");

	const onSortChange = () => {
		let nextSort;

		if (currentSort === "ascending") {
			nextSort = "descending";
		} else if (currentSort === "descending") {
			nextSort = "default";
		} else {
			nextSort = "ascending";
		}

		setCurrentSort(nextSort);
	};

	const sortIcon = {
		ascending: "caret-up",
		descending: "caret-down",
		default: "sort",
	};

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return mockData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);

	const router = useRouter();
	const redirect = () => {
		router.push("my-network/profile");
	};
	return (
		<>
			<TableContainer
				borderRadius="10px 10px 0 0"
				mt="20px"
				border="1px solid #E9EDF1"
			>
				<Table variant={"evenStriped"} bg="white">
					<Thead bg="hint">
						<Tr>
							{/* // TODO Make this dynamic 👇 */}
							<Th>Transaction ID</Th>
							<Th>
								<Flex>
									Date & Time
									<Box as="span" onClick={onSortChange}>
										<Icon
											//name={sortIcon[currentSort]} // uncomment this to have interative sort
											name="sort"
											width="20px"
											height="20px"
										/>
									</Box>
								</Flex>
							</Th>
							<Th>Activity</Th>
							<Th>Description</Th>
							<Th>Amount</Th>
							<Th>Running Balance</Th>
						</Tr>
					</Thead>
					<Tbody>
						{currentTableData.map((item, index) => {
							return (
								<Tr key={index}>
									<Td>{index + 1}</Td>
									<Td>{item.ekocsp_code}</Td>
									<Td>{item.mobile_number}</Td>
									<Td>
										<Flex direction="column">
											<Box as="span">Saurabh Mullick</Box>
											<Box as="span">
												Mobile:9654110669
											</Box>
											<Box as="span">
												A/C:20082437069 STATE BANK OF
												INDIA
											</Box>
										</Flex>
									</Td>
									<Td>{item.ekocsp_code}</Td>
									<Td>{item.ekocsp_code}</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<Flex justify={"flex-end"}>
				<Pagination
					className="pagination-bar"
					currentPage={currentPage}
					totalCount={mockData.length}
					pageSize={PageSize}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</Flex>
		</>
	);
};

export default AccountStatementTable;
