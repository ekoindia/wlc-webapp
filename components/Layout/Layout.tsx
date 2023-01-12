import NavSide from "./NavSide";

// const {Content} = Layout;

const Layout = (props) => {
	return <NavSide>{props.children}</NavSide>;
};

export default Layout;
