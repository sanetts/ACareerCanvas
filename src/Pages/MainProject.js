import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/App.css";
import "../Styles/MainProject.css";

import CheckBoxIcon from "@mui/icons-material/CheckBox";

const MainProject = () => {
    const navigate = useNavigate();
    
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch education data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = sessionStorage.getItem("userId");

        const response = await fetch(
          `http://localhost/careercanvas/getProjectData.php?student_id=${studentId}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setProjectData(data);
        } else {
          console.error("Error fetching project data");
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
    return <p>Loading...</p>; 
  }

  const handleCheckboxChange = (project_id) => {
    setSelectedItems((prevSelectedItems) => {
      const isAlreadySelected = prevSelectedItems.includes(project_id);

      if (isAlreadySelected) {
        return prevSelectedItems.filter((id) => id !== project_id);
      } else {
        return [...prevSelectedItems, project_id];
      }
    });
  };

  const handleCheckAll = () => {
    const allExperienceIds = projectData.map((item) => item.project_id);
    setSelectedItems(allExperienceIds);
  };

  const handleUncheckAll = () => {
    setSelectedItems([]);
  };


    const handleCheckSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting form data:", projectData);
      console.log(projectData[0].student_id);
      console.log(projectData[0].end_date);
      if (!projectData[0].student_id) {
        console.error("Missing student_id in projectData");
        return;
      }

      try {
        const response = await fetch("http://localhost/api/project_cv.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData[0]),
        });

        const data = await response.json();
        console.log("Response:", response);

        if (response.ok) {
          console.log(data.message);
          console.log("Data sent successfully", data);
        } else {
          console.error(data.error);
          console.error("Error sending data. Status:", response.status);
        }
      } catch (error) {
        console.log("Error");
        //console.error("Error:", error);
      }
    };





  const handleEditChange = (e, index, fieldName) => {
    const { value } = e.target;
    setProjectData((prevData) => {
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
    
   const handleSave = async (projectItem) => {
    
     try {
       const response = await fetch(
         "http://localhost/careercanvas/editProjectData.php",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(projectItem),
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
    !Array.isArray(projectData) ||
    projectData.length === 0 ||
    projectData.message
  ) {
    return (
      <div className="boarder-container">
        <div className="form-student-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail4">PROJECT</label>
            <hr
              className="long-line"
              style={{ width: "100%", border: "1px solid black" }}
            />
          </div>
        </div>
        <div className="right-side">
          <div className="labels-container">
            <label htmlFor="label1">
              {projectData.message || "No education data found"}
            </label>
          </div>
        </div>

        <div className="btn-row-education">
          <button
            type="submit"
            className="main-primary-btn"
            onClick={() => navigate("/projects")}
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
          <label for="inputEmail4">PROJECT</label>
        </div>
        <hr
          className="long-line"
          style={{ width: "100%", border: "1px solid black" }}
        />
      </div>
      {projectData.map((projectItem, index) => (
        <div div key={projectItem.project_id} className="row-grid">
          
          {/* <div className='left-side-project'>
            <CheckBoxIcon
              color={selectedItems.includes(projectItem.project_id) ? "primary" : "disabled"}
              onClick={() => handleCheckboxChange(projectItem.project_id)}
            />
         
          </div> */}

          <div className="right-side">
            <div className="labels-container-project">
              <label htmlFor="label1">Project Name : </label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={projectData[index].project_name}
                    onChange={(e) => handleEditChange(e, index, "project_name")}
                  />
                ) : (
                  projectItem.project_name
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Project Owner : </label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={projectData[index].project_owner}
                    onChange={(e) =>
                      handleEditChange(e, index, "project_owner")
                    }
                  />
                ) : (
                  projectItem.project_owner
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Start Date :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="date"
                    value={projectData[index].start_date}
                    onChange={(e) => handleEditChange(e, index, "start_date")}
                  />
                ) : (
                  projectItem.start_date
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">End Date :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="date"
                    value={projectData[index].end_date}
                    onChange={(e) => handleEditChange(e, index, "end_date")}
                  />
                ) : (
                  projectItem.end_date
                )}
              </span>
            </div>

            <div className="labels-container">
              <label htmlFor="label1">Description :</label>
              <span id="label1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={projectData[index].project_description}
                    onChange={(e) =>
                      handleEditChange(e, index, "project_description")
                    }
                  />
                ) : (
                  projectItem.project_description
                )}
              </span>
            </div>
          </div>

          <div>
            {/* Render the "Approved" button only if not in edit mode */}
            {!editingIndex && (
              <button className="main-primary-btn">{projectItem.status}</button>
            )}
            {/* Render the "Save" button if in edit mode, otherwise render the "Edit" button */}
            {editingIndex === index ? (
              <button
                type="button"
                className="main-primary-btn"
                onClick={() => handleSave(projectItem)}
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
      ))}
      ;{/* Always display the "Add" button */}
      
        <div className="btn-row-project">
          <button
            type="button"
            className="main-primary-btn"
            onClick={handleCheckAll}
          >
            Check All
          </button>
          <button
            type="button"
            className="main-primary-btn"
            onClick={handleUncheckAll}
          >
            Uncheck All
          </button>
          <button
            type="button"
            className="main-primary-btn"
            onClick={handleCheckSubmit}
          >
            Submit Checked
          </button>
        </div>
        <div >
          <button
            type="submit"
            className="main-primary-btn"
            onClick={() => navigate("/projects")}
          >
            Add
          </button>
        </div>
      </div>
    
  );
};

export default MainProject;
