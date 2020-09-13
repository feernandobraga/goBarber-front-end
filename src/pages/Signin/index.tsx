import React, { useRef, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
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

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        // we create a validation schema and pass the data from the from to it
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("You must enter an email")
            .email("Please enter a valid email address"),
          password: Yup.string().required("Please enter a password"),
        });

        // abortEarly: false is used so Yub doesn't stop at the first validation error and keeps going
        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push("/dashboard");
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
          title: "Error during authentication...",
          description: "username and password don't match",
        });
      }
    },
    [signIn, addToast, history]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Password" />

            <Button type="submit">LOGIN</Button>

            <Link to="/forgot-password">I forgot my password</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Sign Up!
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
