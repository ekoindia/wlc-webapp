import { BreadcrumbsWrapper, PaddingBox } from "components";
import { Configurations } from "page-components/Admin";

const ConfigurationsPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/admin/configurations": "Configurations",
				}}
			>
				<Configurations />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

ConfigurationsPage.pageMeta = {
	title: "Configurations | Admin",
};

export default ConfigurationsPage;
