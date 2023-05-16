import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import Head from "next/head";
import { ChangeRole } from "page-components/Admin";

const changeRole = () => {
	return (
		<>
			<Head>
				<title>Change Role</title>
			</Head>
			<PaddingBox>
				<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
					<ChangeRole />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

export default changeRole;
