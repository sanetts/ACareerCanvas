import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../Styles/App.css";
import "../Styles/MainEducation.css";

const MainEducation = () => {
  const navigate = useNavigate();

  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("userId");
        // const cpaId = sessionStorage.getItem("cpaId");
        console.log("Student", studentId);
        // console.log("Student", studentId);

        const response = await fetch(
          `http://localhost/careercanvas/getEducationData.php?student_id=${studentId}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setEducationData(data);
        } else {
          console.error("Error fetching education data");
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

  const handleEditChange = (e, index, fieldName) => {
    const { value } = e.target;
    setEducationData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = async (educationItem) => {
    
    try {
      const response = await fetch(
        "http://localhost/careercanvas/editEducationData.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(educationItem),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
      } else {
        console.error("Error updating record:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (
    !Array.isArray(educationData) ||
    educationData.length === 0 ||
    educationData.message
  ) {
    return (
      <div className="boarder-container">
        <div className="form-student-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail4">EDUCATION</label>
            <hr
              className="long-line"
              style={{ width: "100%", border: "1px solid black" }}
            />
          </div>
        </div>
        <div className="right-side">
          <div className="labels-container">
            <label htmlFor="label1">
              {educationData.message || "No education data found"}
            </label>
          </div>
        </div>

        <div className="btn-row-education">
          <button
            type="submit"
            className="main-primary-btn"
            onClick={() => navigate("/education")}
          >
            Add
          </button>
        </div>
      </div>
    );
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

      {educationData.map((educationItem, index) => (
        <div key={educationItem.education_id} className="row-grid">
          <div left-side>
            <CheckBoxIcon />
          </div>

          <div className="right-side">
            <div className="labels-container">
              <label htmlFor="label1">School :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={educationData[index].university_name}
                    onChange={(e) =>
                      handleEditChange(e, index, "university_name")
                    }
                  />
                ) : (
                  educationItem.university_name
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Program :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={educationItem.program_of_study}
                    onChange={(e) => handleEditChange(e, index)}
                  />
                ) : (
                  educationItem.program_of_study
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={educationItem.start_date}
                    onChange={(e) => handleEditChange(e, index)}
                  />
                ) : (
                  educationItem.start_date
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={educationItem.end_date}
                    onChange={(e) => handleEditChange(e, index)}
                  />
                ) : (
                  educationItem.end_date
                )}
              </span>
            </div>

            <div className="approval-status">
              {/* Render the "Approved" button only if not in edit mode */}
              {!editingIndex && (
                <button className="main-primary-btn">
                  {educationItem.status}
                </button>
              )}
              {/* Render the "Save" button if in edit mode, otherwise render the "Edit" button */}
              {editingIndex === index ? (
                <button
                  type="button"
                  className="main-primary-btn"
                  onClick={() => handleSave(educationItem)}
                >
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  className="main-primary-btn"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Always display the "Add" button */}

      <div className="btn-row-education">
        <div className="sticky-footer">
          <button
            type="submit"
            className="main-primary-btn"
            onClick={() => navigate("/education")}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default MainEducation;
