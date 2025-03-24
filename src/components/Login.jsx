import React, { useState } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setCookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Function to send OTP
  const handleEmailSubmit = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:4000/auth/login", { email });
      setOtpSent(true);
      console.log("OTP sent to:", email);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please verify your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP
  const handleOtpSubmit = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/auth/login-verify", { email, otp });
      
      // Extract token, userId, role, and tokenNumber from response
      const { token, userId } = res.data;

      // Set cookies and localStorage for session management
      setCookies("access_token", token);
      window.localStorage.setItem("userId", userId);
      
      // Navigate to home or dashboard after successful login
      navigate("/"); 
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      alert("Failed to verify OTP: " + (error.response?.data?.message || "Invalid OTP"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col md:flex-row">
      {/* Left Panel - Logo and Brand */}
      <div className="w-full md:w-1/2 bg-blue-900 flex flex-col justify-center items-center p-8 text-white">
        <div className="mb-8">
          <Shield size={80} strokeWidth={1.5} className="text-blue-300" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Forensic Vision </h1>
        <p className="text-xl text-blue-200 mb-6 text-center">Secure access to forensic tools and evidence management</p>
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-4">Secure Authentication</h2>
          <p className="text-blue-200 mb-3">
            This system uses multi-factor authentication to ensure only authorized personnel can access sensitive forensic data.
          </p>
          <div className="flex items-center mt-4 text-blue-300">
            <Lock size={20} className="mr-2" />
            <p>Protected by end-to-end encryption</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Secure Authentication</h2>
            <p className="text-gray-600 mt-2">Enter your credentials to access the system</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="official@forensics.gov"
                  disabled={otpSent || isLoading}
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-4 py-3 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? "Sending OTP..." : "Request Authentication Code"}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </button>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Authentication Code
                    </label>
                    <span className="text-sm text-blue-600">Sent to {email}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter 6-digit code"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center px-4 py-3 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                  {!isLoading && <CheckCircle size={18} className="ml-2" />}
                </button>
                
                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Use a different email address
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <Shield size={16} className="text-gray-500 mr-2" />
              <p className="text-sm text-gray-500">
                This is a secure system. All activities are logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;