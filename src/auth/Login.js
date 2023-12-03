import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    role: "student", // Default role is set to "student"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // State to store user's role

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const authenticateUser = async () => {
    const { email, password, role } = data;

    try {
      const response = await axios.post(
        "http://localhost/careercanvas/login.php",
        { email, password, role }
      );

      if (
        response.status === 200 &&
        response.data.message.includes("Logged in")
      ) {
        console.log("Login successful");

        // Extract and set user's role
        const userRole = response.data.role;
        setUserRole(userRole);

        // Set user ID and role in sessionStorage
        sessionStorage.setItem("userId", response.data.user_id);
        sessionStorage.setItem("userRole", userRole);

        // Redirect based on role
        switch (userRole) {
          case "student":
            navigate("/studentprofile");
            break;
          case "cpa":
            navigate("/cpaprofile");
            break;
          default:
            console.error("Invalid role");
        }
      } else {
        setError("Invalid email, password, or role. Please try again.");
        console.error("Login failed");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Call the authenticateUser function
    authenticateUser();
  };

  return (
    <div className="main-box">
      <form onSubmit={submitForm}>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Login</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <h6>
              Do not have an account? <Link to="/register">Sign Up</Link>
            </h6>
          </div>
        </div>

        <div className="row">
          <div className="row-md-6">Email </div>
          <div className="row-md-6">
            <input
              type="text"
              name="email"
              className="form-control"
              onChange={handleChange}
              value={data.email}
            />
          </div>
        </div>

        <div className="row">
          <div className="row-md-6">Password</div>
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

        <div className="row">
          <div className="row-md-6">Role</div>
          <div className="row-md-6">
            <select
              name="role"
              className="form-control"
              onChange={handleChange}
              value={data.role}
            >
              <option value="student">Student</option>
              <option value="cpa">Career Peer Advisor</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <h6>
              <Link to="/">Forget password</Link>
            </h6>
          </div>
        </div>

        {error && (
          <div className="row">
            <div className="col-md-12 text-center text-danger">{error}</div>
          </div>
        )}

        <div className="row">
          <div className="col-md-12">
            <input
              type="submit"
              name="Submit"
              value={loading ? "Logging in..." : "Login"}
              className="btn btn-success"
              disabled={loading}
            />
          </div>
        </div>

        {userRole && (
          <div className="row">
            <div className="col-md-12 text-center">
              <p>Logged in as: {userRole}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
