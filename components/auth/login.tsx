"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import checkLogin from "@/helpers/check-login";

export const Login = () => {
  const router = useRouter();

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      
     apiClient.post("/v1/auth/admin-login", values).then((response)=>{

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", response.data.token.access.token);
      }
       
        router.replace("/");
      }).catch((err)=>{
        console.log(err)
      })
      // `values` contains email & password. You can use provider to connect user

      //await createAuthCookie();
      
    },
    [router]
  );

  const loadData = async () =>{
    let isLoggedIn = await checkLogin()
    if(isLoggedIn)
      router.push("/")
  }

  useEffect(()=>{
    loadData()
  },[])

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Login</div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='Email'
                type='email'
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
              />
              <Input
                variant='bordered'
                label='Password'
                type='password'
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant='flat'
              color='primary'>
              Login
            </Button>
          </>
        )}
      </Formik>

      {/* <div className='font-light text-slate-400 mt-4 text-sm'>
        Don&apos;t have an account ?{" "}
        <Link href='/register' className='font-bold'>
          Register here
        </Link>
      </div> */}
    </>
  );
};
