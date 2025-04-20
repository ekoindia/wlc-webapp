import { Flex } from "@chakra-ui/react";
import { PageTitle, Tags } from "components";
import { tableRowLimit } from "constants";
import { useCommissionSummary } from "contexts";
import { useEffect, useState } from "react";
import { CommissionsTable } from ".";

const pageSize = tableRowLimit?.XLARGE;

const Commissions = ({ prod_id }) => {
	const [tag, setTag] = useState(prod_id || "");
	const [pageNumber, setPageNumber] = useState(1);
	const [allCommissionsData, setAllCommissionsData] = useState([]);
	const [currentCommissionsPageData, setCurrentCommissionsPageData] =
		useState([]);

	const commissionData = useCommissionSummary();

	useEffect(() => {
		const tagData = commissionData?.data?.[tag]?.slabs;
		if (tagData?.length > 0) {
			setAllCommissionsData(tagData);
			setPageNumber(1);
		}
	}, [tag, commissionData]);

	useEffect(() => {
		const start = (pageNumber - 1) * pageSize;
		const end = start + pageSize;
		setCurrentCommissionsPageData(allCommissionsData.slice(start, end));
	}, [allCommissionsData, pageNumber]);

	const commissionProducts = Object.keys(commissionData?.data || {}).map(
		(id) => ({
			id,
			label: commissionData?.data[id].label || id,
		})
	);

	if (!commissionProducts?.length) return null;

	return (
		<>
			<PageTitle title="Know Your Commissions" />
			<Flex
				direction="column"
				w="full"
				h="auto"
				gap="3"
				p={{ base: "10px 20px", md: "20px" }}
				borderRadius="10"
				border={{ base: "none", md: "card" }}
				boxShadow={{ base: "none", md: "basic" }}
				bg={{ base: "transparent", md: "white" }}
			>
				<Flex w="full" h="auto" gap="2">
					{commissionProducts?.map((tx) => (
						<Tags
							key={tx?.id}
							status={tx?.label}
							h="32px"
							borderRadius="16"
							fontSize="xs"
							bg={tx?.id === tag ? "primary.DEFAULT" : "divider"}
							color={tx?.id === tag ? "focusbg" : "dark"}
							_hover={{ bg: "primary.DEFAULT", color: "white" }}
							onClick={() => setTag(tx.id)}
							cursor="pointer"
						/>
					))}
				</Flex>
				<CommissionsTable
					{...{
						tag,
						pageNumber,
						setPageNumber,
						tableRowLimit: pageSize,
						totalRecords: allCommissionsData?.length,
						commissionData: currentCommissionsPageData,
					}}
				/>
			</Flex>
		</>
	);
};

export default Commissions;
