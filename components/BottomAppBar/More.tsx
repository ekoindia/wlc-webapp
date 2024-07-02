import { useMenuContext } from "contexts";
import ContentDrawer from "./ContentDrawer";

const More = () => {
	const { menuList, otherList } = useMenuContext();
	const list = [...menuList, ...otherList];

	return <ContentDrawer {...{ list, title: "More", icon: "others" }} />;
};

export default More;
