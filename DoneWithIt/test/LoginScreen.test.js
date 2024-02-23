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

  // You can write more test cases to cover different scenarios
});
