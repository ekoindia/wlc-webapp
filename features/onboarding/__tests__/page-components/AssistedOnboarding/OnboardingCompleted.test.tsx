import {
	ASSISTED_ONBOARDING_STEPS,
	OnboardingCompleted,
} from "features/onboarding";
import { render } from "test-utils";

// Mock useRouter
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

// Mock UserContext
jest.mock("contexts/UserContext", () => ({
	useUser: jest.fn(),
}));

// Mock OnboardingContext — OnboardingCompleted now reads mobile from context
jest.mock("features/onboarding/context/OnboardingContext", () => ({
	useOnboardingContext: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
	push: mockPush,
	pathname: "/assisted-onboarding",
	route: "/assisted-onboarding",
	query: {},
	asPath: "/assisted-onboarding",
};

describe("OnboardingCompleted component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		const { useRouter } = require("next/router");
		const { useUser } = require("contexts/UserContext");
		const {
			useOnboardingContext,
		} = require("features/onboarding/context/OnboardingContext");

		useRouter.mockReturnValue(mockRouter);
		useUser.mockReturnValue({
			userData: {
				isAdmin: false,
			},
		});
		// Default: no mobile
		useOnboardingContext.mockReturnValue({ mobile: "" });
	});

	it("renders successfully", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { container } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays success message and completion text", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText, container } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		expect(
			getByText(/Successfully verified and onboarded/)
		).toBeInTheDocument();
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays agent mobile number when provided via context", () => {
		const {
			useOnboardingContext,
		} = require("features/onboarding/context/OnboardingContext");
		useOnboardingContext.mockReturnValue({ mobile: "9876543210" });

		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		expect(getByText("Registered Mobile: 9876543210")).toBeInTheDocument();
	});

	it("does not display agent mobile when context has empty mobile", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { queryByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		expect(queryByText(/Registered Mobile:/)).not.toBeInTheDocument();
	});

	it("renders both action buttons", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		expect(getByText("Onboard Another Agent")).toBeInTheDocument();
		expect(getByText("Go to Home")).toBeInTheDocument();
	});

	it("calls resetAgentState and setStep with ADD_AGENT when onboard another agent is clicked", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		const onboardButton = getByText("Onboard Another Agent");
		onboardButton.click();

		expect(mockResetAgentState).toHaveBeenCalled();
		expect(mockSetStep).toHaveBeenCalledWith(
			ASSISTED_ONBOARDING_STEPS.ADD_AGENT
		);
	});

	it("navigates to /admin for admin when Go to Home is clicked", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
				isAdmin={true}
			/>
		);

		const homeButton = getByText("Go to Home");
		homeButton.click();

		expect(mockPush).toHaveBeenCalledWith("/admin");
	});

	it("navigates to /home for non-admin when Go to Home is clicked", () => {
		const mockSetStep = jest.fn();
		const mockResetAgentState = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				resetAgentState={mockResetAgentState}
			/>
		);

		const homeButton = getByText("Go to Home");
		homeButton.click();

		expect(mockPush).toHaveBeenCalledWith("/home");
	});
});
