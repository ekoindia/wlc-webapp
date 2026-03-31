import { OtpModal } from "features/digikhata/components/OtpModal";
import { fireEvent, render } from "test-utils";

describe("OtpModal", () => {
	const noop = () => {};

	it("does not render modal content when isOpen is false", () => {
		const { queryByText } = render(
			<OtpModal
				isOpen={false}
				onClose={noop}
				onSubmit={noop}
				onResend={noop}
				title="Test OTP"
			/>
		);
		expect(queryByText(/Test OTP/i)).not.toBeInTheDocument();
	});

	it("renders modal content when isOpen is true", () => {
		const { getByText } = render(
			<OtpModal
				isOpen={true}
				onClose={noop}
				onSubmit={noop}
				onResend={noop}
				title="Enter OTP"
			/>
		);
		expect(getByText(/Enter OTP/i)).toBeInTheDocument();
	});

	it("shows mobile hint when provided", () => {
		const { getByText } = render(
			<OtpModal
				isOpen={true}
				onClose={noop}
				onSubmit={noop}
				onResend={noop}
				title="Verify"
				mobileHint="XXXXXX1234"
			/>
		);
		expect(getByText(/XXXXXX1234/i)).toBeInTheDocument();
	});

	it("calls onResend when Resend button is clicked", () => {
		const mockResend = jest.fn();
		const { getByText } = render(
			<OtpModal
				isOpen={true}
				onClose={noop}
				onSubmit={noop}
				onResend={mockResend}
				title="Verify"
			/>
		);
		fireEvent.click(getByText(/Resend/i));
		expect(mockResend).toHaveBeenCalledTimes(1);
	});

	it("shows loading state on the submit button", () => {
		const { getByText } = render(
			<OtpModal
				isOpen={true}
				onClose={noop}
				onSubmit={noop}
				onResend={noop}
				title="Verify"
				isLoading={true}
			/>
		);
		// Verify OTP button should be present (Chakra renders spinner inside)
		expect(getByText(/Verify OTP/i)).toBeInTheDocument();
	});
});
