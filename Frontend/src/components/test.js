import React, { useState } from "react";
import axios from "axios";
import "./AadharVerification.css";

const AadhaarVerificationPage = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/adhar/adhar", {
        aadharNumber: aadhaarNumber,
      });

      if (response.data.message === "OTP sent successfully.") {
        // Store the client ID for OTP verification
        sessionStorage.setItem("clientId", response.data.client_id);
        setIsOtpSent(true);
        setErrorMessage("");
        alert("OTP sent to your registered mobile number.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const clientId = sessionStorage.getItem("clientId");

      if (!clientId) {
        setErrorMessage("Client ID not found. Please resend OTP.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/adhar/verifyAadhaarOtp",
        {
          clientId: clientId,
          OTP: otp,
        }
      );

      if (response.data.message === "Aadhaar verification successful.") {
        setIsVerified(true);
        setErrorMessage("");
        setSuccessMessage("Aadhaar verification completed successfully.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div>
      <h1>Aadhaar Verification</h1>
      {!isOtpSent && (
        <div>
          <label>
            Aadhaar Number:
            <input
              type="text"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter your Aadhaar number"
            />
          </label>
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}

      {isOtpSent && !isVerified && (
        <div>
          <label>
            Enter OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
            />
          </label>
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}

      {isVerified && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AadhaarVerificationPage;
