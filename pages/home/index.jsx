import { PaddingBox } from "components";
import { Home } from "page-components";

const HomePage = () => {
	return (
		<PaddingBox>
			<Home />
		</PaddingBox>
	);
};

HomePage.pageMeta = {
	title: "Home",
	showBottomAppBar: true,
};

export default HomePage;
