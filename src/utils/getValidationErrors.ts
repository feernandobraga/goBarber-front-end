// import so I can type the error the function gets
import { ValidationError } from "yup";

// interface to type the function's return
// the key keyword says that the key can be anything as long as it is a string. It can also be multiple strings
interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    /**
     * this creates an object like
     * {
     *    componentName: 'error message'
     * }
     */
    validationErrors[error.path] = error.message;
    /**
     * the return of this function will look like this:
     * email: "You must enter an email"
     * name: "You must enter an email"
     * password: "Password needs to be at least 6 characters"
     */
  });

  return validationErrors;
}
