export type HealthCondition = 
  | 'Celiac' 
  | 'Gluten Free' 
  | 'Diabetes (Low GI)' 
  | 'Anti-Inflammatory (AIP)' 
  | 'Low Fodmap' 
  | 'Renal Diet' 
  | 'Dairy Free';

export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
  sodium?: string;
  sugar?: string;
}

export interface Modification {
  original: string;
  replacement: string;
  reason: string;
}

export interface Recipe {
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  modifications: Modification[];
  suggestions: { title: string; description: string }[];
}
