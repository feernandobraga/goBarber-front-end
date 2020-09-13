import React, { useRef, useCallback, useState } from "react";
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
import api from "../../services/api";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        // we create a validation schema and pass the data from the from to it
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("You must enter an email")
            .email("Please enter a valid email address"),
        });

        // abortEarly: false is used so Yub doesn't stop at the first validation error and keeps going
        await schema.validate(data, {
          abortEarly: false,
        });

        // password recover

        await api.post("/password/forgot", {
          email: data.email,
        });

        addToast({
          type: "success",
          title: "Password recover email was sent",
          description:
            "We've sent you an email to reset your password, please check your inbox.",
        });

        // history.push("/dashboard");
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
          title: "Error during password recover...",
          description:
            "Something went wrong with your password recover... Try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>
            <Input name="email" icon={FiMail} placeholder="Email" />

            <Button loading={loading} type="submit">
              Recover
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
