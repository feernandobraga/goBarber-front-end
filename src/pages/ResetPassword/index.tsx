import React, { useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";

import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";

// import for form validation
import * as Yup from "yup";

// auxiliary function to get validation errors and display to the user
import getValidationErrors from "../../utils/getValidationErrors";

// import useAuth to retrieve information from the API
import { useAuth } from "../../hooks/auth";

// import the toast hook to make the toast functions available
import { useToast } from "../../hooks/toast";

import logoImg from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";
import api from "../../services/api";

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        // we create a validation schema and pass the data from the from to it
        const schema = Yup.object().shape({
          password: Yup.string().required("Please enter a password"),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password"), undefined],
            "Passwords don't match"
          ),
        });

        // abortEarly: false is used so Yub doesn't stop at the first validation error and keeps going
        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace("?token=", ""); // retrieve the token from the url (?token=asd123-asd1-123)and remove the ?token part of it

        if (!token) {
          throw new Error();
        }

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token,
        });

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          // this function attributes error messages based on what input field triggered the validation error
          formRef.current?.setErrors(errors);

          // to return before running the toast
          return;
        }

        addToast({
          type: "error",
          title: "Reset Password Error",
          description: "Something went wrong when we tried to reset your password.",
        });
      }
    },
    [addToast, history, location]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset your password</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New Password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Password Confirmation"
            />
            <Button type="submit">Change Password</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
