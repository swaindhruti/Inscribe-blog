import { Link } from "react-router-dom";
import { SignupInput } from "@swaindhruti/inscribe-common-modules";
import { useState } from "react";
import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="text-4xl font-bold leading-snug mb-1.5">
            {type === "signup"
              ? "Create an account"
              : "Welcome back Inscriber!"}
          </div>
          <div className="text-center text-slate-500 text-base mb-3">
            {type === "signup"
              ? "Already have an account? "
              : "New to Inscribe? "}
            <Link
              className="hover:text-slate-900 underline transition-colors duration-200"
              to={type === "signup" ? "/signin" : "/signup"}
            >
              {type === "signup" ? "Login" : "Join Us"}
            </Link>
          </div>
          {type === "signup" ? (
            <LabelledInput
              label="Name"
              placeholder="Name"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value,
                });
              }}
            />
          ) : null}
          <LabelledInput
            label="Email"
            placeholder="Email"
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                username: e.target.value,
              });
            }}
          />
          <LabelledInput
            label="Password"
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setPostInputs({
                ...postInputs,
                password: e.target.value,
              });
            }}
          />
          <button
            type="button"
            className="w-full text-white hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {type === "signup" ? "Sign Up and Inspire" : "Resume Writing"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputProps {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputProps) {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <input
          onChange={onChange}
          className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight"
          id="username"
          type={type || "text"}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
