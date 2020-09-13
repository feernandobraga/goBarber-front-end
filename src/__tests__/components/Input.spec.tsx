import React from "react";

import Input from "../../components/Input";
import { render, fireEvent, waitFor } from "@testing-library/react";

// mocking the unform lib to be able to mock the useField() function
jest.mock("@unform/core", () => {
  return {
    useField() {
      return {
        fieldName: "email",
        defaultValue: "",
        error: "",
        registerField: jest.fn(),
      };
    },
  };
});

describe("Input component", () => {
  it("should be able to render the input component", () => {
    const { getByPlaceholderText } = render(<Input name="email" placeholder="Email" />);

    expect(getByPlaceholderText("Email")).toBeTruthy(); // request that the component exists - Truthy is basically anything that returns true like 1, not null, true
  });
  //
  it("should highlight the component when it get focus", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />
    );

    const inputElement = getByPlaceholderText("Email"); // getting the reference for the input
    const containerElement = getByTestId("input-container"); // getting the reference for the input container

    fireEvent.focus(inputElement); // set focus to the input

    await waitFor(() => {
      expect(containerElement).toHaveStyle("border-color: #ff9000"); // check if the container changed colour
      expect(containerElement).toHaveStyle("color: #ff9000"); // check if the font changed color
    });

    fireEvent.blur(inputElement); // set focus away from the input

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle("border-color: #ff9000"); // check if the container changed colour
      expect(containerElement).not.toHaveStyle("color: #ff9000"); // check if the font changed color
    });
  });
  //
  it("should keep input border highlighted after data is entered and focus is lost", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />
    );

    const inputElement = getByPlaceholderText("Email"); // getting the reference for the input
    const containerElement = getByTestId("input-container"); // getting the reference for the input container

    // fire the event onChange and change the result of event.target.value
    fireEvent.change(inputElement, {
      // fill the input with some information
      target: { value: "johndoe@example.com" },
    });

    fireEvent.blur(inputElement); // set focus away from the input

    await waitFor(() => {
      expect(containerElement).toHaveStyle("color: #ff9000"); // check if the font changed color
    });
  });
  //
});
