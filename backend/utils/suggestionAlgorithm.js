/**
 * Suggestion Algorithm
 * Generează recomandări personalizate de investiții
 * bazate pe profilul utilizatorului
 */

/**
 * Strategii de alocare bazate pe nivel de risc
 */
const riskStrategies = {
  low: {
    name: 'Conservator',
    description: 'Risc scăzut, randament stabil',
    expectedReturn: { min: 4, max: 6 },
    allocations: [
      { asset: 'Obligațiuni Guvernamentale', percentage: 60, emoji: '📉' },
      { asset: 'ETF S&P 500', percentage: 25, emoji: '📊' },
      { asset: 'Cash / Savings', percentage: 15, emoji: '💵' }
    ]
  },
  medium: {
    name: 'Echilibrat',
    description: 'Echilibru între risc și randament',
    expectedReturn: { min: 7, max: 10 },
    allocations: [
      { asset: 'ETF S&P 500', percentage: 50, emoji: '📊' },
      { asset: 'Acțiuni Blue-chip', percentage: 30, emoji: '📈' },
      { asset: 'Obligațiuni', percentage: 15, emoji: '📉' },
      { asset: 'Crypto (BTC/ETH)', percentage: 5, emoji: '💎' }
    ]
  },
  high: {
    name: 'Agresiv',
    description: 'Risc ridicat, potențial mare',
    expectedReturn: { min: 12, max: 20 },
    allocations: [
      { asset: 'Growth Stocks', percentage: 40, emoji: '🚀' },
      { asset: 'Crypto (BTC/ETH/ALT)', percentage: 30, emoji: '💎' },
      { asset: 'Thematic ETFs', percentage: 20, emoji: '🎯' },
      { asset: 'Acțiuni Blue-chip', percentage: 10, emoji: '📈' }
    ]
  }
};

/**
 * Ajustări bazate pe obiectiv
 */
const goalAdjustments = {
  retirement: {
    name: 'Pensionare',
    focus: 'Creștere pe termen lung',
    tip: 'Mizează pe ETF-uri cu dividende și acțiuni stabile'
  },
  education: {
    name: 'Educație',
    focus: 'Siguranță cu creștere moderată',
    tip: 'Balansează între obligațiuni și ETF-uri pentru stabilitate'
  },
  home: {
    name: 'Casă',
    focus: 'Acumulare rapidă cu risc moderat',
    tip: 'Combină ETF-uri și savings pentru lichiditate'
  },
  emergency: {
    name: 'Fond Urgență',
    focus: 'Siguranță maximă și lichiditate',
    tip: 'Prioritizează cash și obligațiuni pe termen scurt'
  },
  wealth: {
    name: 'Creștere Avere',
    focus: 'Maximizare randament',
    tip: 'Poți lua mai mult risc pentru potențial mai mare'
  },
  other: {
    name: 'Altele',
    focus: 'Strategie personalizată',
    tip: 'Ajustează alocarea în funcție de nevoile tale specifice'
  }
};

/**
 * Ajustare alocări în funcție de orizont timp
 */
function adjustForHorizon(allocations, horizonMonths) {
  // Orizont foarte scurt (<12 luni) - reduce riscul
  if (horizonMonths < 12) {
    return allocations.map(allocation => {
      if (allocation.asset.includes('Crypto') || allocation.asset.includes('Growth')) {
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
      if (allocation.asset.includes('Crypto') || allocation.asset.includes('Growth')) {
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
  return allocations.map((allocation, index) => {
    const adjusted = Math.floor((allocation.percentage / total) * 100);
    // Ultimul item primește diferența pentru a ajunge exact la 100
    if (index === allocations.length - 1) {
      const currentTotal = allocations.slice(0, -1).reduce((sum, a) => sum + a.percentage, 0);
      return { ...allocation, percentage: 100 - currentTotal };
    }
    return { ...allocation, percentage: adjusted };
  });
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
  const estimatedGainPercentage = (estimatedGain / totalInvested) * 100;
  
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
      tip: goalInfo.tip
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
      goalInfo.tip
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
      amount: Math.round((budget * a.percentage) / 100 * 100) / 100
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