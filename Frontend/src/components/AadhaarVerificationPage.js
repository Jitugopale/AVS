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
      const response = await axios.post("https://deploy-app-y4fy.onrender.com/api/adhar/adhar", {
        aadharNumber: aadhaarNumber,
      });

      if (response.data.message === "OTP sent successfully.") {
        sessionStorage.setItem("clientId", response.data.client_id);
        setIsOtpSent(true);
        setErrorMessage("");
        setSuccessMessage("OTP sent to your registered mobile number.");
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
        "https://deploy-app-y4fy.onrender.com/api/adhar/verifyAadhaarOtp",
        {
          clientId: clientId,
          OTP: otp,
        }
      );

      if (response.data.message === "Aadhaar verification successful.") {
        setIsVerified(true);
        setErrorMessage("");
        setSuccessMessage("Aadhaar verification completed successfully.");
        setAadhaarDetails(response.data.aadhaarData.data);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="aadhaar-verification">
      <div className="verification-card">
        <h1>Aadhaar Verification</h1>

        {/* Aadhaar Number Field */}
        <div className="form-group">
          <label>Aadhaar Number:</label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="Enter your Aadhaar number"
            disabled={isOtpSent || isVerified}
          />
        </div>

        {/* OTP Field */}
        {isOtpSent && !isVerified && (
          <div className="form-group">
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="button-group">
          {!isOtpSent && !isVerified && <button onClick={handleSendOtp}>Send OTP</button>}
          {isOtpSent && !isVerified && <button onClick={handleVerifyOtp}>Verify OTP</button>}
        </div>

        {/* Verification Result */}
        {isVerified && (
          <div>
            <p style={{ color: "green" }}>{successMessage}</p>
            {aadhaarDetails && (
              <div className="details-section">
                <h3 style={{textAlign:'center'}}>Aadhaar Details:</h3>
                <div style={{textAlign:'center'}}>
                  <img
                    src={`data:image/jpeg;base64,${aadhaarDetails.profile_image}`}
                    alt="Aadhaar Profile"
                    style={{ width: "150px", height: "150px", borderRadius: "5%" }}
                  />
                </div>
                <div style={{marginLeft: '15px',marginTop: '20px',border: '2px solid black',padding: '15px',backgroundColor: '#FFFACD', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'}}>
                    <p><strong>Aadhaar Number:</strong> {aadhaarNumber}</p>
                    <p><strong>Name: </strong>{aadhaarDetails.full_name}</p>
                    <p><strong>Gender:</strong> {aadhaarDetails.gender}</p>
                    <p><strong>DOB:</strong> {aadhaarDetails.dob}</p>
                    {/* <p>
                    <strong>Address:</strong>
                      {`${aadhaarDetails.address.house}, ${aadhaarDetails.address.street}, ${aadhaarDetails.address.landmark}, ${aadhaarDetails.address.loc},`}<br />
                      {`${aadhaarDetails.address.po}, ${aadhaarDetails.address.subdist}, ${aadhaarDetails.address.dist}, ${aadhaarDetails.address.state}, ${aadhaarDetails.address.country}, ${aadhaarDetails.zip}`}
                    </p> */}
                    <p>
                      <strong>Address: </strong> 
                      {[
                        aadhaarDetails.address.house,
                        aadhaarDetails.address.street,
                        aadhaarDetails.address.landmark,
                        aadhaarDetails.address.loc,
                        aadhaarDetails.address.po,
                        aadhaarDetails.address.subdist,
                        aadhaarDetails.address.dist,
                        aadhaarDetails.address.state,
                        aadhaarDetails.address.country,
                        aadhaarDetails.address.zip,
                      ]
                        .filter(Boolean) 
                        .join(", ")}     
                    </p>
                </div>
                
                {/* {aadhaarDetails.address && (
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
              )} */}
                
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AadhaarVerificationPage;
