import React, { useCallback, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiUser } from "react-icons/fi";
import api from "../../services/api";

import logoImg from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

// import function that get errors from forms
import getValidationErrors from "../../utils/getValidationErrors";

// import for form validation
// imports everything from yup as a variable called Yup
import * as Yup from "yup";

//import to handle forms
import { FormHandles } from "@unform/core";

// importing unform
import { Form } from "@unform/web";

// import toast for messages
import { useToast } from "../../hooks/toast";

import { Container, Content, Background, AnimationContainer } from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        // we create a validation schema and pass the data from the from to it
        const schema = Yup.object().shape({
          name: Yup.string().required("You must enter a name"),
          email: Yup.string()
            .required("You must enter an email")
            .email("Please enter a valid email address"),
          password: Yup.string().min(6, "At least 6 characters"),
        });

        // abortEarly: false is used so Yub doesn't stop at the first validation error and keeps going
        await schema.validate(data, {
          abortEarly: false,
        });

        // sending the user data to the server
        await api.post("/users", data);
        history.push("/");

        addToast({
          type: "success",
          title: "User registered successfully...",
          description: "Please sign in with your credentials",
        });
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
          title: "Something went wrong...",
          description: "This user could not be registered. Try again!",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Password" />

            <Button type="submit">REGISTER</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Profile;
