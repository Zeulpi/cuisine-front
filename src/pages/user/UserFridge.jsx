import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/reducers/store';
import FridgeComponent from '../../components/FridgeComponent';

const UserFridge = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userFridge, setUserFridge] = useState(useAppSelector(state => state.fridge.inventory));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  return (
    <>
      <title>
          {(`${process.env.REACT_APP_APP_NAME} - Mon frigo`)}
      </title>

      <div className="user-fridge">
        <h1>User Fridge</h1>
      </div>

      <FridgeComponent />
    </>
  );
}

export default UserFridge;