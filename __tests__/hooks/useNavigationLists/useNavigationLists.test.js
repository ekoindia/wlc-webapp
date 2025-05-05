import { KBarLazyProvider } from "components/CommandBar";
import { MenuProvider } from "contexts";
import { useNavigationLists } from "hooks";
import { CommonHooksProviders, renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useNavigationLists(), {
		wrapper: ({ children }) => (
			<CommonHooksProviders>
				<KBarLazyProvider>
					<MenuProvider>{children}</MenuProvider>
				</KBarLazyProvider>
			</CommonHooksProviders>
		),
	});
	expect(result.current).toBeDefined();
	// result.current = {"menuList": [{"dynamicAdminView": true, "icon": "menu-home", "id": 210, "label": "Home", "link": "/home"}], "otherList": [{"description": "Statement of your previous transactions", "icon": "transaction-history", "label": "Transaction History", "link": "/history"}], "trxnList": []}
	expect(result.current.menuList).toBeDefined();
	expect(result.current.menuList).toBeInstanceOf(Array);
	expect(result.current.otherList).toBeDefined();
	expect(result.current.otherList).toBeInstanceOf(Array);
	expect(result.current.trxnList).toBeDefined();
	expect(result.current.trxnList).toBeInstanceOf(Array);
});
