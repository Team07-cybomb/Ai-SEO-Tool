"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "@/components/Utils/alert-util";
import { useUser } from "@/components/context/UserContext"; // ✅ context
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useUser(); // ✅ use context setter

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.push("/");
    }
  }, [router]);

  const handleNext = async (e: FormEvent) => {
    e.preventDefault();

    if (!showPassword) {
      setShowPassword(true);
    } else {
      if (email && password) {
        try {
          const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (res.ok) {
  localStorage.setItem("token", data.token);

  // ✅ update context immediately
  if (data.user) {
    setUser(data.user);
  } else {
    // fallback: fetch profile if login API only returns token
    const meRes = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      setUser(meData);
    }
  }

  showSuccessAlert("Login successful!");
  router.push("/");
}
 else {
            showWarningAlert(data.msg || "Invalid credentials");
          }
        } catch (error) {
          showErrorAlert("Error logging in");
        }
      } else {
        showWarningAlert("Please enter both email and password!");
      }
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    window.location.href = `${API_URL}/api/auth/${provider}`;
  };

  const socialButtonClass =
    "flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-full font-semibold transition-transform transform hover:scale-105 duration-200 cursor-pointer shadow-md";

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
        {/* Logo and Title */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
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
          <span className="text-xl font-bold text-gray-900 ml-2">
            SEO Audit Pro
          </span>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">Sign in</h1>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-4">
          <input
            type="text"
            placeholder="Phone, email, or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

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

          <AnimatePresence mode="wait">
            <motion.button
              key={showPassword ? "login" : "next"}
              type="submit"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-500 cursor-pointer"
            >
              {showPassword ? "Login" : "Next"}
            </motion.button>
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {showPassword && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mt-4"
            >
              <Link
                href="/forgotpassword"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Forgotten your password?
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-emerald-600 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin("google")}
            className={socialButtonClass}
          >
            {/* Google Icon */}
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("github")}
            className={socialButtonClass}
          >
            {/* Github Icon */}
            Continue with Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
