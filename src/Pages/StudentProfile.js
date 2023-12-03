import React, { useState, useEffect } from "react";
import "../Styles/App.css";
import "../Styles/StudentProfile.css";

import profile from "../Assets/profile.JPG";
import { Link, useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    githubUsername: "",
    linkedInProfile: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    address: "",
    student_id: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");

        if (studentId && !isNaN(studentId)) {
          const response = await fetch(
            `http://localhost/careercanvas/student.php?student_id=${studentId}`
          );

          if (response.ok) {
            const data = await response.json();
            setFormData((prevData) => ({
              ...prevData,
              ...data,
              student_id: parseInt(studentId),
            }));
          } else {
            console.error("Error fetching student data");
          }
        } else {
          console.error("Invalid or missing studentId in sessionStorage");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    if (!formData.student_id) {
      console.error("Missing student_id in formData");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/careercanvas/student.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        console.log("Data sent successfully");
        navigate("/education");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div className="boarder-container">
      <div className="row-container">
        <div className="left-side">
          <div className="profile-picture-box">
            <img className="profile-picture" src={profile} alt="Profile" />
          </div>
          <h6 className="">
            <Link to="/">Change profile pic</Link>
          </h6>
        </div>

        <div className="right-side">
          <form onSubmit={handleSubmit}>
            <div className="form-student-row">
              {/* <div className="form-group col-md-6">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div> */}

              {/* <div className="form-group col-md-6">
    <label htmlFor="lastName">Last Name</label>
    <input
      type="text"
      className="form-control"
      id="lastName"
      name="lastName" 
      value={formData.lastName}
      onChange={handleChange}
    />
  </div> */}
            </div>

            <div className="form-student-row">
              <div className="form-group col-md-6">
                <label htmlFor="githubUsername">GitHub</label>
                <input
                  type="text"
                  className="form-control"
                  id="githubUsername"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="linkedInProfile">LinkedIn</label>
                <input
                  type="text"
                  className="form-control"
                  id="linkedInProfile"
                  name="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-student-row">
              <div className="form-group col-md-6">
               <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                /> 
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="phoneNumber">Contact</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-student-row">
              <div className="form-group col-md-6">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group col-md-6" id="address">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                style={{ width: "735px", height: "60px" }}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>

      <input type="hidden" name="student_id" value={formData.student_id} />
      <div className="btn-row">
        <button type="button" className="main-primary-btn">
          Cancel
        </button>
        <button
          type="submit"
          className="main-primary-btn"
          onClick={handleSubmit}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
