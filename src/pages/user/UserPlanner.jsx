import React from "react";

const UserPlanner = () => {
  return (
    <>
      <title>
          {(`${process.env.REACT_APP_APP_NAME} - Mon Planner`)}
      </title>

      <div className="user-planner">
        <h1>User Planner</h1>
        <p>Weekly Planner.</p>
      </div>
    </>
  );
}

export default UserPlanner;