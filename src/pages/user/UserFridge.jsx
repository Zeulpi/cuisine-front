import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/reducers/store';
import {FridgeComponent} from '../../components/FridgeComponent';
import { FridgeSearchComponent } from '../../components/FridgeSearchComponent';
import '../../styles/User/UserFridge.css'

export function UserFridge() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

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
        <div className='fridge-title'><h1>Mon Inventairee</h1></div>
        <div className='fridge-recipes'>
          <FridgeSearchComponent />
        </div>
        <div className="fridge-container">
          <FridgeComponent />
        </div>
      </div>

    </>
  );
}