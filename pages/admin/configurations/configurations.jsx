import { BreadcrumbsWrapper, PaddingBox } from "components";
import { ConfigurationsBreadcrumbData } from "constants";
import { Configurations } from "page-components/Admin";

const ConfigurationsPage = () => {
	return (
		<>
			<PaddingBox>
				<BreadcrumbsWrapper
					BreadcrumbsObject={ConfigurationsBreadcrumbData}
				>
					<Configurations />
				</BreadcrumbsWrapper>
			</PaddingBox>
		</>
	);
};

ConfigurationsPage.pageMeta = {
	title: "Configurations | Admin",
};

export default ConfigurationsPage;
