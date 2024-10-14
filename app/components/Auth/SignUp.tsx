"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheckCircle } from "react-icons/ai"; 
import { styles } from "../../../app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import Verification from "./Verification"; 

type Props = {
  setRoute: (route: string) => void;
};


const schema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name!")
    .min(2, "Name must be at least 2 characters long.")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces."),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string()
    .required("Please enter your password!")
    .min(8, "Password must be at least 8 characters long.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .matches(/[0-9]/, "Password must contain at least one number.")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character."),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();
  const [isLoading, setIsLoading] = useState(false); 
  const [isVerificationVisible, setVerificationVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setVerificationVisible(true); 
      setIsLoading(false); 
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
      setIsLoading(false); 
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      setIsLoading(true); 
      const data = { name, email, password };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      {!isVerificationVisible ? (
        <>
          <h1 className={`${styles.title}`}>Join to SMART WASTE MNGT SYS</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 relative">
              <label className={`${styles.label}`} htmlFor="name">
                Enter your Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                id="name"
                placeholder="john doe"
                className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
              />
              
              {touched.name && !errors.name && (
                <AiOutlineCheckCircle className="absolute right-2 top-10 text-green-500" size={20} />
              )}
              {errors.name && touched.name && (
                <span className="text-red-500 pt-2 block">{errors.name}</span>
              )}
            </div>
            <label className={`${styles.label}`} htmlFor="email">
              Enter your Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="smartwastemangement@gmail.com"
              className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
            />
            
            {touched.email && !errors.email && (
              <AiOutlineCheckCircle className="absolute right-2 top-10 text-green-500" size={20} />
            )}
            {errors.email && touched.email && (
              <span className="text-red-500 pt-2 block">{errors.email}</span>
            )}
            <div className="w-full mt-5 relative mb-1">
              <label className={`${styles.label}`} htmlFor="password">
                Enter your password
              </label>
              <input
                type={!show ? "password" : "text"}
                name="password"
                value={values.password}
                onChange={handleChange}
                id="password"
                placeholder="pAssword123@%"
                className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
              />
              {!show ? (
                <AiOutlineEyeInvisible
                  className="absolute bottom-3 right-2 z-1 cursor-pointer"
                  size={20}
                  onClick={() => setShow(true)}
                />
              ) : (
                <AiOutlineEye
                  className="absolute bottom-3 right-2 z-1 cursor-pointer"
                  size={20}
                  onClick={() => setShow(false)}
                />
              )}
              
              {touched.password && !errors.password && (
                <AiOutlineCheckCircle className="absolute right-2 top-10 text-green-500" size={20} />
              )}
            </div>
            {errors.password && touched.password && (
              <span className="text-red-500 pt-2 block">{errors.password}</span>
            )}
            <div className="w-full mt-5">
              <input type="submit" value={isLoading ? "Loading..." : "Sign Up"} className={`${styles.button}`} disabled={isLoading} />
            </div>
            <br />
          </form>
          <br />
          <h5>
            Go back to{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setRoute("Login")}
            >
              Login
            </span>
          </h5>
        </>
      ) : (
        <Verification setRoute={setRoute} />
      )}
    </div>
  );
};

export default Signup;
