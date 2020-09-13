import React, { createContext, useCallback, useState, useContext } from "react";

// importing the API
import api from "../services/api";

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

// interface to handle credentials
interface SignInCredentials {
  email: string;
  password: string;
}

// the information we will store about a certain API call
// this information is going to be accessible by other components/pages
interface AuthContextData {
  user: User; // the user logged in
  signIn(credentials: SignInCredentials): Promise<void>; // signIn method
  signOut(): void; // signOut method
  updateUser(user: User): void; // function that updates the avatar
}

// interface to store user information into localStorage
interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// this function create a hook that we use to simplify the way we call the context from other pages.
// from other pages they only need to import useAuth() from this context file
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

/**
 * The strategy here is to create a component that work as a wrapper for other components that need to access the Context API
 * Hence why we use children props (so we can just return/bypass it back).
 * The component then returns AuthContext.Provider (which makes the data from the API call available)
 * and passes a method, in this case signIn() to any component wrapped by AuthProvider
 * <AuthProvider> can be found in the App.tsx wrapping the pages that need information from the user Authenticated
 */
export const AuthProvider: React.FC = ({ children }) => {
  // instead of pre-setting the value of this state manually, we call a function that sets the initial value to either
  // the stored token and user, or null
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@GoBarber:token");
    const user = localStorage.getItem("@GoBarber:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`; // this will be sent with all API calls if the user refresh the page
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  // a call back function that receives email and password from the caller, and sends the request to the API
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("/sessions", {
      email,
      password,
    });

    // storing the JWT and the user into local storage
    const { token, user } = response.data;

    localStorage.setItem("@GoBarber:token", token);
    localStorage.setItem("@GoBarber:user", JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`; // this will be sent with all API calls once the user have signed in

    setData({ token, user });
  }, []);

  // function/callback for logout - delete the user from local storage and from the context
  const signOut = useCallback(() => {
    localStorage.removeItem("@GoBarber:token");
    localStorage.removeItem("@GoBarber:user");
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem("@GoBarber:user", JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token]
  );

  return (
    /* AuthContext.Provider is what makes the context available by other components wrapped by it */
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
