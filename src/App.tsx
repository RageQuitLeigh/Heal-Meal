/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChefHat, 
  Info, 
  Clock, 
  Users, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  UtensilsCrossed,
  Flame,
  Droplets,
  Zap,
  ChevronRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateRecipe, generateRecipeImage } from './services/gemini';
import { HealthCondition, Recipe } from './types';
import { cn } from './lib/utils';

const CONDITIONS: HealthCondition[] = [
  'Celiac',
  'Gluten Free',
  'Diabetes (Low GI)',
  'Anti-Inflammatory (AIP)',
  'Low Fodmap',
  'Renal Diet',
  'Dairy Free'
];

export default function App() {
  const [mealName, setMealName] = useState('');
  const [condition, setCondition] = useState<HealthCondition>(CONDITIONS[0]);
  const [servings, setServings] = useState(2);
  const [unitSystem, setUnitSystem] = useState<'US' | 'Metric'>('Metric');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecipe = async (customMeal?: string) => {
    const targetMeal = customMeal || mealName;
    if (!targetMeal) return;

    setLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeImage(null);

    try {
      const [newRecipe, imageUrl] = await Promise.all([
        generateRecipe(targetMeal, condition, servings, unitSystem),
        generateRecipeImage(targetMeal, condition)
      ]);
      setRecipe(newRecipe);
      setRecipeImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ChefHat className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">HealMeal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60">
            <a href="#" className="hover:text-emerald-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Conditions</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Safe cooking, <br />
            <span className="text-emerald-600 italic font-serif">without compromise.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-black/60 max-w-2xl mx-auto mb-10"
          >
            Enter any meal and your health condition. We'll craft a perfect, 
            medically-conscious recipe with smart alternatives that taste just like the original.
          </motion.p>

          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/5 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">What do you want to cook?</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="e.g. Lasagna, Pad Thai, Chocolate Cake..."
                    className="w-full pl-12 pr-4 py-4 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">Health Condition</label>
                <select 
                  className="w-full px-4 py-4 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as HealthCondition)}
                >
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-black/5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-black/40" />
                  <div className="flex items-center bg-black/5 rounded-full p-1">
                    {[1, 2, 4, 6].map(n => (
                      <button 
                        key={n}
                        onClick={() => setServings(n)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium transition-all",
                          servings === n ? "bg-white shadow-sm text-emerald-600" : "text-black/40 hover:text-black"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-black/40" />
                  <div className="flex items-center bg-black/5 rounded-full p-1">
                    {(['Metric', 'US'] as const).map(u => (
                      <button 
                        key={u}
                        onClick={() => setUnitSystem(u)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium transition-all",
                          unitSystem === u ? "bg-white shadow-sm text-emerald-600" : "text-black/40 hover:text-black"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleGetRecipe()}
                disabled={loading || !mealName}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Creating Recipe...
                  </>
                ) : (
                  <>
                    Get Recipe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Display */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-20 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                <ChefHat className="absolute inset-0 m-auto w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Ingredients...</h3>
              <p className="text-black/40">Finding the perfect medical-grade alternatives for your {mealName}.</p>
            </motion.div>
          ) : recipe ? (
            <motion.div 
              key="recipe"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Image & Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm">
                  <div className="aspect-video relative bg-black/5">
                    {recipeImage ? (
                      <img 
                        src={recipeImage} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-black/20">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">Generating image...</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        {condition} Safe
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium text-black/40">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Prep: {recipe.prepTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Cook: {recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} Servings</span>
                      </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-4 tracking-tight">{recipe.title}</h2>
                    <p className="text-lg text-black/60 mb-12 leading-relaxed">{recipe.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          Ingredients
                        </h3>
                        <ul className="space-y-4">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-3 group">
                              <div className="w-5 h-5 rounded-full border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-50 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <span className="text-black/80">
                                <span className="font-bold">{ing.amount} {ing.unit}</span> {ing.item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Method
                        </h3>
                        <div className="space-y-8">
                          {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-4">
                              <span className="text-2xl font-serif italic text-emerald-600/30 font-bold leading-none">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <p className="text-black/70 leading-relaxed pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                {/* Modifications Section */}
                <section className="bg-emerald-900 text-white rounded-[32px] p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Smart Modifications</h3>
                      <p className="text-emerald-400 text-sm">Why we changed the traditional recipe</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipe.modifications.map((mod, idx) => (
                      <div key={idx} className="bg-emerald-800/50 rounded-2xl p-6 border border-emerald-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Replaced</span>
                          <span className="text-sm font-medium line-through opacity-50">{mod.original}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">With</span>
                          <span className="text-sm font-bold text-emerald-100">{mod.replacement}</span>
                        </div>
                        <p className="text-sm text-emerald-200/80 leading-relaxed">{mod.reason}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Nutrition & Suggestions */}
              <div className="space-y-8">
                {/* Nutrition Card */}
                <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-8 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Nutrition per serving
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-end justify-between border-b border-black/5 pb-4">
                      <span className="text-sm font-medium text-black/60">Calories</span>
                      <span className="text-3xl font-bold tracking-tight">{recipe.nutrition.calories}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Protein', value: recipe.nutrition.protein },
                        { label: 'Carbs', value: recipe.nutrition.carbs },
                        { label: 'Fat', value: recipe.nutrition.fat },
                        { label: 'Fiber', value: recipe.nutrition.fiber },
                        { label: 'Sodium', value: recipe.nutrition.sodium },
                        { label: 'Sugar', value: recipe.nutrition.sugar },
                      ].filter(n => n.value).map((n, idx) => (
                        <div key={idx} className="bg-black/5 rounded-2xl p-4">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">{n.label}</span>
                          <span className="text-lg font-bold">{n.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions Card */}
                <div className="bg-stone-100 rounded-[32px] p-8 border border-black/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    Similar Alternatives
                  </h3>
                  <div className="space-y-4">
                    {recipe.suggestions.map((sug, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setMealName(sug.title);
                          handleGetRecipe(sug.title);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left bg-white p-5 rounded-2xl border border-black/5 hover:border-emerald-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-black/80 group-hover:text-emerald-600 transition-colors">{sug.title}</span>
                          <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-black/40 line-clamp-2 leading-relaxed">{sug.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Note */}
                <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8">
                  <div className="flex items-center gap-2 text-amber-800 mb-3">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Medical Disclaimer</span>
                  </div>
                  <p className="text-xs text-amber-700/80 leading-relaxed">
                    While HealMeal uses AI to adapt recipes based on medical guidelines, 
                    always consult with your healthcare provider or a registered dietitian 
                    before making significant changes to your diet, especially for 
                    conditions like Renal Diet or Diabetes.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto py-20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-10 h-10 text-emerald-200" />
              </div>
              <h3 className="text-xl font-bold text-black/40">Your custom recipe will appear here</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <ChefHat className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">HealMeal</span>
          </div>
          <p className="text-sm text-black/40">© 2024 HealMeal. Built for health and flavor.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-black/40">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
