import { OnboardingCompleted } from "page-components/AssistedOnboarding";
import { ASSISTED_ONBOARDING_STEPS } from "page-components/AssistedOnboarding/AssistedOnboarding";
import { render } from "test-utils";

// Mock useRouter
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

// Mock UserContext
jest.mock("contexts/UserContext", () => ({
	useUser: jest.fn(),
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

		useRouter.mockReturnValue(mockRouter);
		useUser.mockReturnValue({
			userData: {
				isAdmin: false,
			},
		});
	});

	it("renders successfully", () => {
		const mockSetStep = jest.fn();
		const { container } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays success message and completion text", () => {
		const mockSetStep = jest.fn();
		const { getByText, container } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		// Success message is displayed
		expect(
			getByText(/The agent has been successfully onboarded/)
		).toBeInTheDocument();
		// Verify component rendered
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays agent mobile number when provided", () => {
		const mockSetStep = jest.fn();
		const agentMobile = "9876543210";
		const { getByText } = render(
			<OnboardingCompleted
				setStep={mockSetStep}
				agentMobile={agentMobile}
			/>
		);

		expect(getByText(`Agent Mobile: ${agentMobile}`)).toBeInTheDocument();
	});

	it("does not display agent mobile when not provided", () => {
		const mockSetStep = jest.fn();
		const { queryByText } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		expect(queryByText(/Agent Mobile:/)).not.toBeInTheDocument();
	});

	it("renders both action buttons", () => {
		const mockSetStep = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		expect(getByText("Onboard Another Agent")).toBeInTheDocument();
		expect(getByText("Go to Home")).toBeInTheDocument();
	});

	it("calls setStep with ADD_AGENT when onboard another agent is clicked", () => {
		const mockSetStep = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		const onboardButton = getByText("Onboard Another Agent");
		onboardButton.click();

		expect(mockSetStep).toHaveBeenCalledWith(
			ASSISTED_ONBOARDING_STEPS.ADD_AGENT
		);
	});

	it("navigates to /admin for admin when Go to Home is clicked", () => {
		const { useUser } = require("contexts/UserContext");
		useUser.mockReturnValue({
			userData: {
				isAdmin: true,
			},
		});

		const mockSetStep = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		const homeButton = getByText("Go to Home");
		homeButton.click();

		expect(mockPush).toHaveBeenCalledWith("/admin");
	});

	it("navigates to /home for non-admin when Go to Home is clicked", () => {
		const mockSetStep = jest.fn();
		const { getByText } = render(
			<OnboardingCompleted setStep={mockSetStep} />
		);

		const homeButton = getByText("Go to Home");
		homeButton.click();

		expect(mockPush).toHaveBeenCalledWith("/home");
	});
});
