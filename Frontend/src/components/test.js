import React, { useState } from "react";
import axios from "axios";
import "./AadharVerification.css";

const AadharVerification = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [aadharDetails, setAadharDetails] = useState(null);

  // Handle input for Aadhaar number
  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 12) setAadharNumber(value);
  };

  // Handle input for OTP
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 6) setOtp(value);
  };

  // Generate OTP after Aadhaar verification
  const generateOtp = async () => {
    try {
      // Step 1: Verify Aadhaar
      const verifyResponse = await axios.post("http://localhost:5000/api/VerifyAadhar", {
        AadharNumber: aadharNumber,
      });

      if (verifyResponse.status === 200) {
        // Aadhaar verified successfully
        try {
          // Step 2: Generate OTP
          const otpResponse = await axios.post(
            "https://sandbox.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp",
            { id_number: aadharNumber }
          );

          if (otpResponse.status === 200) {
            setIsOtpSent(true);
            setMessage("OTP sent successfully.");
            sessionStorage.setItem("clientid", otpResponse.data.data.client_id);
            sessionStorage.setItem("ismobile", otpResponse.data.data.is_mobile);
          } else {
            setMessage("Failed to generate OTP.");
          }
        } catch (otpError) {
          setMessage(
            otpError.response?.data?.message || "Error generating OTP. Please try again."
          );
        }
      } else {
        setMessage(verifyResponse.data.message || "Aadhaar verification failed.");
      }
    } catch (verifyError) {
      setMessage(
        verifyError.response?.data?.message || "An error occurred during Aadhaar verification."
      );
    }
  };

  // Verify OTP and validate Aadhaar
  const verifyOtp = async () => {
    try {
      // Step 1: Submit OTP
      const submitOtpResponse = await axios.post(
        "https://sandbox.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp",
        {
          client_id: sessionStorage.getItem("clientid"),
          otp: otp,
          mobile_number: sessionStorage.getItem("ismobile"),
        }
      );

      if (submitOtpResponse.status === 200) {
        // Step 2: Validate Aadhaar
        const validateAadharResponse = await axios.post(
          "https://sandbox.aadhaarkyc.io/api/v1/aadhaar-validation/aadhaar-validation",
          { id_number: aadharNumber }
        );

        if (validateAadharResponse.status === 200) {
          const data = validateAadharResponse.data.data;
          setMessage("Aadhaar validated successfully.");
          setAadharDetails(data);
          setIsVerified(true);

          // Save Aadhaar data
          try {
            const saveAadharResponse = await axios.post(
              "proxy/api/SaveAadhar",
              {
                AadharNumber: data.aadhaar_number,
                Name: data.full_name,
                AgeRange: data.age_range,
                IsMobile: data.is_mobile,
                MobileLastDigit: data.last_digits,
                Gender: data.gender,
                Address: data.address,
                District: data.dist,
                State: data.state,
                Zip: data.zip,
                Country: data.country,
                ClientId: data.client_id,
                VerifiedBy: sessionStorage.getItem("user"),
              }
            );

            if (saveAadharResponse.status === 200) {
              setMessage("Aadhaar details saved successfully.");
            }
          } catch (saveError) {
            setMessage("Error saving Aadhaar details.");
          }
        } else {
          setMessage("Aadhaar validation failed.");
        }
      } else {
        setMessage("OTP validation failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="aadhar-verification">
      <h1>Aadhaar Verification</h1>

      {/* Aadhaar Input */}
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

      {/* OTP Input */}
      {isOtpSent && (
        <div className="input-group">
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />
          </label>
          <button onClick={verifyOtp} disabled={otp.length !== 6}>
            Verify OTP
          </button>
        </div>
      )}

      {/* Validation Success */}
      {isVerified && aadharDetails && (
        <div className="details-section">
          <h3>Aadhaar Details:</h3>
          <p>Name: {aadharDetails.full_name}</p>
          <p>Gender: {aadharDetails.gender}</p>
          <p>DOB: {aadharDetails.dob}</p>
          <p>Address: {aadharDetails.address}</p>
          <p>State: {aadharDetails.state}</p>
          <p>District: {aadharDetails.district}</p>
          <p>ZIP: {aadharDetails.zip}</p>
        </div>
      )}

      {/* Message Display */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AadharVerification;
