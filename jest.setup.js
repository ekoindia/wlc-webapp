import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => mockRouter);
// This is needed for mocking 'next/link':
jest.mock("next/dist/client/router", () => mockRouter);
