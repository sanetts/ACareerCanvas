import { useState } from "react";
import "../Styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "student", // Default role as 'student'
    invitationCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    console.log(value); // Log the current value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !data.first_name ||
      !data.last_name ||
      !data.email ||
      !data.password ||
      (data.role === "cpa" && !data.invitationCode) // Validate invitation code only if role is CPA
    ) {
      console.error("All fields are required");
      return;
    }
    

    try {
      // Validate the invitation code if the role is CPA
      if (data.role === "cpa") {
        const validateInvitationResponse = await axios.post(
          "http://localhost/careercanvas/validate_invitation.php",
          {
            invitationCode: data.invitationCode,
            email: data.email,
          }
        );
          
        if (
          validateInvitationResponse.status !== 200 ||
          !validateInvitationResponse.data.valid
        ) {
          console.log(validateInvitationResponse.data.valid);
          console.log("Invitation Code:", data.invitationCode);
          console.error("Invalid invitation code or email");
          return;
        }
      }

      // Proceed with registration
      const response = await axios.post(
        "http://localhost/careercanvas/register.php",
        data
      );

      if (response.status === 200) {
        
        console.log("Data sent successfully");
        navigate("/login");
      } else {
        console.error("Error sending data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="main-box">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Create an account</h1>
          </div>
        </div>

        <div className="row">
          <div className="row-md-6"> First Name</div>
          <div className="row-md-6">
            <input
              type="text"
              name="first_name"
              className="form-control"
              onChange={handleChange}
              value={data.first_name}
            />
          </div>
        </div>

        <div className="row">
          <div className="row-md-6"> Last Name</div>
          <div className="row-md-6">
            <input
              type="text"
              name="last_name"
              className="form-control"
              onChange={handleChange}
              value={data.last_name}
            />
          </div>
        </div>

        <div className="row">
          <div className="row-md-6"> Email</div>
          <div className="row-md-6">
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              value={data.email}
            />
          </div>
        </div>

        <div className="row">
          <div className="row-md-6"> Password</div>
          <div className="row-md-6">
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              value={data.password}
            />
          </div>
        </div>

        {/* New Role Field */}
        <div className="row">
          <div className="row-md-6"> Role</div>
          <div className="row-md-6">
            <select
              name="role"
              className="form-control"
              onChange={handleChange}
              value={data.role}
            >
              <option value="student">Student</option>
              <option value="cpa">cpa</option>
            </select>
          </div>
        </div>

        {/* New Invitation Code Field (conditional rendering) */}
        {data.role === "cpa" && (
          <div className="row">
            <div className="row-md-6"> Invitation Code</div>
            <div className="row-md-6">
              <input
                type="text"
                name="invitationCode"
                className="form-control"
                onChange={handleChange}
                value={data.invitationCode}
              />
            </div>
          </div>
        )}

        <div className="row">
          <button
            type="submit"
            name="Submit"
            value="Sign Up"
            className="btn btn-success"
          >
            Save
          </button>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <h6>
              Already have an account ? <Link to="/login"> Login </Link>
            </h6>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
