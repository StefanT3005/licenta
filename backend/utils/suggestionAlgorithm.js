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


function generateSuggestions(preferences) {
  const {
    budget_monthly = 0,
    risk_level = 'medium',
    main_goal = 'wealth',
    horizon_months = 12
  } = preferences;

  const strategy = riskStrategies[risk_level] || riskStrategies.medium;
  
  const goalInfo = goalAdjustments[main_goal] || goalAdjustments.other;
  
  const allocations = [...strategy.allocations];
  
  const allocationsWithAmounts = allocations.map(allocation => ({
    ...allocation,
    amount: Math.round((budget_monthly * allocation.percentage) / 100 * 100) / 100,
    monthlyAmount: Math.round((budget_monthly * allocation.percentage) / 100 * 100) / 100
  }));
  
  const totalInvested = budget_monthly * horizon_months;
  const avgReturn = (strategy.expectedReturn.min + strategy.expectedReturn.max) / 2 / 100;
  
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