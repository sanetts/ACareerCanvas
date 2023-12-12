// CPADashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/App.css";

const CPAReview= () => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewData = async () => {
    try {
      // Fetch education entries assigned to the logged-in CPA
      const response = await fetch(
        "http://localhost/careercanvas/getCPAReviewData.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Assuming you send the CPA ID in the request body
          body: JSON.stringify({
            cpa_id: loggedInCPAId,
          }),
        }
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
      {/* Render education entries assigned to the logged-in CPA */}
      {reviewData.map((reviewItem) => (
        <div key={reviewItem.id} className="row-cpa">
          {/* Display education entry details */}
          <div>
            <div className="labels-container">
              <label htmlFor="label1">School :</label>
              <span id="label1">{reviewItem.university_name}</span>
            </div>
            {/* ... other details ... */}
          </div>

          {/* Display comments section */}
          <div className="left-side-admin">
            <label htmlFor="label1">Add Comments :</label>
            <input className="comments" />
          </div>

          {/* Display approval/decline buttons */}
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
        {/* Add a link to the review page for CPAs */}
        <Link to="/review">
          <button className="main-primary-btn">Review</button>
        </Link>
      </div>
    </div>
  );
};

export default CPAReview;
