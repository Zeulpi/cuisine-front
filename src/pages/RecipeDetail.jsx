import React from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const RecipeDetail = () => {
  const { id } = useParams()
  return <h2>Détail de la recette ID : {id}</h2>
}

export default RecipeDetail
