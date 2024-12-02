import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./AadharVerification.css";

const AadharVerification = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 12) setAadharNumber(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
  };

  const generateOtp = async () => {
    try {
      const response = await axios.post("https://sandbox.aadhaarkyc.io/api/aadhaar/generate-otp", {
        aadhaar: aadharNumber,
      });

      if (response.status === 200) {
        setIsOtpSent(true);
        setMessage("OTP sent successfully.");
      } else {
        setMessage(response.data.message || "Failed to generate OTP.");
      }
    } catch (err) {
      console.error("Error generating OTP:", err);
      setMessage(err.response?.data?.message || "Error generating OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("https://sandbox.aadhaarkyc.io/api/aadhaar/verify-otp", {
        aadhaar: aadharNumber,
        otp,
      });

      if (response.status === 200) {
        setIsVerified(true);
        setMessage("Aadhaar verified successfully.");
      } else {
        setMessage(response.data.message || "Failed to verify OTP.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage(err.response?.data?.message || "Error verifying OTP. Please try again.");
    }
  };

  const validateAadhar = async () => {
    try {
      const response = await axios.post("https://sandbox.aadhaarkyc.io/api/aadhaar/validate", {
        aadhaar: aadharNumber,
      });

      if (response.status === 200) {
        setMessage(`Aadhaar is valid. Details: ${JSON.stringify(response.data)}`);
      } else {
        setMessage(response.data.message || "Failed to validate Aadhaar.");
      }
    } catch (err) {
      console.error("Error validating Aadhaar:", err);
      setMessage(err.response?.data?.message || "Error validating Aadhaar. Please try again.");
    }
  };

  return (
    <div className="aadhar-verification">
      <h1>Aadhaar Verification</h1>
      <div className="input-group">
        <label>
          Aadhaar Number:
          <input
            type="text"
            value={aadharNumber}
            onChange={handleAadharChange}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength="12"
          />
        </label>
        <button onClick={generateOtp} disabled={aadharNumber.length !== 12}>
          Generate OTP
        </button>
      </div>

      {isOtpSent && (
        <div className="input-group">
          <label>
            OTP:
            <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter 6-digit OTP" maxLength="6" />
          </label>
          <button onClick={verifyOtp} disabled={otp.length !== 6}>
            Verify OTP
          </button>
        </div>
      )}

      {isVerified && (
        <div className="input-group">
          <button onClick={validateAadhar}>
            Validate Aadhaar
          </button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AadharVerification;
