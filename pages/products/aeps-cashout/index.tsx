import { Box, Text } from "@chakra-ui/react";
import { PaddingBox, PageTitle } from "components";
import { Breadcrumb } from "components/Breadcrumb";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper";
import { AepsCashout } from "page-components/products/aeps-cashout";
import { useFeatureFlag } from "hooks";
import { useRouter } from "next/router";

/**
 * Native AePS cashout route: provider select -> Fingpay status -> [daily
 * auth] -> payment mode -> search customer -> [otp] -> cashout -> result.
 * Runs side-by-side with the existing widget-driven `/gateway/aeps` product
 * (GatewayProductRegistry.ts) while this native flow is developed and tested —
 * see the AePS cashout flow doc for the full interaction map and open items.
 */
const AepsCashoutRoute = (): JSX.Element => {
	const [isFeatureEnabled] = useFeatureFlag("AEPS_CASHOUT");
	const router = useRouter();

	const crumbs = generateBreadcrumbs(router.asPath, {}, ["/products"]);

	if (!isFeatureEnabled) {
		return (
			<PaddingBox>
				<PageTitle title="AePS Cashout" hideBackIcon />
				<Text color="error">This feature is not available.</Text>
			</PaddingBox>
		);
	}

	return (
		<PaddingBox>
			<Box
				p={{
					base: "0px",
					md: "30px",
				}}
				pb={{ base: "20px", md: "5px" }}
			>
				<Breadcrumb crumbs={crumbs} />
			</Box>
			<PageTitle title="AePS Cashout" isBeta hideBackIcon />
			<AepsCashout />
		</PaddingBox>
	);
};

AepsCashoutRoute.pageMeta = {
	title: "AePS Cashout",
	isBeta: true,
	isSubPage: false,
};

export default AepsCashoutRoute;
