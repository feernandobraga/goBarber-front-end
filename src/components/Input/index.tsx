import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Container, Error } from "./styles";
import { IconBaseProps } from "react-icons"; // this is so we can get the properties for the icon we are passing, like size from example
import { useField } from "@unform/core";
import { FiAlertCircle } from "react-icons/fi";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // this will make name mandatory (it's optional by default)
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>; // since we are passing an icon as a component, we can use ComponentType
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  /**
   * from now on, every time we have a function inside the component, we will use useCallback() to handle it, instead of creating a function
   * The callback works in the same way of the useEffect.
   * It takes two params:
   *  1. the function it will execute
   *  2. a parameter that will trigger the callback when its value changes
   * This function will check if there's a value inside the input, after losing focus.
   */
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    if (inputRef.current?.value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName, // the name given to the input field i.e. <Input name="First Name">
      ref: inputRef.current, // the reference from the DOM
      path: "value", // retrieves the value entered by the user in the input field
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {/* if there's an form validation error, display the tooltip */}
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
