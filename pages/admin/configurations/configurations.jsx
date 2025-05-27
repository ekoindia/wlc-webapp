import { BreadcrumbWrapper, PaddingBox } from "components";
import { Configurations } from "page-components/Admin";

const ConfigurationsPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/admin/configurations": "Configurations",
				}}
			>
				<Configurations />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

ConfigurationsPage.pageMeta = {
	title: "Configurations | Admin",
};

export default ConfigurationsPage;
