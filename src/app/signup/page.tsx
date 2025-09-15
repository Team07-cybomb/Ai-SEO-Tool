"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
 
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
 
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const router = useRouter();
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  // ✅ Validation function
  const validateForm = () => {
    const newErrors: { email?: string; phone?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
 
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
 
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
 
    if (!validateForm()) return;
 
    try {
      // ✅ add a fallback to 5000 so it works locally even if .env isn't loaded
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
 
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
 
      if (res.ok) {
        alert("User created successfully!");
        router.push("/profile");
      } else {
        // ✅ Show backend validation errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || "Error signing up");
        }
      }
    } catch (error) {
      alert("Error signing up");
    }
  };
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default SignupPage;