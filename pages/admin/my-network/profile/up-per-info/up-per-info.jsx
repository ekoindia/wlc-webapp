import { BreadcrumbsWrapper, Layout, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { UpdatePersonalInfo } from "page-components/Admin";

function updatePersonalInfo() {
	return (
		<>
			<Head>
				<title>Update Personal Information</title>
			</Head>
			<Layout>
				<PaddingBox>
					<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
						<UpdatePersonalInfo />
					</BreadcrumbsWrapper>
				</PaddingBox>
			</Layout>
		</>
	);
}

export default updatePersonalInfo;
