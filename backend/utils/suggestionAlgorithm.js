/**
 * Suggestion Algorithm
 * Generează recomandări personalizate de investiții
 * bazate pe profilul utilizatorului
 */

/**
 * Strategii de alocare bazate pe nivel de risc
 * Icon names (strings) - mapped în frontend la lucide-react components
 */
const riskStrategies = {
  low: {
    name: 'Conservator',
    description: 'Risc scăzut, randament stabil',
    expectedReturn: { min: 6, max: 9 },
    allocations: [
      { 
        asset: 'Titluri de stat Tezaur/Fidelis', 
        percentage: 35, 
        iconName: 'Shield',
        color: 'text-blue-600'
      },
      { 
        asset: 'Acțiuni blue-chip (Microsoft, Apple, J&J, Coca-Cola)', 
        percentage: 25, 
        iconName: 'PieChart',
        color: 'text-blue-600'
      },
      { 
        asset: 'ETFs (VWCE, VUAA, VHYD, AGGG)', 
        percentage: 40, 
        iconName: 'Wallet',
        color: 'text-blue-600'
      }
    ]
  },
  medium: {
    name: 'Echilibrat',
    description: 'Echilibru între risc și randament',
    expectedReturn: { min: 8, max: 11 },
    allocations: [
      { 
        asset: 'ETFs (VWCE, IWDA, VUAA, VHYD)', 
        percentage: 40, 
        iconName: 'PieChart',
        color: 'text-purple-600'
      },
      { 
        asset: 'Titluri de stat Tezaur/Fidelis', 
        percentage: 30, 
        iconName: 'Building2',
        color: 'text-purple-600'
      },
      { 
        asset: 'Acțiuni blue-chip (Microsoft, Apple, Google, Amazon)', 
        percentage: 30, 
        iconName: 'Shield',
        color: 'text-purple-600'
      }
    ]
  },
  high: {
    name: 'Agresiv',
    description: 'Risc ridicat, potențial mare',
    expectedReturn: { min: 10, max: 20 },
    allocations: [
      { 
        asset: 'ETFs tematice (EQQQ, WTEC, IITU, XEON)', 
        percentage: 35, 
        iconName: 'Rocket',
        color: 'text-orange-600'
      },
      { 
        asset: 'Acțiuni growth (Nvidia, Tesla, Meta, Amazon)', 
        percentage: 30, 
        iconName: 'Bitcoin',
        color: 'text-orange-600'
      },
      { 
        asset: 'Crypto (BTC, ETH, SOL, BNB)', 
        percentage: 35, 
        iconName: 'Target',
        color: 'text-orange-600'
      }
    ]
  }
};

/**
 * Ajustări bazate pe obiectiv
 */
const goalAdjustments = {
  retirement: {
    name: 'Pensionare',
    iconName: 'TrendingUp'
  },
  education: {
    name: 'Educație',
    iconName: 'GraduationCap'
  },
  home: {
    name: 'Casă',
    iconName: 'Home'
  },
  emergency: {
    name: 'Fond Urgență',
    iconName: 'Shield'
  },
  wealth: {
    name: 'Creștere Avere',
    iconName: 'TrendingUp'
  },
  other: {
    name: 'Altele',
    iconName: 'Target'
  }
};

/**
 * Ajustare alocări în funcție de orizont timp
 */
function adjustForHorizon(allocations, horizonMonths) {
  // Orizont foarte scurt (<12 luni) - reduce riscul
  if (horizonMonths < 12) {
    return allocations.map(allocation => {
      if (allocation.asset.includes('Crypto') || allocation.asset.includes('growth')) {
        return { ...allocation, percentage: Math.floor(allocation.percentage * 0.5) };
      }
      if (allocation.asset.includes('Obligațiuni') || allocation.asset.includes('Cash')) {
        return { ...allocation, percentage: Math.floor(allocation.percentage * 1.3) };
      }
      return allocation;
    });
  }
  
  // Orizont foarte lung (>60 luni) - poate lua mai mult risc
  if (horizonMonths > 60) {
    return allocations.map(allocation => {
      if (allocation.asset.includes('Crypto') || allocation.asset.includes('growth')) {
        return { ...allocation, percentage: Math.floor(allocation.percentage * 1.2) };
      }
      if (allocation.asset.includes('Cash')) {
        return { ...allocation, percentage: Math.floor(allocation.percentage * 0.7) };
      }
      return allocation;
    });
  }
  
  return allocations;
}

/**
 * Normalizează percentajele ca să fie exact 100%
 */
function normalizePercentages(allocations) {
  const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
  
  if (total === 100) return allocations;
  
  // Ajustează proporțional
  const normalized = allocations.map((allocation) => {
    const adjusted = Math.floor((allocation.percentage / total) * 100);
    return { ...allocation, percentage: adjusted };
  });
  
  // Calculează diferența și adaugă la ultimul item pentru a ajunge exact la 100
  const currentTotal = normalized.reduce((sum, a) => sum + a.percentage, 0);
  const difference = 100 - currentTotal;
  
  if (difference !== 0 && normalized.length > 0) {
    normalized[normalized.length - 1].percentage += difference;
  }
  
  return normalized;
}

/**
 * Generează sugestii personalizate
 * @param {Object} preferences - Preferințele utilizatorului
 * @returns {Object} Sugestii complete cu alocări și estimări
 */
function generateSuggestions(preferences) {
  const {
    budget_monthly = 0,
    risk_level = 'medium',
    main_goal = 'wealth',
    horizon_months = 12
  } = preferences;

  // Obține strategia de risc
  const strategy = riskStrategies[risk_level] || riskStrategies.medium;
  
  // Obține informații despre obiectiv
  const goalInfo = goalAdjustments[main_goal] || goalAdjustments.other;
  
  // Ajustează alocările pentru orizont
  let allocations = adjustForHorizon([...strategy.allocations], horizon_months);
  
  // Normalizează să fie exact 100%
  allocations = normalizePercentages(allocations);
  
  // Calculează sumele pentru fiecare alocare
  const allocationsWithAmounts = allocations.map(allocation => ({
    ...allocation,
    amount: Math.round((budget_monthly * allocation.percentage) / 100 * 100) / 100,
    monthlyAmount: Math.round((budget_monthly * allocation.percentage) / 100 * 100) / 100
  }));
  
  // Calculează estimări financiare
  const totalInvested = budget_monthly * horizon_months;
  const avgReturn = (strategy.expectedReturn.min + strategy.expectedReturn.max) / 2 / 100;
  
  // Formula simplificată pentru valoare finală cu dobândă compusă lunară
  const monthlyRate = avgReturn / 12;
  const finalAmount = budget_monthly * (Math.pow(1 + monthlyRate, horizon_months) - 1) / monthlyRate;
  
  const estimatedGain = finalAmount - totalInvested;
  const estimatedGainPercentage = totalInvested > 0 ? (estimatedGain / totalInvested) * 100 : 0;
  
  return {
    strategy: {
      name: strategy.name,
      description: strategy.description,
      riskLevel: risk_level,
      expectedReturn: `${strategy.expectedReturn.min}-${strategy.expectedReturn.max}% anual`
    },
    goal: {
      name: goalInfo.name,
      focus: goalInfo.focus,
      tip: goalInfo.tip,
      iconName: goalInfo.iconName
    },
    allocations: allocationsWithAmounts,
    financial: {
      monthlyBudget: budget_monthly,
      horizonMonths: horizon_months,
      totalInvested: Math.round(totalInvested * 100) / 100,
      estimatedFinalAmount: Math.round(finalAmount * 100) / 100,
      estimatedGain: Math.round(estimatedGain * 100) / 100,
      estimatedGainPercentage: Math.round(estimatedGainPercentage * 100) / 100
    },
    recommendations: [
      `Investește ${budget_monthly}$ lunar conform alocării`,
      `Orizont de timp: ${horizon_months} luni (${Math.round(horizon_months / 12 * 10) / 10} ani)`,
      `Randament estimat: ${strategy.expectedReturn.min}-${strategy.expectedReturn.max}% anual`,
      'Randamentul anual se reflectă complet pe orizonturi de 3+ ani'
    ]
  };
}

/**
 * Generează sugestie rapidă (fără preferințe complete)
 * Folosit pentru quick preview
 */
function quickSuggestion(budget, riskLevel = 'medium') {
  const strategy = riskStrategies[riskLevel] || riskStrategies.medium;
  
  return {
    strategy: strategy.name,
    allocations: strategy.allocations.map(a => ({
      asset: a.asset,
      percentage: a.percentage,
      amount: Math.round((budget * a.percentage) / 100 * 100) / 100,
      iconName: a.iconName,
      color: a.color
    })),
    expectedReturn: `${strategy.expectedReturn.min}-${strategy.expectedReturn.max}%`
  };
}

module.exports = {
  generateSuggestions,
  quickSuggestion,
  riskStrategies,
  goalAdjustments
};