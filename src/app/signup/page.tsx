"use client";
 
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
 
// Base URL of your Express backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
 
const SignupPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
 
  // Handle social login redirects and token storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
 
    if (token) {
      localStorage.setItem("token", token);
      router.push("/profile");
    }
  }, [router]);
 
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isLoginMode) {
      setLoginFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors({}); // Clear errors on change
  };
 
  // Handle traditional form validation (for signup and login)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
    if (!isLoginMode && !signupFormData.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    if (!isLoginMode && !signupFormData.password.trim()) {
      newErrors.password = "Password is required.";
    }
    if (isLoginMode && !loginFormData.password.trim()) {
      newErrors.password = "Password is required.";
    }
 
    const emailToValidate = isLoginMode
      ? loginFormData.email
      : signupFormData.email;
    if (!emailRegex.test(emailToValidate)) {
      newErrors.email = "Please enter a valid email address.";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  // Handle traditional sign-up form submission
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupFormData),
      });
 
      const data = await res.json();
      if (res.ok) {
        alert("User created successfully!");
        setIsLoginMode(true); // Switch to login mode after successful signup
      } else {
        alert(data.msg || "Error signing up.");
      }
    } catch (error) {
      alert("Error signing up.");
    }
  };
 
  // Handle traditional login form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });
 
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        router.push("/profile");
      } else {
        alert(data.msg || "Login failed.");
      }
    } catch (error) {
      alert("Error logging in.");
    }
  };
 
  // Handlers for social sign-in buttons (simple redirects)
  const handleSocialLogin = (provider: "google" | "github") => {
    window.location.href = `${API_URL}/api/auth/${provider}`;
  };
 
  const socialButtonClass =
    "flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-full font-semibold transition-transform transform hover:scale-105 duration-200 cursor-pointer shadow-md";
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLoginMode ? "Login to your Account" : "Create an Account"}
        </h2>
 
        {/* Traditional Form */}
        <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-4">
          {!isLoginMode && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupFormData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}
 
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={isLoginMode ? loginFormData.email : signupFormData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
 
          {!isLoginMode && (
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={signupFormData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          )}
 
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={isLoginMode ? loginFormData.password : signupFormData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
 
          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            {isLoginMode ? "Login" : "Sign Up"}
          </button>
        </form>
 
        <p className="text-center text-sm mt-4">
          {isLoginMode ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsLoginMode(false)}
                className="text-emerald-600 cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsLoginMode(true)}
                className="text-emerald-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
 
        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
 
        {/* Social Sign-in Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin("google")}
            className={socialButtonClass}
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
              <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Sign {isLoginMode ? "in" : "up"} with Google
          </button>
          <button
            onClick={() => handleSocialLogin("github")}
            className={socialButtonClass}
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 64 64">
              <path d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"></path>
            </svg>
            Sign {isLoginMode ? "in" : "up"} with Github
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default SignupPage;
 