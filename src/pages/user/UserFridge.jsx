import React from "react";

const UserFridge = () => {
  return (
    <>
      <title>
          {(`${process.env.REACT_APP_APP_NAME} - Mon frigo`)}
      </title>

      <div className="user-fridge">
        <h1>User Fridge</h1>
        <p>Inventory</p>
      </div>
    </>
  );
}

export default UserFridge;