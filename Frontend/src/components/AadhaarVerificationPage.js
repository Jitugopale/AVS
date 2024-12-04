import React, { useState } from "react";
import axios from "axios";
import "./AadharVerification.css";

const AadharVerification = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Aadhaar number input
  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numeric input
    if (value.length <= 12) setAadharNumber(value);
  };

  // Handle OTP input
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numeric input
    if (value.length <= 6) setOtp(value);
  };

  // Generate OTP
  const generateOtp = async () => {
    try {
      // Send the Aadhaar number to the backend to generate OTP
      const response = await axios.post("http://localhost:5000/api/adhar/adhar", {
        aadharNumber,
      });

      if (response.status === 200) {
        setIsOtpSent(true);
        setMessage("OTP sent successfully. Please check your registered mobile number.");
        
        // Store the clientId from the response in sessionStorage
        sessionStorage.setItem("clientId", response.data.client_id);
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred while sending OTP.");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const clientId = sessionStorage.getItem("clientId");

      if (!clientId) {
        setMessage("Client ID not found. Please request OTP first.");
        return;
      }

      // Send OTP and clientId to backend for verification
      const response = await axios.post("http://localhost:5000/api/adhar/verifyAadhaarOtp", {
        clientId,
        OTP: otp,
      });

      if (response.data.status === 200 && response.data.message === "Aadhaar Verify successfully.") {
        setIsVerified(true);
        setMessage("Aadhaar verified successfully.");
      } else {
        setMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred while verifying OTP.");
    }
  };

  return (
    <div className="aadhar-verification-container">
      <h1>Aadhaar Verification</h1>
      <div>
        <label>Aadhaar Number:</label>
        <input
          type="text"
          value={aadharNumber}
          onChange={handleAadharChange}
          maxLength="12"
          placeholder="Enter your Aadhaar number"
        />
      </div>
      {!isOtpSent ? (
        <button onClick={generateOtp}>Generate OTP</button>
      ) : (
        <>
          <div>
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              placeholder="Enter OTP"
            />
          </div>
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      <p>{message}</p>
      {isVerified && <p>Aadhaar verification is successful!</p>}
    </div>
  );
};

export default AadharVerification;
