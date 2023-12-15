import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/MainExperience.css";

const Review = () => {
  const navigate = useNavigate();
  const [unapprovedEducationData, setUnapprovedEducationData] = useState([]);
  const [unapprovedProjectData, setUnapprovedProjectData] = useState([]);
    const [loading, setLoading] = useState(true);
     const [formData, setFormData] = useState({});

    
 const fetchUnapprovedEducationData = async () => {
   try {
     const studentId = sessionStorage.getItem("userId");

     const response = await fetch(
       `http://localhost/careercanvas/getUnapprovedEducationData.php?student_id=${studentId}`
     );
     const data = await response.json();

     if (response.ok) {
         setUnapprovedEducationData(data);
     }
   } catch (error) {
       console.error("Error:", error);
        console.error("Error fetching unapproved education data");
   } finally {
     setLoading(false);
   }
 };

 const fetchUnapprovedProjectData = async () => {
   try {
     const studentId = sessionStorage.getItem("userId");

     const response = await fetch(
       `http://localhost/careercanvas/getUnapprovedProjectData.php?student_id=${studentId}`
     );
     const data = await response.json();

     if (response.ok) {
       setUnapprovedProjectData(data);
     } else {
       console.error("Error fetching unapproved project data");
     }
   } catch (error) {
     console.error("Error:", error);
   } finally {
     setLoading(false);
   }
 };


  useEffect(() => {
      fetchUnapprovedEducationData();
      fetchUnapprovedProjectData();
  }, []);

    
    useEffect(() => {
      const fetchStudentData = async () => {
        try {
          const studentId = sessionStorage.getItem("userId");

          if (studentId && !isNaN(studentId)) {
            const response = await fetch(
              `http://localhost/careercanvas/student.php?student_id=${studentId}`
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
          console.error("Error:", error);
        }
      };

      fetchStudentData();
    }, []);
  const handleSendForReview = async () => {
      try {
        const studentId = sessionStorage.getItem("userId");
          
        for (const educationItem of unapprovedEducationData) {
          console.log("Processing educationItem:", educationItem);
            
        const response = await fetch(
          "http://localhost/careercanvas/updateEducationReviewStatus.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "PENDING",
              id: educationItem.id,
              studentId: studentId,
            }),
          }
        );
            const responseBody = await response.text(); // Log the response body
            console.log("Response Body:", responseBody);

            

        if (response.ok) {
          const responseData = await response.json();
          console.log("Response from server:", responseData);
        } else {
            console.error("Error updating review status");
            console.error(
              "Error updating review status:",
              await response.text()
            );
        }
      }

      fetchUnapprovedEducationData();
    } catch (error) {
      console.error("Error:", error);
    }
      
      
      try {
        for (const projectItem of unapprovedProjectData) {
          const response = await fetch(
            "http://localhost/careercanvas/updateProjectReviewStatus.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "PENDING",
                id: projectItem.project_id, 
              }),
            }
          );
if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
//   const data = await response.json();
          if (response.ok) {
            const responseData = await response.json();
            console.log("Response from server:", responseData);
          } else {
            console.error("Error updating review status");
          }
        }

        fetchUnapprovedProjectData();
      } catch (error) {
        console.error("Error:", error);
      }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="boarder-container">
      {unapprovedEducationData.map((educationItem) => (
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

      {unapprovedProjectData.map((projectItem) => (
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

      <div className="btn-row-exp">
        <button
          className="main-primary-btn"
          onClick={handleSendForReview}
          disabled={
            unapprovedEducationData.some((item) => item.status === "PENDING") &&
            unapprovedProjectData.some((item) => item.status === "PENDING")
          }
        >
          Send All for Review
        </button>
      </div>
    </div>
  );
};

export default Review;
