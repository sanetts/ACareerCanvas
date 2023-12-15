import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Styles/Admin.css";
import "../Styles/App.css";

const CPADashboard = () => {
  const [assignedItems, setAssignedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [educationId, setEducationId] = useState(null);
  const [cpaId, setCpaId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const studentId = sessionStorage.getItem("userId");

    const fetchEducationId = async () => {
      try {
        const response = await fetch(
          `http://localhost/careercanvas/getEducationId.php?studentId=${studentId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch educationId. Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data || data.error) {
          throw new Error(
            `Error fetching educationId. Server response: ${JSON.stringify(
              data
            )}`
          );
        }

        const { education_id, cpa_id } = data; // Extract both education_id and cpa_id

        console.log("EducationId Response:", data);
        console.log("EducationId:", education_id);
          console.log("CPA Id:", cpa_id);
          
          setCpaId(cpa_id);


        fetchAssignedItems(studentId, education_id, cpa_id);
      } catch (error) {
        console.error("Error fetching educationId:", error.message);
        setLoading(false);
      }
    };

    fetchEducationId();
  }, []);
    
    
  const fetchAssignedItems = async (studentId, educationId, cpa_id) => {
    try {
      const response = await fetch(
        `http://localhost/careercanvas/getAssignedItems.php?studentId=${studentId}&educationId=${educationId}&cpaId=${cpaId}`
      );
        
      if (!response.ok) {
        throw new Error(
          `Failed to fetch assigned items. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Assigned Items Response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Empty or invalid JSON response");
      }

      // Update the comments state with educationId and cpa_id
     
        setComments(
  data.map((item) => ({
    assignmentId: item.assignment_id,
    comment: "",
    educationId: educationId,
    cpa_id: item.cpa_id, // Add this line
  }))
      );

      setAssignedItems(data);
    } catch (error) {
      console.error("Error fetching assigned items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (assignmentId, index) => {
  try {
    console.log("Comments State:", comments);

    const { educationId, cpa_id } = comments[index]; // Use cpa_id from comments state

    const response = await fetch(
      "http://localhost/careercanvas/postAssignedComments.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId,
          educationId,
          cpaId,
          comment: comments[index].comment,
        }),
      }
    );
      if (!response.ok) {
        throw new Error(`Failed to add comment. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Comment added successfully:", data);
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };


  const updateStatus = async (assignmentId) => {
    try {
      const response = await fetch(
        "http://localhost/careercanvas/updateEducationApprovalStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Approved",
            id: assignmentId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status. Status: ${response.status}`);
      }

      const statusData = await response.json();
      console.log("Status updated successfully:", statusData);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

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

      {assignedItems.map((assignedItem, index) => (
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
            <input
              className="comments"
              value={comments[index].comment}
              onChange={(e) => {
                setComments((prevComments) => {
                  const newComments = [...prevComments];
                  newComments[index].comment = e.target.value;
                  return newComments;
                });
              }}
            />
            <button
              className="main-primary-btn"
              onClick={() =>
                addComment(assignedItem.assignment_id, index, cpaId)
              }
            >
              Add Comment
            </button>
          </div>

          <div>
            <button
              className="main-primary-btn"
              id="first"
              onClick={() => updateStatus(assignedItem.assignment_id)}
            >
              Approve
            </button>
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
