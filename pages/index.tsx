import { Inter } from "@next/font/google";
import { LoginPanel } from "components";
const inter = Inter({ subsets: ["latin"] });

export default function Index() {
	return <LoginPanel />;
}
