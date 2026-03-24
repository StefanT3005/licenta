// frontend/src/utils/iconMap.js
import { 
  Shield, 
  TrendingUp, 
  Wallet, 
  Building2, 
  Bitcoin, 
  Rocket, 
  Target, 
  PieChart,
  GraduationCap,
  Home
} from 'lucide-react';

/**
 * Icon mapping pentru convertire string → lucide-react component
 * Folosit în Dashboard pentru a afișa icons din suggestionAlgorithm
 */
const iconMap = {
  Shield,
  TrendingUp,
  Wallet,
  Building2,
  Bitcoin,
  Rocket,
  Target,
  PieChart,
  GraduationCap,
  Home
};

/**
 * Returnează componenta icon bazată pe nume (string)
 * @param {string} iconName - Numele iconului (ex: 'Shield', 'Bitcoin')
 * @returns {Component} - Lucide-react icon component
 */
export const getIcon = (iconName) => {
  return iconMap[iconName] || Target; // Default fallback icon
};

export default iconMap;