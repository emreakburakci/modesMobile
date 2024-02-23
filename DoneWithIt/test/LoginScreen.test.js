import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "./LoginScreen";

describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Check if input placeholders are rendered
    expect(getByPlaceholderText("Identity Number")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();

    // Check if login button is rendered
    expect(getByText("Login")).toBeTruthy();
  });

  it("handles input change correctly", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const identityInput = getByPlaceholderText("Identity Number");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(identityInput, "1234567890");
    fireEvent.changeText(passwordInput, "password123");

    expect(identityInput.props.value).toBe("1234567890");
    expect(passwordInput.props.value).toBe("password123");
  });

  // You can write more test cases to cover different scenarios
});
