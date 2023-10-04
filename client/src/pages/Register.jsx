import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import {Logo, FormRow, SubmitBtn} from "../components";
import custonFetch from "../utils/custonFetch";

import { Form, redirect, Link } from "react-router-dom";

import {toast} from "react-toastify"

// Get the form submit data.
export const action = async ({request}) => {
  
  const formData = await request.formData()
  const data = Object.fromEntries(formData);

  try {

    await custonFetch.post("/auth/register", data);

    toast.success("Registration successfull.");
    
    return redirect("/login");

  } catch (error) {

    toast.error(error?.response?.data.msg);
    
    return error;

  };
};


const Register = () => {

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo/>
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last name"/>
        <FormRow type="text" name="location"/>
        <FormRow type="email" name="email"/>
        <FormRow type="password" name="password"/>
        <SubmitBtn/>
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;