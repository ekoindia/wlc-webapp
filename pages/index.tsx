import { Inter } from "@next/font/google";
import { Profile } from "components";
const inter = Inter({ subsets: ["latin"] });

export default function Index() {
	return <Profile />;
}
