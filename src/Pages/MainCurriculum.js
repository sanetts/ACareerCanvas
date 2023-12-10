import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/App.css";
import "../Styles/MainCurriculum.css";

const MainCurriculum = () => {
  const navigate = useNavigate();
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");

        const response = await fetch(
          `http://localhost/api/getcurriculum.php?student_id=${studentId}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setCurriculumData(data);
        } else {
          console.error("Error fetching curriculum data");
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
          <label for="inputEmail4">EXTRA CURRICULUM ACTIVITIES</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>

      {curriculumData.map((curriculumItem) => (
        <div key={curriculumItem.curriculum_id} className="row-grid">
          <div className="left-side-curr">
            <CheckBoxIcon />
          </div>

          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">Organization :</label>
              <span id="label1">{curriculumItem.organization_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Activity :</label>
              <span id="label1">{curriculumItem.activity_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">{curriculumItem.start_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">{curriculumItem.end_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Description :</label>
              <span id="label1">{curriculumItem.description}</span>
            </div>

            <div>
              <button className="main-primary-btn">Approved</button>
            </div>
          </div>
        </div>
      ))}
      <div className="btn-row-education">
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
          onClick={() => navigate("/activities")}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MainCurriculum;
