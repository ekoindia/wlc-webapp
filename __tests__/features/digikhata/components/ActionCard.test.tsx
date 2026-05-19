import { ActionCard } from "features/digikhata/components/ActionCard";
import { FiEye } from "react-icons/fi";
import { fireEvent, render } from "test-utils";

describe("ActionCard", () => {
	it("renders the internal icon library variant", () => {
		const { getByTestId } = render(
			<ActionCard
				label="Load Wallet"
				description="Add funds"
				icon="creditcard"
				gradient="linear(135deg, #b45309, #d97706)"
				onClick={() => {}}
			/>
		);

		expect(getByTestId("icon")).toHaveAttribute("data-icon", "creditcard");
	});

	it("renders a passed react-icons component and still handles click", () => {
		const handleClick = jest.fn();
		const { getByRole, getByTestId } = render(
			<ActionCard
				label="Transfer Fund"
				description="Send money"
				icon={FiEye}
				gradient="linear(135deg, #1e40af, #3b82f6)"
				onClick={handleClick}
			/>
		);

		expect(getByTestId("action-card-external-icon")).toBeInTheDocument();

		fireEvent.click(getByRole("button", { name: /transfer fund/i }));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
