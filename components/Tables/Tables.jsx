import {
	Avatar,
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
import { Icon, IconButtons, Pagination, Tags } from "..";

let PageSize = 10;

const Tables = ({ className = "", ...props }) => {
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
		<div className={`${className}`} {...props}>
			<TableContainer>
				<Table variant={"striped"}>
					<Thead bg="hint">
						<Tr>
							{/* // TODO Make this dynamic 👇 */}
							<Th>
								<Flex>
									Sr. No.
									<Box as="span" onClick={onSortChange}>
										<Icon
											name={sortIcon[currentSort]}
											width="20px"
											height="20px"
										/>
									</Box>
								</Flex>
							</Th>
							<Th>Name</Th>
							<Th>Mobile Number</Th>
							<Th>Type</Th>
							<Th>Onboarded on</Th>
							<Th>Account Status</Th>
							<Th>Eko Code</Th>
							<Th>Location</Th>
							<Th></Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{currentTableData.map((item, index) => {
							return (
								<Tr key={index}>
									<Td>{index + 1}</Td>
									<Td>
										<Flex align={"center"} gap="0.625rem">
											<Box>
												<Avatar
													bg="accent.DEFAULT"
													color="divider"
													size="sm"
													name={item.name}
													// src={item.link}
												/>
											</Box>
											<Box as="span">{item.name}</Box>
										</Flex>
									</Td>
									{/* <Td>{item.name}</Td> */}
									<Td>{item.mobile_number}</Td>
									<Td>{item.type}</Td>
									<Td>{item.createdAt}</Td>
									<Td>
										<Tags status={item.account_status} />
									</Td>
									<Td>{item.ekocsp_code}</Td>
									<Td>
										<Flex alignItems={"center"}>
											<Box>{item.location}</Box>
											<Box>
												<IconButtons
													iconName="near-me"
													iconStyle={{
														w: "11px",
														h: "11px",
													}}
												/>
											</Box>
										</Flex>
									</Td>
									<Td>...</Td>
									<Td>
										<Icon
											onClick={redirect}
											name="arrow-forward"
										/>
									</Td>
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
		</div>
	);
};

export default Tables;
