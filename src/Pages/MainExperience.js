import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/App.css";
import "../Styles/MainExperience.css";

const MainExperience = () => {
  const navigate = useNavigate();

  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");

        const response = await fetch(
          `http://localhost/api/getExperience.php?student_id=${studentId}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setExperienceData(data);
        } else {
          console.error("Error fetching experience data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <div className="boarder-container">
      <div className="form-student-row">
        <div className="form-group col-md-6">
          <label for="inputEmail4">EXPERIENCE</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>

      {experienceData.map((experienceItem) => (
        <div div key={experienceItem.experience_id} className="row-grid">
          <div className="left-side-experience">
            <CheckBoxIcon />
          </div>

          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">School :</label>
              <span id="label1">{experienceItem.job_title}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Program :</label>
              <span id="label1">{experienceItem.organization_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">{experienceItem.start_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">{experienceItem.end_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Description :</label>
              <span id="label1">{experienceItem.job_description}</span>
            </div>
          </div>

          <div className="approval-status">
            <button className="main-primary-btn">Approved</button>
          </div>
        </div>
      ))}

      <div className="btn-row-exp">
        <button type="submit" className="main-primary-btn">
          cancel
        </button>
        <button type="submit" className="main-primary-btn">
          edit
        </button>
        <button type="submit" className="main-primary-btn">
          delete
        </button>
        <button
          type="submit"
          className="main-primary-btn"
          onClick={() => navigate("/WorkExperience")}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MainExperience;
