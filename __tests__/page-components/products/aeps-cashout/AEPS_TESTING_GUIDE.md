# AEPS Cashout Flow - Complete Testing Guide

## Overview
The AEPS (Aadhaar Enabled Payment System) cashout flow is a multi-step transaction flow that handles agent withdrawals through various payment methods. This guide covers testing the entire flow.

## AEPS Flow Steps (in order)
1. **Provider Selection** - Select payment provider (e.g., Fingpay)
2. **Fingpay Status Check** - Verify provider activation & capture location
3. **Choose Device** - Select fingerprint/device for authentication
4. **Complete KYC** - Verify agent identity documents
5. **Daily Auth** - Agent re-verifies identity once per day
6. **Payment Mode** - Select payment method (Aadhaar FP, Bank Account, etc.)
7. **Search Customer** - Look up customer/agent details
8. **OTP Verification** - Enter OTP for transaction confirmation (if amount > threshold)
9. **Cashout Form** - Enter withdrawal amount and details
10. **Result Screen** - Show transaction status (success/pending/retry/error)

## Quick Manual Testing

### 1. Start the Dev Server
```bash
npm run dev
```
- Connects to local backend on `http://127.0.0.1:8001`
- Visit `http://localhost:3002`
- Login as Agent

### 2. Navigate to AEPS Product
- From dashboard, select AEPS Cashout product
- Should land on **Provider Selection** screen

### 3. Test Each Step

#### Step 1: Provider Selection
- [ ] See provider options (usually "Fingpay")
- [ ] Click to select a provider
- [ ] Should advance to next step

#### Step 2: Fingpay Status Check
- [ ] If location not captured yet, see "Location Required" message
- [ ] Location capture should appear (GPS or manual input)
- [ ] After location captured, should check Fingpay activation status
- [ ] Spinner shows while checking

#### Step 3: Choose Device
- [ ] See device options (e.g., fingerprint scanner models)
- [ ] Select a device
- [ ] Proceed to next step

#### Step 4: Complete KYC
- [ ] Review KYC requirements
- [ ] Upload/verify documents if needed
- [ ] Confirm KYC completion

#### Step 5: Daily Auth
- [ ] Scan Aadhaar fingerprint
- [ ] Verify identity
- [ ] May skip if already authenticated today

#### Step 6: Payment Mode
- [ ] See payment options (Aadhaar FP, Bank Account)
- [ ] Select payment mode
- [ ] Proceed with selected mode

#### Step 7: Search Customer
- [ ] Enter customer mobile number
- [ ] Click search
- [ ] See customer details if found

#### Step 8: OTP Verification (if amount > ₹10,000)
- [ ] Receive OTP
- [ ] Enter OTP in verification form
- [ ] Verify success

#### Step 9: Cashout Form
- [ ] Enter withdrawal amount
- [ ] Enter beneficiary details
- [ ] Review transaction summary
- [ ] Confirm transaction

#### Step 10: Result Screen
- [ ] See transaction status: SUCCESS, PENDING, RETRY, or ERROR
- [ ] View transaction ID and details
- [ ] Option to new transaction or return to dashboard

## Unit Tests

### Run Tests
```bash
# Run all AEPS tests
npm run test:quick -- page-components/products/aeps-cashout

# Run specific test file
npm run test:quick -- AepsCashout.test.tsx

# Run with coverage
npm test -- --coverage page-components/products/aeps-cashout
```

### Current Test Coverage
- `AepsCashout.test.tsx` - Main component & flow initialization
- `components/FingpayStatus.test.tsx` - Location capture & status check
- `components/ProviderSelect.test.tsx` - Provider selection logic

### Test Files to Add
- `components/SearchCustomer.test.tsx`
- `components/OtpVerification.test.tsx`
- `components/CashoutForm.test.tsx`
- `components/ResultScreen.test.tsx`
- `context/AepsContext.test.tsx`
- `hooks/useAepsState.test.tsx`

## Common Issues & Troubleshooting

### Issue: "Location is required before checking Fingpay status"
**Solution:** 
- Click "Allow" when browser requests location permission
- Or manually enter latitude/longitude in location capture form
- Coordinates must be valid decimal format (e.g., 28.6139, 77.209)

### Issue: "Fingpay activation check failed"
**Solution:**
- Verify backend API is running (`http://127.0.0.1:8001`)
- Check `.env.local` has correct API endpoint
- Check internet connection
- View browser Network tab for API error details

### Issue: "Customer not found"
**Solution:**
- Verify customer mobile number is correct and registered
- Check if customer completed KYC verification
- Try with test customer data from backend team

### Issue: "OTP verification failed"
**Solution:**
- Enter correct OTP from SMS
- OTP expires after 10 minutes, request new one if needed
- Check phone number is correct

### Issue: "Transaction pending - no final status"
**Solution:**
- This is normal for some payment methods
- Check backend for transaction status updates
- May show as "success" after settlement (1-2 days)

## API Debugging

### Check Network Requests
1. Open **DevTools** → **Network** tab
2. Filter for requests to `api.connect.eko.in` or `127.0.0.1:8001`
3. Look for calls to:
   - `ekoicici/v2/request` - Main AEPS interaction endpoint
   - `ekoicici/v2/request/aadhaar/pubkey` - Get RSA public key
   - `ekoicici/v2/request/otp/verify` - OTP verification

### Check Console Logs
1. Open **DevTools** → **Console** tab
2. Look for debug messages (if `NEXT_PUBLIC_DEBUG=true` in `.env.local`)
3. Check for errors or warnings

### Check Backend Logs
```bash
# If using local Connect backend
tail -f /path/to/backend/logs/access.log
tail -f /path/to/backend/logs/error.log
```

## Performance Testing

### Measure Page Load
```bash
npm run scan  # Starts perf monitoring on port 3006
```

### Check Component Render Performance
- Open DevTools → Performance tab
- Start recording
- Perform AEPS flow actions
- Stop recording and analyze flame chart

## Security Testing Notes

### RSA Encryption
- Aadhaar data is RSA-encrypted before sending to API
- Public key fetched from backend for each session
- Verify in Network tab that `enc_pub_key` is present in responses

### Session Tokens
- Flow requires valid `access_token` (stored in SessionStorage)
- Token auto-refreshed via `useRefreshToken` hook
- If token expires, flow should re-authenticate

## Backend Mock Data Setup

For local testing, backend can return mock responses:

```bash
# Example: Set mock customer in backend
curl -X POST http://127.0.0.1:8001/test/mock/customer \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "name": "Test Agent",
    "aadhar": "1234567890123456"
  }'
```

## Test Data Template

### Agent Account
- **Mobile:** 9876543210
- **Aadhaar:** 1234-5678-9012-3456
- **Device:** Morpho MSO300 (or equivalent)
- **Location:** 28.6139°N, 77.209°E (Delhi, India)

### Test Amounts
- **Small:** ₹500 (no OTP required)
- **Medium:** ₹5,000 (no OTP required)
- **Large:** ₹15,000 (OTP required for amounts > ₹10,000)

### Test Mobile Numbers
- **Valid:** 919876543210
- **Invalid:** 119876543210 (wrong country code)
- **Unregistered:** 919999999999 (not in system)

## Continuous Integration

Tests are run on each commit via GitHub Actions:

```bash
# Pre-commit hook
npm run lint && npm run test:quick

# In CI pipeline
npm run test:coverage
npm run lint:error
```

## Resources

- **Flow Documentation:** `docs/aeps-cashout-flow.md`
- **API Contracts:** `page-components/products/aeps-cashout/contracts.ts`
- **Constants/Mappings:** `page-components/products/aeps-cashout/constants.ts`
- **Context Logic:** `page-components/products/aeps-cashout/context/AepsContext.tsx`
- **Services:** `page-components/products/aeps-cashout/services/aepsService.ts`

## Reporting Issues

When reporting AEPS issues, include:
1. **Step where issue occurred** (e.g., "OTP Verification")
2. **Expected vs actual behavior**
3. **API error message** (from DevTools Network)
4. **Backend logs** (if available)
5. **Screenshots/recordings** (helpful for UI issues)
6. **Test data used** (mobile, amount, etc.)
7. **Environment** (dev/staging/prod)
