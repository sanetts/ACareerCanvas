import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/MainSkill.css";
import "../Styles/App.css";

const MainSkill = () => {
  const navigate = useNavigate();
  const [skillData, setskillData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");
        const response = await fetch(
          `http://localhost/api/getskill.php?student_id=${studentId}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setskillData(data);
        } else {
          console.error("Error fetching skill data");
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
          <label for="inputEmail4">SKILL</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>

      {skillData.map((skillItem) => (
        <div key={skillItem.skill_id} className="row-grid">
          <div className="left-side-experience">
            <CheckBoxIcon />
          </div>

          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">Skill: </label>
              <span id="label1">{skillItem.skill_name}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="btn-row-skill" id="skills">
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
          onClick={() => navigate("/Skills")}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MainSkill;
