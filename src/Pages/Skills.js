import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/App.css";
import "../Styles/WorkExperience.css";

const WorkExperience = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    job_title: "",
    organization_name: "",
    end_date: "",
    start_date: "",
    job_description: "",
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

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    if (!formData.student_id) {
      console.error("Missing student_id in formData");
      return;
    }

    try {
      const response = await fetch("http://localhost/api/experience.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response:", response);

      if (response.ok) {
        console.log(data.message);
        console.log("Data sent successfully", data);
      } else {
        console.error(data.error);
        console.error("Error sending data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="boarder-container">
      <div className="form-project-row">
        <div className="form-group col-md-6">
          <label htmlFor="job_title">Job Tittle</label>
          <input
            type="text"
            className="form-control"
            id="job_title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="organization_name">Organization Name</label>
          <input
            type="text"
            className="form-control"
            id="organization_name"
            name="organization_name"
            value={formData.organization_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-project-row">
        <div className="form-group col-md-6">
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            className="form-control"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-project-row">
        <div className="form-project-row">
          <div className="form-group col-md-6">
            <label htmlFor="job_description">Job Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              style={{ width: "900px", height: "100px" }}
            />
          </div>
        </div>
      </div>

      <input type="hidden" name="student_id" value={formData.student_id} />
      <div className="form-project-row">
        <div className="form-group col-md-6">
          <div className="moveUp">
            <h6>
              <Link to="/MainExperience"> Add New Experience Details </Link>
            </h6>
          </div>
        </div>
      </div>

      <div className="btn-row-work-form">
        <button type="button" className="main-primary-btn" onClick={handleSave}>
          save
        </button>
      </div>
    </div>
  );
};
export default WorkExperience;
