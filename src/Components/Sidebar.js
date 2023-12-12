import React from 'react';
import '../Styles/Sidebar.css';
import {useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FluorescentIcon from '@mui/icons-material/Fluorescent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

function Sidebar() {
  const navigate = useNavigate()
  return (
    <div className="sidebar">
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/studentprofile");
        }}
      >
        <AccountCircleIcon />
        Personal Information
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/maineducation");
        }}
      >
        <SchoolIcon /> Education
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/mainachievement");
        }}
      >
        <EmojiEventsIcon />
        Achievements
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/mainexperience");
        }}
      >
        <WorkHistoryIcon /> Experience
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/maincurriculum");
        }}
      >
        <HistoryEduIcon /> Co-Curriculum
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/mainproject");
        }}
      >
        <DeveloperBoardIcon /> Project
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/mainskill");
        }}
      >
        <FluorescentIcon /> Skills
      </li>
      <li
        className="navigationBarList"
        onClick={() => {
          navigate("/pendingreview");
        }}
      >
        <FluorescentIcon /> Pending Reviews
      </li>
    </div>
  );
}
export default Sidebar

