import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/App.css";
import "../Styles/Activity.css";

const CoCurriculum = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activity_name: "",
    organization_name: "",
    start_date: "",
    end_date: "",
    description: "",
    student_id: "",
    descriptionone: "",
    descriptiontwo: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");

        if (studentId && !isNaN(studentId)) {
          const response = await fetch(
            `http://localhost/api/student.php?student_id=${studentId}`
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
        console.error("Error");
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
      const response = await fetch("http://localhost/api/curriculum.php", {
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
          <label htmlFor="activity_name">Co-Curriculum Activity</label>
          <input
            type="text"
            className="form-control"
            id="activity_name"
            name="activity_name"
            value={formData.activity_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="organization_name">Organization</label>
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
          <label htmlFor="start_date">Start Date (Month and Year)</label>
          <input
            type="text"
            className="form-control"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="end_date">End Date (Month and Year)</label>
          <input
            type="text"
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
            <label htmlFor="description">Co-Curriculum Description One</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-project-row">
          <div className="form-group col-md-6">
            <label htmlFor="descriptionone">
              Co-Curriculum Description Two
            </label>
            <input
              type="text"
              className="form-control"
              id="descriptionone"
              name="descriptionone"
              value={formData.descriptionone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-project-row">
          <div className="form-group col-md-6">
            <label htmlFor="descriptiontwo">
              Co-Curriculum Description Three
            </label>
            <input
              type="text"
              className="form-control"
              id="descriptiontwo"
              name="descriptiontwo"
              value={formData.descriptiontwo}
              onChange={handleChange}
            />
          </div>
        </div>

        <input type="hidden" name="student_id" value={formData.student_id} />
        <div className="form-project-row">
          <div className="form-group col-md-6">
            <div className="moveDown">
              <h6>
                <Link to="/save"> Add New Co-Curriculum </Link>
              </h6>
            </div>
          </div>
        </div>
      </div>

      <div className="btn-row-activity">
        <button type="button" className="main-primary-btn" onClick={handleSave}>
          save
        </button>
      </div>
    </div>
  );
};
export default CoCurriculum;
