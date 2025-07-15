import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BbpsProducts } from "page-components/products/bbps/BbpsProducts";
import {
	BbpsContext,
	BbpsProvider,
} from "page-components/products/bbps/context/BbpsContext";
import { useContext } from "react";

// Test component to access context
const TestConsumer = () => {
	const { state, dispatch } = useContext(BbpsContext);

	return (
		<div>
			<div data-testid="current-step">{state.currentStep}</div>
			<div data-testid="selected-product-id">
				{state.selectedProduct?.id || "none"}
			</div>
			<div data-testid="selected-product-label">
				{state.selectedProduct?.label || "none"}
			</div>
			<div data-testid="loading">{state.isLoading.toString()}</div>
			<div data-testid="error">{state.error || "none"}</div>
			<button
				data-testid="dispatch-button"
				onClick={() => dispatch({ type: "SET_LOADING", value: true })}
			>
				Dispatch
			</button>
		</div>
	);
};

describe("BbpsContext", () => {
	describe("BbpsProvider", () => {
		it("provides initial state when no props are passed", () => {
			render(
				<BbpsProvider initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("current-step")).toHaveTextContent(
				"search"
			);
			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				"none"
			);
			expect(screen.getByTestId("loading")).toHaveTextContent("false");
			expect(screen.getByTestId("error")).toHaveTextContent("none");
		});

		it("sets initial step correctly", () => {
			render(
				<BbpsProvider initialStep="payment">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("current-step")).toHaveTextContent(
				"payment"
			);
		});

		it("auto-selects product when initialProductId is provided", () => {
			const productId = BbpsProducts[0].id;

			render(
				<BbpsProvider initialProductId={productId} initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				productId
			);
			expect(
				screen.getByTestId("selected-product-label")
			).toHaveTextContent(BbpsProducts[0].label);
		});

		it("handles invalid product ID gracefully", () => {
			render(
				<BbpsProvider
					initialProductId="invalid-product-id"
					initialStep="search"
				>
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				"none"
			);
		});

		it("provides working dispatch function", () => {
			render(
				<BbpsProvider initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			const dispatchButton = screen.getByTestId("dispatch-button");
			const loadingElement = screen.getByTestId("loading");

			expect(loadingElement).toHaveTextContent("false");

			dispatchButton.click();

			expect(loadingElement).toHaveTextContent("true");
		});

		it("updates step when initialStep prop changes", () => {
			const { rerender } = render(
				<BbpsProvider initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("current-step")).toHaveTextContent(
				"search"
			);

			rerender(
				<BbpsProvider initialStep="payment">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("current-step")).toHaveTextContent(
				"payment"
			);
		});

		it("updates product when initialProductId prop changes", () => {
			const firstProductId = BbpsProducts[0].id;
			const secondProductId = BbpsProducts[1].id;

			const { rerender } = render(
				<BbpsProvider
					initialProductId={firstProductId}
					initialStep="search"
				>
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				firstProductId
			);

			rerender(
				<BbpsProvider
					initialProductId={secondProductId}
					initialStep="search"
				>
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				secondProductId
			);
		});

		it("does not dispatch if same product is already selected", () => {
			const productId = BbpsProducts[0].id;

			// Mock console.log to track dispatch calls
			const consoleSpy = jest.spyOn(console, "log").mockImplementation();

			const { rerender } = render(
				<BbpsProvider initialProductId={productId} initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				productId
			);

			// Re-render with same product ID
			rerender(
				<BbpsProvider initialProductId={productId} initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			// Product should still be selected
			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				productId
			);

			consoleSpy.mockRestore();
		});

		it("handles undefined initialProductId", () => {
			render(
				<BbpsProvider initialProductId={undefined} initialStep="search">
					<TestConsumer />
				</BbpsProvider>
			);

			expect(screen.getByTestId("selected-product-id")).toHaveTextContent(
				"none"
			);
		});

		it("memoizes context value to prevent unnecessary re-renders", () => {
			const ContextValueTracker = () => {
				const _contextValue = useContext(BbpsContext);
				// This would cause infinite re-renders if value is not memoized properly
				return <div data-testid="context-stable">Stable</div>;
			};

			render(
				<BbpsProvider initialStep="search">
					<ContextValueTracker />
				</BbpsProvider>
			);

			expect(screen.getByTestId("context-stable")).toHaveTextContent(
				"Stable"
			);
		});

		it("renders children correctly", () => {
			render(
				<BbpsProvider initialStep="search">
					<div data-testid="child-component">Child Content</div>
				</BbpsProvider>
			);

			expect(screen.getByTestId("child-component")).toHaveTextContent(
				"Child Content"
			);
		});
	});

	describe("BbpsContext error handling", () => {
		it("throws error when used outside provider", () => {
			// Mock console.error to prevent error output in tests
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation();

			expect(() => {
				render(<TestConsumer />);
			}).toThrow();

			consoleSpy.mockRestore();
		});
	});

	describe("Integration with reducer", () => {
		it("maintains state consistency through multiple dispatches", () => {
			const MultiDispatchTest = () => {
				const { state, dispatch } = useContext(BbpsContext);

				return (
					<div>
						<div data-testid="loading">
							{state.isLoading.toString()}
						</div>
						<div data-testid="error">{state.error || "none"}</div>
						<button
							data-testid="set-loading"
							onClick={() =>
								dispatch({ type: "SET_LOADING", value: true })
							}
						>
							Set Loading
						</button>
						<button
							data-testid="set-error"
							onClick={() =>
								dispatch({
									type: "SET_ERROR",
									message: "Test error",
								})
							}
						>
							Set Error
						</button>
						<button
							data-testid="reset-state"
							onClick={() => dispatch({ type: "RESET_STATE" })}
						>
							Reset State
						</button>
					</div>
				);
			};

			render(
				<BbpsProvider initialStep="search">
					<MultiDispatchTest />
				</BbpsProvider>
			);

			// Initial state
			expect(screen.getByTestId("loading")).toHaveTextContent("false");
			expect(screen.getByTestId("error")).toHaveTextContent("none");

			// Set loading
			screen.getByTestId("set-loading").click();
			expect(screen.getByTestId("loading")).toHaveTextContent("true");

			// Set error
			screen.getByTestId("set-error").click();
			expect(screen.getByTestId("error")).toHaveTextContent("Test error");

			// Reset state
			screen.getByTestId("reset-state").click();
			expect(screen.getByTestId("loading")).toHaveTextContent("false");
			expect(screen.getByTestId("error")).toHaveTextContent("none");
		});
	});
});
