import React, { useState } from "react";
import axios from "axios";


const AdminPage = () => {
  const [email, setEmail] = useState("");

    const generateInvitation = async () =>{
        if (!email) {
            alert("Please provide a valid email");
            return;
        } else {
            try {
                const response = await axios.post(
                    "http://localhost/careercanvas/generate_invitation.php",
                    { email }
        
                );
                console.log(response);

                if (response.status === 200) {
                    alert(
                        `Invitation created successfully. Code: ${response.data.invitationCode}`
                    );
                } else {
                    alert("Error creating invitation");
                }
            } catch (error) {
                console.log("Not reached");
                console.error("Error:", error);
            }
        }
  };

  return (
    <div className="row-container">
      <div className="form-student-control">
        <label htmlFor="email" id="contact">
          Recipient's Email:
        </label>
        <input
          type="email"
          id="inputEmail4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="button" id="move" onClick={generateInvitation}>
          Generate Invitation
        </button>
      </div>

    </div>
  );
};

export default AdminPage;
