import React, { createContext, useCallback, useContext, useState } from "react";
import { uuid } from "uuidv4";

// import the toast container to be available when the hook is called
import ToastContainer from "../components/ToastContainer";

// interface for the method that we will be able to call for this hook
interface ToastContextData {
  addToast(message: Omit<ToastMessage, "id">): void;
  removeToast(id: string): void;
}

// interface to store the toast message
export interface ToastMessage {
  id: string;
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
}

// we create the ToastContext as the type of the interface and initiate it as an empty toast
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// the provider is the component so it can wrap other components that need to use the context/hook
const ToastProvider: React.FC = ({ children }) => {
  // state to store/handle toast messages
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  /**
   * callback function that is responsible for adding a Toast
   * receives type title and description, but adds an id.
   * then it creates a new object and add it to the state array of messages through setMessages
   */
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, "id">) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    []
  );

  /**
   * callback function to remove a toast. It receives the toast id that was displayed and filters it out from the array
   */
  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// this is to enable to useToast() to be called and then handle the hook functions
function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast() must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, useToast };
