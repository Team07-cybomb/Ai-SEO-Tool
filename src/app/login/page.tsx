"use client"
import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (!showPassword) {
      setShowPassword(true);
    } else {
      console.log("Login attempt with:", { email, password });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 transition-colors duration-200"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>

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
        <h1 className="text-3xl font-bold text-center mb-6">Sign in</h1>
        
        {/* Form */}
        <form onSubmit={handleNext} className="space-y-4">
          {/* Email input */}
          <input
            type="text"
            placeholder="Phone, email, or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

          {/* Animated password field */}
          <AnimatePresence>
            {showPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Button */}
          <AnimatePresence mode="wait">
            <motion.button
              key={showPassword ? "login" : "next"}
              type="submit"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-500"
            >
              {showPassword ? "Login" : "Next"}
            </motion.button>
          </AnimatePresence>
        </form>

        {/* Forgot password */}
        <AnimatePresence>
          {showPassword && (
            <motion.button
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="w-full py-3 mt-4 px-4 border border-gray-300 text-gray-900 rounded-full font-semibold hover:scale-105 transition-transform hover:bg-gray-100 shadow-lg"
            >
              Forgot password?
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sign-up link */}
        <p className="mt-8 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="text-emerald-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
