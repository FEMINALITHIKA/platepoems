'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    fetchRecipeDetails()
    checkIfFavorite()
  }, [id])

  const fetchRecipeDetails = async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      setRecipe(response.data.meals[0])
    } catch (error) {
      console.error('Failed to fetch recipe details:', error)
    }
  }

  const checkIfFavorite = () => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites)
      setIsFavorite(favorites.some((fav) => fav.idMeal === id))
    }
  }

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem('favorites')
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : []

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.idMeal !== id)
    } else {
      favorites.push(recipe)
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  if (!recipe) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft size={24} className="mr-2" />
          Back to recipes
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image src={recipe.strMealThumb} alt={recipe.strMeal} width={800} height={800} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-4xl font-bold mb-4 text-indigo-800">{recipe.strMeal}</h1>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-indigo-600">Ingredients</h2>
                <ul className="list-disc list-inside">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
                    const ingredient = recipe[`strIngredient${i}`]
                    const measure = recipe[`strMeasure${i}`]
                    if (ingredient && ingredient.trim()) {
                      return (
                        <li key={i} className="mb-1">
                          {ingredient} - {measure}
                        </li>
                      )
                    }
                    return null
                  })}
                </ul>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-indigo-600">Instructions</h2>
                <p className="text-gray-700 whitespace-pre-line">{recipe.strInstructions}</p>
              </div>
              <button
                onClick={toggleFavorite}
                className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-200 ${
                  isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Heart size={24} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

