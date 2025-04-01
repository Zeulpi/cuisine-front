import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import RecipeList from './pages/RecipeList'
import RecipeDetail from './pages/RecipeDetail'
import UserPage from './pages/user/UserPage'
import UserFridge from './pages/user/UserFridge'
import UserPlanner from './pages/user/UserPlanner'
import NotFoundPage from './pages/NotFoundPage'
import UserLayout from './pages/UserLayout'
import Register from './components/Header/Login/Register'


const RootComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Regroupement des pages utilisateur sous /user */}
          <Route path="user" element={<UserLayout />}> {/* Composant de gestion des pages utilisateur */}
            <Route path="account" element={<UserPage />} />
            <Route path="inventory" element={<UserFridge />} />
            <Route path="planner" element={<UserPlanner />} />
          </Route>

          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default RootComponent
