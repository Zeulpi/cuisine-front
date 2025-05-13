import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/reducers/store';
import {PlannerComponent} from "../../components/PlannerComponent";
import '../../styles/User/UserPlanner.css'

export function UserPlanner() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPlanners, setUserPlanners] = useState(useAppSelector(state => state.auth.userPlanner));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(()=>{
    // console.log("planner mis a jour");
  }, [userPlanners]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <title>
          {(`${process.env.REACT_APP_APP_NAME} - Mon Planner`)}
      </title>


      <div className="user-planner">
        <div className='planner-title'><h1>Mon Planner</h1></div>
        <div className="planner-container">
          <PlannerComponent plannerWidth="50vw"/>
        </div>
      </div>
    </>
  );
}