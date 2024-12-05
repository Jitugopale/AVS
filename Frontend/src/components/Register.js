import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },

  heading: {
    fontSize: "2rem",
    color: "#4A90E2", 
    marginBottom: "20px",
    fontWeight: "bold",
  },

  formControl: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '15px',
    transition: 'border-color 0.3s ease-in-out',
  },

  formControlFocus: {
    borderColor: "#4A90E2", 
    outline: "none",
    boxShadow: "0 0 5px rgba(74, 144, 226, 0.6)",
  },

  label: {
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333",
    marginRight:'460px'
  },

  btn: {
    backgroundColor: "#4A90E2",
    color: "white",
    fontSize: "1.1rem",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    marginTop: "15px",
  },

  btnHover: {
    backgroundColor: "#357ABD",
  },

  btnDisabled: {
    backgroundColor: "#A3C4E2",
    cursor: "not-allowed",
  },

  alert: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  alertDanger: {
    backgroundColor: "#F8D7DA",
    color: "#721C24",
  },

  alertSuccess: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },

  mt3p: {
    fontSize: "1rem",
  },

  mt3a: {
    color: "#4A90E2",
    textDecoration: "none",
  },

  mt3aHover: {
    textDecoration: "underline",
  },

  formGroupInputFocus: {
    backgroundColor: "#f9f9f9",
  },

  formGroupInputFocusPlaceholder: {
    color: "transparent",
  },

  formGroup: {
    marginBottom: "20px",
  },

  controller: {
    padding: "12px",
    fontSize: "1rem",
  },

  mt3: {
    marginTop: "1rem",
  },

  mt3pBottom: {
    fontSize: "1rem",
    marginTop: "10px",
  },
};


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    Lname: "",
    Address: "",
    PhoneNo: "",
    email: "",
    password: "",
    City: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 
  const [clickedFields, setClickedFields] = useState({
    fname: false,
    Lname: false,
    Address: false,
    PhoneNo: false,
    email: false,
    password: false,
    City: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/createUser",
        formData
      );

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setError(""); 
        setFormData({
          fname: "",
          Lname: "",
          Address: "",
          PhoneNo: "",
          email: "",
          password: "",
          City: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(
          response.data.error || "Registration failed. Please try again."
        );
        setSuccess("");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.errors?.[0]?.msg ||
            error.response.data.error ||
            "Error during registration. Please check your details and try again."
        );
      } else {
        setError("Network error. Please try again later.");
      }
      setSuccess(""); 
    } finally {
      setLoading(false); 
    }
  };

  const handleInputClick = (field) => {
    setClickedFields((prev) => ({
      ...prev,
      [field]: true, 
    }));
  };

  return (
    <div className="container contain-1 mt-5" style={styles.container}>
      <h2 className="heading" style={styles.heading}>Register</h2>
      {error && (
        <div className="alert stand stand-danger alert-danger" style={{ ...styles.alert, ...styles.alertDanger }}>{error}</div>
      )}
      {success && (
        <div className="alert stand stand-success alert-success"  style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={styles.formGroup}>
          <label htmlFor="fname">
            {clickedFields.fname ? "First Name" : ""}
          </label>
          <input
            type="text"
            className="form-control controller"
            id="fname"
            name="fname"
            onClick={() => handleInputClick("fname")}
            placeholder={clickedFields.fname ? "" : "First Name"}
            value={formData.fname}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Lname">
            {clickedFields.Lname ? "Last Name" : ""}
          </label>
          <input
            type="text"
            className="form-control controller"
            id="Lname"
            name="Lname"
            onClick={() => handleInputClick("Lname")}
            placeholder={clickedFields.Lname ? "" : "Last Name"}
            value={formData.Lname}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Address">
            {clickedFields.Address ? "Address" : ""}
          </label>
          <input
            type="text"
            className="form-control controller"
            id="Address"
            name="Address"
            onClick={() => handleInputClick("Address")}
            placeholder={clickedFields.Address ? "" : "Address"}
            value={formData.Address}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="PhoneNo">
            {clickedFields.PhoneNo ? "Phone Number" : ""}
          </label>
          <input
            type="text"
            className="form-control controller"
            id="PhoneNo"
            name="PhoneNo"
            onClick={() => handleInputClick("PhoneNo")}
            placeholder={clickedFields.PhoneNo ? "" : "Phone Number"}
            value={formData.PhoneNo}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="email">{clickedFields.email ? "Email" : ""}</label>
          <input
            type="email"
            className="form-control controller"
            id="email"
            name="email"
            onClick={() => handleInputClick("email")}
            placeholder={clickedFields.email ? "" : "Email"}
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">
            {clickedFields.password ? "Password" : ""}
          </label>
          <input
            type="password"
            className="form-control controller"
            id="password"
            name="password"
            onClick={() => handleInputClick("password")}
            placeholder={clickedFields.password ? "" : "Password"}
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="City">{clickedFields.City ? "City" : ""}</label>
          <input
            type="text"
            className="form-control controller"
            id="City"
            name="City"
            onClick={() => handleInputClick("City")}
            placeholder={clickedFields.City ? "" : "City"}
            value={formData.City}
            onChange={handleChange}
            required
            style={styles.formControl}
          />
        </div>
        <button
          type="submit"
          className="btn bn bn-primary btn-primary"
          style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-3" style={styles.mt3}>
        <p style={styles.mt3pBottom}>
          Already registered? <Link to="/login" style={styles.mt3a}>Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
