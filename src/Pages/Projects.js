import "../Styles/Projects.css";
import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const Projects = () =>
{
  const [formData, setFormData] = useState({
    projectName: "",
    projectOwner: "",
    startDate: "",
    endDate: "",
    student_id: "",
    projectDescription:"",
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
  }, []); // Update the dependency array

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
      const response = await fetch(
        "http://localhost/careercanvas/project.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

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
          <label htmlFor="inputEmail4">Project Name</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="inputEmail">Project Owner</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            name="projectOwner"
            value={formData.projectOwner}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-project-row">
        <div className="form-group col-md-6">
          <label htmlFor="inputEmail4">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="inputEmail4"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="inputEmail">End Date</label>
          <input
            type="date"
            className="form-control"
            id="inputEmail4"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-project-row">
        <div className="form-project-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail4">Project Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="projectDescription"
              style={{ width: "990px", height: "100px" }}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-project-row">
          <div className="form-group col-md-6">
            <div className="moveDown">
              <h6>
                <Link to="/save"> Add New Project</Link>
              </h6>
            </div>
          </div>
        </div>

        <div className="btn-row-project-form">
          <button type="submit" className="main-primary-btn">
            cancel
          </button>
          <button
            type="button"
            className="main-primary-btn"
            onClick={handleSave}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
};
export default Projects;
