import {
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Button,
	Tr,
	Flex,
	Box,
} from "@chakra-ui/react";
import { mockData } from "constants/mockTableData";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "..";
import { Tags, IconButtons } from "..";

import { useRouter } from "next/router";

let PageSize = 10;

const Tables = ({ className = "", ...props }) => {
	const [currentPage, setCurrentPage] = useState(1);

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return mockData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);

	const router = useRouter();
	const redirect = () => {
		router.push("my-network/profile");
	};

	// console.log('currentTableData', currentTableData)

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<div className={`${className}`} {...props}>
			<TableContainer>
				<Table variant={"striped"}>
					<Thead bg="#D2D2D2">
						<Tr>
							<Th>Sr No</Th>
							<Th>Name</Th>
							<Th>Mobile</Th>
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
						<Tr>
							<Td onClick={redirect}> 1</Td>
							<Td onClick={redirect}>kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Active" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Indore</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>

							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 2</Td>
							<Td onClick={redirect}>kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td>
								<Tags status="Pending" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Delhi</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 3</Td>
							<Td onClick={redirect}>kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>

							<Td>
								<Tags status="Active" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Jab</Box>
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
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>

							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 4</Td>
							<Td onClick={redirect}>Kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td>
								<Tags status="Inactive" />
							</Td>
							<Td> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td> 5</Td>
							<Td>Kumar</Td>
							<Td>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Active" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td> 6</Td>
							<Td>Kumar</Td>
							<Td>25.4</Td>
							<Td> inches</Td>
							<Td>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Pending" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 7</Td>
							<Td onClick={redirect}>Kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Inactive" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 8</Td>
							<Td onClick={redirect}>Kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Active" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 9</Td>
							<Td onClick={redirect}>Kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Pending" />
							</Td>
							<Td onClick={redirect}> inches</Td>
							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
									<Box>
										<IconButtons
											iconName="near-me"
											iconStyle={{
												w: "11px",
												h: "11px",
											}}
										/>
									</Box>
								</Flex>{" "}
							</Td>
							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
						<Tr>
							<Td onClick={redirect}> 10</Td>
							<Td onClick={redirect}>Kumar</Td>
							<Td onClick={redirect}>25.4</Td>
							<Td onClick={redirect}> inches</Td>
							<Td onClick={redirect}>millimetres</Td>
							<Td onClick={redirect}>
								<Tags status="Inactive" />
							</Td>
							<Td onClick={redirect}> inches</Td>

							<Td>
								<Flex alignItems={"center"}>
									<Box>Bhopal</Box>
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

							<Td>
								<Button
									style={{
										background:
											"#FE9F00 0% 0% no-repeat padding-box",
									}}
								>
									<img src="/icons/threedot.svg" alt="" />
								</Button>
							</Td>
							<Td onClick={redirect}>
								{" "}
								<img
									src="/icons/backArrow.svg"
									onClick={redirect}
									style={{
										fontSize: "150%",
										color: "#D2D2D2",
										transform: "rotate(180deg)",
									}}
								/>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			{/* <Pagination
				className="pagination-bar"
				currentPage={currentPage}
				totalCount={mockData.length}
				pageSize={PageSize}
				onPageChange={(page) => setCurrentPage(page)}
			/> */}
		</div>
	);
};

export default Tables;
