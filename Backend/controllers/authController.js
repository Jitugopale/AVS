import bcrypt from "bcrypt"
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
const JWT_SECRET = process.env.JWT_SECRET;
import axios from 'axios';


export const createUserController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        fname: req.body.fname,
        Lname: req.body.Lname,
        Address: req.body.Address,
        PhoneNo: req.body.PhoneNo,
        email: req.body.email,
        password: secPass,
        City: req.body.City,
      });

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

export const loginController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password Comparison:", passwordCompare); // Should print true if matching

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); // Return the user details without the password
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}

// Controller to handle Aadhaar OTP
// Controller to handle Aadhaar OTP
export const aadhaarOtpController = async (req, res) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ message: "Aadhar number is required" });
  }

  try {
    // Generate Token using the helper function
    const token = createToken();
    console.log(token)

    // Send OTP request to Aadhaar verification API
    const otpResponse = await axios.post(
      'https://api.verifya2z.com/api/v1/verification/aadhaar_sendotp',
      { id_number: aadharNumber },
      {
        headers: {
          'Token': token,
          // 'Authorization': `Bearer ${token}` ,
          'User-Agent': 'CORP0000363',
        }
      }
    );

    if (otpResponse.status === 200) {
      // If OTP generation is successful, create JWT token
      const otpToken = jwt.sign(
        { client_id: otpResponse.data.data.client_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        message: "OTP sent successfully.",
        token: otpToken,  // Return the JWT token
        client_id: otpResponse.data.data.client_id,
      });
    } else {
      return res.status(500).json({ message: "Failed to generate OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error generating OTP. Please try again."
    });
  }
};

// Helper function to create a token for Aadhaar OTP
function createToken() {
  const secretKey = "UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5";
  const symmetricKey = Buffer.from(secretKey, 'utf8');
  const unixTimeStamp = Math.floor(Date.now() / 1000);

  // Creating JWT token
  const token = jwt.sign(
    { timestamp: unixTimeStamp, partnerId: 'CORP0000363', reqid: '1111' },
    symmetricKey,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  return token;
}



export const verifyAadhaarOtpController = async (req, res) => {
  const { clientId, OTP } = req.body;

  if (!clientId || !OTP) {
    return res.status(400).json({ message: "Client ID and OTP are required" });
  }

  try {
    // Get token from headers or request body
    const token = createToken();
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token using the same secret used during signing
    const secretKey = "UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5"; // Ensure this is the same secret key
    jwt.verify(token, Buffer.from(secretKey, 'utf8'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Signature verification failed" });
      }
      
      // Proceed with OTP verification if token is valid
      verifyOtp(clientId, OTP, token, res);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
};

// Function to handle OTP verification request
async function verifyOtp(clientId, OTP, token, res) {
  try {
    const otpVerifyResponse = await axios.post(
      'https://api.verifya2z.com/api/v1/verification/aadhaar_verifyotp',
      { client_id: clientId, otp: OTP },
      {
        headers: {
          'Token': token,  // The same token is sent here for verification
          'User-Agent': 'CORP0000363'
        }
      }
    );
    console.log('OTP Verification Response:', otpVerifyResponse.data);


    if (otpVerifyResponse.data.statuscode === 200 && otpVerifyResponse.data.status === true) {
      // OTP verified successfully, now load Aadhaar data
      const aadhaarData = otpVerifyResponse.data;
      return res.json({
        message: "Aadhaar verification successful.",
        aadhaarData,
      });
    } else {
      return res.status(400).json({ message: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
}

