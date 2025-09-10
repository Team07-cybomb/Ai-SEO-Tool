"use client"

import React, { useState, FormEvent } from "react";
import Link from "next/link";
const SignupPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt with:", { name, email, password });
  };

  return (
    <div className="flex items-center justify-center  min-h-screen bg-blue-50 p-4">
      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">


        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground ml-2">
            SEO Audit Pro
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">Create an account</h1>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow duration-200"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow duration-200"
          />
          <input
            type="password"
            placeholder=" Re-Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow duration-200"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full font-semibold transition-transform transform hover:scale-105 duration-200 shadow-lg hover:bg-emerald-500 cursor-pointer"
          >
            Sign up
          </button>
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
