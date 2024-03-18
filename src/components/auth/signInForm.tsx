"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignInForm = () => {
  return (
    <div>
      <h1>Signin Page</h1>
      <br />
      <Button onClick={() => signIn("azure-ad", { callbackUrl: "/profile" })}>
        Sign in with AzureAD
      </Button>
    </div>
  );
};

export default SignInForm;
