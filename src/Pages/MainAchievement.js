import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/MainAchievement.css";
import "../Styles/App.css";

const MainAchievement = () => {
  const navigate = useNavigate();
  const [achievementData, setachievementData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("studentId");

        const response = await fetch(
          `http://localhost/api/getachievement.php?student_id=${studentId}`
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setachievementData(data);
        } else {
          console.error("Error fetching Achievement data");
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
          <label for="inputEmail4">ACHIEVEMENT</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>

      {achievementData.map((achievementItem) => (
        <div key={achievementItem.achievment_id} className="row-grid">
          <div className="left-side-achievement">
            <CheckBoxIcon />
          </div>

          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">Achivement :</label>
              <span id="label1">{achievementItem.achievement_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Organization :</label>
              <span id="label1">{achievementItem.organization_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Year Attained :</label>
              <span id="label1">{achievementItem.year_attained}</span>
            </div>
          </div>

          <div>
            <button className="main-primary-btn">Approved</button>
          </div>
        </div>
      ))}

      <div className="btn-row-achievement">
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
          onClick={() => navigate("/achievements")}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MainAchievement;
