import {
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { mockData } from "constants/mockTableData";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "..";

let PageSize = 10;

const Tables = ({ className = "", ...props }) => {
	const [currentPage, setCurrentPage] = useState(1);

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return mockData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);
	// console.log('currentTableData', currentTableData)

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<div className={`${className}`} {...props}>
			<TableContainer>
				<Table variant={"striped"}>
					<Thead>
						<Tr>
							<Th>To convert</Th>
							<Th>into</Th>
							<Th isNumeric>multiply by</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td>inches</Td>
							<Td>millimetres (mm)</Td>
							<Td isNumeric>25.4</Td>
						</Tr>
						<Tr>
							<Td>feet</Td>
							<Td>centimetres (cm)</Td>
							<Td isNumeric>30.48</Td>
						</Tr>
						<Tr>
							<Td>yards</Td>
							<Td>metres (m)</Td>
							<Td isNumeric>0.91444</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<Pagination
				className="pagination-bar"
				currentPage={currentPage}
				totalCount={mockData.length}
				pageSize={PageSize}
				onPageChange={(page) => setCurrentPage(page)}
			/>
		</div>
	);
};

export default Tables;
