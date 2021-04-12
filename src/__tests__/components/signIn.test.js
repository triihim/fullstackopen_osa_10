import React from "react";
import { SignInForm } from "../../components/SignIn";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {

      const onSubmitMock = jest.fn();

      const { debug, getByTestId } = render(<SignInForm onSubmit={onSubmitMock} />);

      debug();

      fireEvent.changeText(getByTestId("usernameInput"), "testusername");
      fireEvent.changeText(getByTestId("passwordInput"), "testpassword");
      fireEvent.press(getByTestId("signInSubmit"));

      await waitFor(() => {
        expect(onSubmitMock.mock.calls[0][0]).toEqual({
          username: "testusername",
          password: "testpassword"
        });
      });

    });
  });
});