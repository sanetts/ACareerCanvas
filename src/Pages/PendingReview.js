import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/MainExperience.css";

const PendingReview = () => {
  const navigate = useNavigate();
  const [pendingEducationData, setPendingEducationData] = useState([]);
  const [pendingProjectData, setPendingProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingEducationData = async () => {
    try {
      const response = await fetch(
        "http://localhost/careercanvas/getPendingEducationData.php"
      );
      const data = await response.json();

      if (response.ok) {
        setPendingEducationData(data);
      } else {
        console.error("Error fetching pending education data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProjectData = async () => {
    try {
      const response = await fetch(
        "http://localhost/careercanvas/getPendingProjectData.php"
      );
      const data = await response.json();

      if (response.ok) {
        setPendingProjectData(data);
      } else {
        console.error("Error fetching pending education data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEducationData();
    fetchPendingProjectData();
  }, []);



  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="boarder-container">
      {pendingEducationData.map((educationItem) => (
        <div>
          <div className="form-student-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">EDUCATION</label>
            </div>
            <hr
              className="long-line"
              style={{ width: "100%", border: "1px solid black" }}
            />
          </div>
          <div key={educationItem.education_id} className="row-grid">
            <div className="left-side-experience">
              <CheckBoxIcon />
            </div>

            <div className="right-side">
              <div className="labels-container">
                <label htmlFor="label1">School :</label>
                <span id="label1">{educationItem.university_name}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">Program :</label>
                <span id="label1">{educationItem.program_of_study}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">Start Date :</label>
                <span id="label1">{educationItem.start_date}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">End Date :</label>
                <span id="label1">{educationItem.end_date}</span>
              </div>
            </div>

            <div>
              <button className="main-primary-btn">
                {educationItem.status}
              </button>
            </div>
          </div>
        </div>
      ))}

      {pendingProjectData.map((projectItem) => (
        <div>
          <div className="form-student-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">PROJECT</label>
            </div>
            <hr
              className="long-line"
              style={{ width: "100%", border: "1px solid black" }}
            />
          </div>

          <div key={projectItem.project_id} className="row-grid">
            <div className="left-side-experience">
              <CheckBoxIcon />
            </div>

            <div className="right-side">
              <div className="labels-container">
                <label htmlFor="label1">Project Name: </label>
                <span id="label1">{projectItem.project_name}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">Project Owner:</label>
                <span id="label1">{projectItem.project_owner}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">Start Date :</label>
                <span id="label1">{projectItem.start_date}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">End Date :</label>
                <span id="label1">{projectItem.end_date}</span>
              </div>

              <div className="labels-container">
                <label htmlFor="label1">Project Description :</label>
                <span id="label1">{projectItem.project_description}</span>
              </div>
            </div>

            <div>
              <button className="main-primary-btn">{projectItem.status}</button>
            </div>
          </div>
        </div>
      ))}

      
    </div>
  );
};

export default PendingReview;
