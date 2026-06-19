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

export const getIcon = (iconName) => {
  return iconMap[iconName] || Target;
};

export default iconMap;