import { act, fireEvent, screen } from "@testing-library/react";
import { DigiKhataContext } from "features/digikhata/context/DigiKhataContext";
import { RecipientsStep } from "features/digikhata/page-components/steps/RecipientsStep";
import { pageRender } from "test-utils";

// Mock the API hook
const mockGetRecipients = jest.fn();
const mockSendAddRecipientOtp = jest.fn();
const mockAddRecipient = jest.fn();

jest.mock("features/digikhata/hooks/useDigiKhataApi", () => {
	return {
		useDigiKhataApi: () => ({
			getRecipients: mockGetRecipients,
			isGettingRecipients: false,
			sendAddRecipientOtp: mockSendAddRecipientOtp,
			isSendingAddRecipientOtp: false,
			addRecipient: mockAddRecipient,
			isAddingRecipient: false,
		}),
	};
});

const renderWithContext = (ui: React.ReactElement, stateOverrides = {}) => {
	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		const defaultState =
			require("features/digikhata/context/types").initialState;
		return (
			<DigiKhataContext.Provider
				value={{
					state: { ...defaultState, ...stateOverrides },
					dispatch: jest.fn(),
				}}
			>
				{children}
			</DigiKhataContext.Provider>
		);
	};
	return pageRender(ui, { wrapper: Wrapper });
};

describe("RecipientsStep", () => {
	const mockMobile = "9999999999";
	const registeredRecipient = {
		recipient_id: 1,
		bank_recipient_id: 11,
		name: "Registered User",
		accountNumber: "123456789",
		ifsc: "TEST0000123",
		bankName: "Test Bank",
		accountType: "Bank Account",
		isVerified: true,
		mobile: "8888888888",
		recipientIdType: "acc_ifsc",
		beneficiary_id: 12345, // Valid beneficiary ID
	};

	const pendingRecipient = {
		recipient_id: 2,
		bank_recipient_id: 22,
		name: "Pending User",
		accountNumber: "987654321",
		ifsc: "TEST0000456",
		bankName: "Pending Bank",
		accountType: "Bank Account",
		isVerified: true,
		mobile: "7777777777",
		recipientIdType: "acc_ifsc",
		beneficiary_id: 0, // Invalid/Null beneficiary ID
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetRecipients.mockResolvedValue({
			data: {
				status: 0,
				data: {
					recipient_list: [
						{ ...registeredRecipient, is_verified: 1 },
						{ ...pendingRecipient, is_verified: 1 },
					],
				},
			},
		});
	});

	it("renders card-based UI and Add New Recipient button (no table)", async () => {
		await act(async () => {
			renderWithContext(<RecipientsStep mobile={mockMobile} />, {
				recipients: [registeredRecipient, pendingRecipient],
			});
		});

		// Check for Add New Recipient button
		expect(screen.getByText("Add New Recipient")).toBeInTheDocument();

		// Check for the "Add New Contact" card
		expect(screen.getByText("Add New Contact")).toBeInTheDocument();

		// Ensure it uses a card grid and NOT a Table component
		// Table usually has a 'table' tag or specific testing roles if it was there
		expect(screen.queryByRole("table")).not.toBeInTheDocument();

		// Wait for recipients to load
		expect(screen.getByText("Registered User")).toBeInTheDocument();
		expect(screen.getByText("Pending User")).toBeInTheDocument();

		// Check that the account number is masked
		expect(screen.getByText(/6789/)).toBeInTheDocument();
	});

	it("navigates to fund-transfer directly for recipient with beneficiary_id", async () => {
		renderWithContext(<RecipientsStep mobile={mockMobile} />, {
			recipients: [registeredRecipient, pendingRecipient],
		});

		expect(screen.getByText("Registered User")).toBeInTheDocument();

		// Find transfer buttons
		const transferButtons = screen.getAllByRole("button", {
			name: "Transfer Fund",
		});

		// Click transfer on the first recipient (registered)
		fireEvent.click(transferButtons[0]);

		// sendOtp should NOT be called
		expect(mockSendAddRecipientOtp).not.toHaveBeenCalled();
	});

	it("triggers OTP modal for recipient without beneficiary_id", async () => {
		mockSendAddRecipientOtp.mockResolvedValue({
			data: { status: 0, message: "Success" },
		});

		renderWithContext(<RecipientsStep mobile={mockMobile} />, {
			recipients: [registeredRecipient, pendingRecipient],
		});

		expect(screen.getByText("Pending User")).toBeInTheDocument();

		// Find transfer buttons
		const transferButtons = screen.getAllByRole("button", {
			name: "Transfer Fund",
		});

		// Click transfer on the second recipient (pending)
		await act(async () => {
			fireEvent.click(transferButtons[1]);
		});

		// sendOtp SHOULD be called
		expect(mockSendAddRecipientOtp).toHaveBeenCalledWith(
			expect.objectContaining({
				account: "987654321",
				ifsc: "TEST0000456",
				recipient_name: "Pending User",
			})
		);

		// OTP Modal should open
		expect(
			await screen.findByRole("button", { name: "Verify OTP" })
		).toBeInTheDocument();
	});
});
