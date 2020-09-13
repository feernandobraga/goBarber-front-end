import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth";
import { waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "../../services/api";

const apiMock = new MockAdapter(api); //creates a MockAdapter using the real API

describe("Auth hook", () => {
  it("should be able to sign in", async () => {
    const apiResponse = {
      // the response we want to be returned by the mockAPI
      user: {
        id: "user123",
        name: "John Doe",
        email: "johndoe@example.com",
      },
      token: "token-123",
    };

    apiMock.onPost("sessions").reply(200, apiResponse); // every post call on /session will return success(200) and the user and token

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem"); // this is to call the method setItem that uses local storage

    // result will contain the methods from the hook
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      // triggering the signIn method
      email: "johndoe@example.com",
      password: "123456",
    });

    await waitForNextUpdate(); // since we change an state in the real hook, we need to use asynchronous methods to wait for it

    // we expect that the methods that access the storage are called
    expect(setItemSpy).toHaveBeenCalledWith("@GoBarber:token", apiResponse.token);
    expect(setItemSpy).toHaveBeenCalledWith(
      "@GoBarber:user",
      JSON.stringify(apiResponse.user)
    );

    expect(result.current.user.email).toEqual("johndoe@example.com");
  });
  //
  it("should restore saved data from storage when auth inits", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      switch (key) {
        case "@GoBarber:token":
          return "torken-123";
        case "@GoBarber:user":
          return JSON.stringify({
            id: "user123",
            name: "John Doe",
            email: "johndoe@example.com",
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual("johndoe@example.com");
  });
  //
  it("should be able to sign out", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      switch (key) {
        case "@GoBarber:token":
          return "torken-123";
        case "@GoBarber:user":
          return JSON.stringify({
            id: "user123",
            name: "John Doe",
            email: "johndoe@example.com",
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });
  //
  it("should be able to update the user data", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: "user123",
      name: "John Doe",
      email: "johndoe@example.com",
      avatar_url: "http://mockavatar.com/fake.jpg",
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith("@GoBarber:user", JSON.stringify(user));
    expect(result.current.user).toEqual(user);
  });
  //
});
