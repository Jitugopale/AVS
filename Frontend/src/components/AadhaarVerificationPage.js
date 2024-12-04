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
  const [aadhaarDetails, setAadhaarDetails] = useState(null);


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
        setAadhaarDetails(response.data.aadhaarData.data); // Assuming aadhaarData contains the details
        console.log(response.data.aadhaarData.data)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="aadhaar-verification">
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
<center>
      {isVerified && (
        <div>
          <p style={{ color: "green" }}>{successMessage}</p>
          {aadhaarDetails && (
            <div className="details-section">
            <h3>Aadhaar Details:</h3>
            
            <h4>Profile Photo:</h4>
            <img
              src={`data:image/jpeg;base64,${aadhaarDetails.profile_image}`}
              alt="Aadhaar Profile"
              style={{ width: "150px", height: "150px", borderRadius: "5%" }}
            />
            <p>Name: {aadhaarDetails.full_name}</p>
            <p>Gender: {aadhaarDetails.gender}</p>
            <p>DOB: {aadhaarDetails.dob}</p>
            <h4>Address: </h4>
            {aadhaarDetails.address && (
               <div className="address-details">
               <p><strong>House:</strong> {aadhaarDetails.address.house}</p>
               <p><strong>Street:</strong> {aadhaarDetails.address.street}</p>
               <p><strong>Landmark:</strong> {aadhaarDetails.address.landmark}</p>
               <p><strong>Locality:</strong> {aadhaarDetails.address.loc}</p>
               <p><strong>Post:</strong> {aadhaarDetails.address.po}</p>
               <p><strong>Sub-district:</strong> {aadhaarDetails.address.subdist}</p>
               <p><strong>District:</strong> {aadhaarDetails.address.dist}</p>
               <p><strong>State:</strong> {aadhaarDetails.address.state}</p>
               <p><strong>Country:</strong> {aadhaarDetails.address.country}</p>
               <p><strong>Pin:</strong> {aadhaarDetails.zip}</p>
             </div>
              )}
            
            

          </div>
          
          )}
        </div>
        
      )}
</center>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AadhaarVerificationPage;
