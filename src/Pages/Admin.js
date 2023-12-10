// CPADashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/App.css";


const CPADashboard = () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewData = async () => {
    try {
      const response = await fetch(
        "http://localhost/careercanvas/getReviewData.php" // Replace with your API endpoint
      );
      const data = await response.json();

      if (response.ok) {
        setReviewData(data);
      } else {
        console.error("Error fetching review data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
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

      {reviewData.map((reviewItem) => (
        <div key={reviewItem.id} className="row-cpa">
          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">School :</label>
              <span id="label1">{reviewItem.university_name}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Program :</label>
              <span id="label1">{reviewItem.program_of_study}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">{reviewItem.start_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">{reviewItem.end_date}</span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Description :</label>
              <span id="label1">{reviewItem.description}</span>
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
