import React, { useCallback, useRef, FormEvent, ChangeEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from "react-icons/fi";
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

import { Container, Content, AvatarInput } from "./styles";
import { useAuth } from "../../hooks/auth";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

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
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            // only validate if old_password is not blank
            is: (val) => !!val.length,
            then: Yup.string().required("New password can't be blank"),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when("old_password", {
              is: (val) => !!val.length,
              then: Yup.string().required("Please confirm your new password"),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref("password"), undefined], "Password don't match"),
        });

        // abortEarly: false is used so Yub doesn't stop at the first validation error and keeps going
        await schema.validate(data, {
          abortEarly: false,
        });

        // sending the user data to the server

        const { name, email, old_password, password, password_confirmation } = data;
        const formData = Object.assign(
          // will assign old_password, password and password_confirmation ONLY if old_password was provided
          {
            name,
            email,
          },
          old_password // if old_password is informed, append old_password, password and password_confirmation
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {} // if old_password is not informed, append an empty object
        );
        const response = await api.put("/profile", formData);
        updateUser(response.data); // updating the user on local storage
        history.push("/dashboard");

        addToast({
          type: "success",
          title: "Your profile was updated",
          description: "Your profile information has been successfully updated!",
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
          description: "Your profile was not updated, please try again later.",
        });
      }
    },
    [addToast, history]
  );

  const handleAvatarChange = useCallback(
    // function that updates the user avatar
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData(); //this creates a multipart formData (the same Insomnia uses to send files)

        data.append("avatar", e.target.files[0]); // avatar is the name used in the API to identify files in this route

        api.patch("/users/avatar", data).then((response) => {
          updateUser(response.data); // update the user in storage

          addToast({
            type: "success",
            title: "Your avatar has been updated!",
          });
        });
      }
    },
    [addToast, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              {/* to camouflage the input inside a button */}
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Profile</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="Email" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Current password"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirm new password"
          />

          <Button type="submit">Update profile</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default SignUp;
