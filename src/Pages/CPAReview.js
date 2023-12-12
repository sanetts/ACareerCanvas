// CPADashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/App.css";

const CPADashboard = () => {
  const [assignedItems, setAssignedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedItems = async () => {
    try {
      // Get the CPA ID from sessionStorage
      const cpaId = sessionStorage.getItem("cpaId");

      const response = await fetch(
        `http://localhost/careercanvas/getAssignedItems.php?cpaId=${cpaId}`
      );
      const data = await response.json();

      if (response.ok) {
        setAssignedItems(data);
      } else {
        console.error("Error fetching assigned items");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <div className="boarder-container">
      <div className="form-student-row">
        <div className="form-group col-md-6">
          <label htmlFor="inputEmail4">EDUCATION</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>

      {assignedItems.map((assignedItem) => (
        <div key={assignedItem.assignment_id} className="row-cpa">
          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">School :</label>
              <span id="label1">{assignedItem.university_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Program :</label>
              <span id="label1">{assignedItem.program_of_study}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">{assignedItem.start_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">{assignedItem.end_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Description :</label>
              <span id="label1">{assignedItem.description}</span>
            </div>
          </div>

          <div className="left-side-admin">
            <label htmlFor="label1">Add Comments :</label>
            <input className="comments" />
          </div>

          <div className="left-side-admin">
            <div>
              <button className="main-primary-btn" id="first">
                Approve
              </button>
              <button className="main-primary-btn" id="second">
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="btn-row-admin">
        <Link to="/review">
          <button className="main-primary-btn">Review</button>
        </Link>
      </div>
    </div>
  );
};

export default CPADashboard;
