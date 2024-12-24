'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Search } from 'lucide-react'

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('recipes')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchRecipes()
    fetchFavorites()
  }, [])

  const fetchRecipes = async (query = '') => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      setRecipes(response.data.meals || [])
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    }
  }

  const fetchFavorites = () => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.idMeal !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRecipes(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center my-8 text-indigo-800 font-serif">PlatePoems</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-4 py-2 rounded-full border-2 border-indigo-300 focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700">
              <Search size={24} />
            </button>
          </div>
        </form>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 mr-4 rounded-full text-lg font-semibold transition-colors duration-200 ${activeTab === 'recipes' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-200 ${activeTab === 'favorites' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
        {activeTab === 'recipes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link href={`/recipe/${recipe.idMeal}`} key={recipe.idMeal}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                  <Image src={recipe.strMealThumb} alt={recipe.strMeal} width={500} height={500} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-indigo-800">{recipe.strMeal}</h2>
                    <p className="text-gray-600 line-clamp-3">{recipe.strInstructions}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((favorite) => (
              <div key={favorite.idMeal} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <Image src={favorite.strMealThumb} alt={favorite.strMeal} width={500} height={500} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-indigo-800">{favorite.strMeal}</h2>
                  <button
                    onClick={() => removeFavorite(favorite.idMeal)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

