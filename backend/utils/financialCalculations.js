/**
 * Financial Calculations Utility - CORRECTED
 * Formule corecte pentru calculele planurilor financiare
 */

// Calcul timp necesar fără investiții (economisire simplă)
exports.calculateMonthsWithoutInvestments = (goalAmount, monthlySavings, currentAmount = 0) => {
  const remaining = goalAmount - currentAmount;
  if (remaining <= 0) return 0;
  if (monthlySavings <= 0) return Infinity;
  return Math.ceil(remaining / monthlySavings);
};

// Calcul timp necesar CU investiții (dobândă compusă) - CORECTED
// Formula: FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
// Rezolvăm pentru n folosind metoda Newton-Raphson
exports.calculateMonthsWithInvestments = (goalAmount, monthlySavings, annualReturnRate, currentAmount = 0) => {
  if (currentAmount >= goalAmount) return 0;
  if (monthlySavings <= 0) return Infinity;
  
  const monthlyRate = annualReturnRate / 12 / 100;
  
  // Dacă rata e 0, folosim formula simplă
  if (monthlyRate === 0) {
    const remaining = goalAmount - currentAmount;
    return Math.ceil(remaining / monthlySavings);
  }
  
  // Dacă nu avem suma inițială, folosim formula simplă pentru anuitate
  if (currentAmount === 0) {
    const months = Math.log(1 + (goalAmount * monthlyRate) / monthlySavings) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  }
  
  // Formula completă cu PV și PMT
  // FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
  // Folosim Newton-Raphson pentru a rezolva pentru n
  
  let n = 1; // Estimare inițială
  const maxIterations = 100;
  const tolerance = 0.01;
  
  for (let i = 0; i < maxIterations; i++) {
    const onePlusR = 1 + monthlyRate;
    const onePlusRn = Math.pow(onePlusR, n);
    
    // f(n) = PV(1+r)^n + PMT × [(1+r)^n - 1] / r - FV
    const f = currentAmount * onePlusRn + 
              monthlySavings * (onePlusRn - 1) / monthlyRate - 
              goalAmount;
    
    // f'(n) = PV × ln(1+r) × (1+r)^n + PMT × ln(1+r) × (1+r)^n / r
    const ln1r = Math.log(onePlusR);
    const df = currentAmount * ln1r * onePlusRn + 
               monthlySavings * ln1r * onePlusRn / monthlyRate;
    
    // Newton-Raphson: n_next = n - f(n) / f'(n)
    const nNext = n - f / df;
    
    if (Math.abs(nNext - n) < tolerance) {
      return Math.ceil(nNext);
    }
    
    n = nNext;
    
    // Prevenire valori negative
    if (n < 0) n = 1;
  }
  
  // Fallback dacă nu converge
  return Math.ceil(n);
};

// Calcul sumă finală cu investiții - CORRECTED (cu suma inițială)
exports.calculateFutureValue = (monthlySavings, annualReturnRate, months, initialAmount = 0) => {
  const monthlyRate = annualReturnRate / 12 / 100;
  
  if (monthlyRate === 0) {
    return initialAmount + (monthlySavings * months);
  }
  
  // FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
  const onePlusRn = Math.pow(1 + monthlyRate, months);
  const futureValueFromInitial = initialAmount * onePlusRn;
  const futureValueFromPayments = monthlySavings * (onePlusRn - 1) / monthlyRate;
  const futureValue = futureValueFromInitial + futureValueFromPayments;
  
  return Math.round(futureValue * 100) / 100;
};

// Calcul câștig din investiții
exports.calculateInvestmentGain = (futureValue, totalInvested) => {
  return Math.round((futureValue - totalInvested) * 100) / 100;
};

// Calcul ajustare inflație
exports.calculateInflationAdjustedAmount = (amount, annualInflationRate, years) => {
  const adjustedAmount = amount * Math.pow(1 + annualInflationRate / 100, years);
  return Math.round(adjustedAmount * 100) / 100;
};

// Calcul rată lunară credit (formula amortizare)
exports.calculateMonthlyPayment = (principal, annualInterestRate, years) => {
  const monthlyRate = annualInterestRate / 12 / 100;
  const months = years * 12;
  
  if (monthlyRate === 0) {
    return Math.round((principal / months) * 100) / 100;
  }
  
  // PMT = P × [r(1 + r)^n] / [(1 + r)^n - 1]
  const onePlusRn = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = principal * (monthlyRate * onePlusRn) / (onePlusRn - 1);
  
  return Math.round(monthlyPayment * 100) / 100;
};

// Calcul total de plătit pentru credit
exports.calculateTotalPayment = (monthlyPayment, years) => {
  return Math.round(monthlyPayment * years * 12 * 100) / 100;
};

// Calcul dobândă totală
exports.calculateTotalInterest = (totalPayment, principal) => {
  return Math.round((totalPayment - principal) * 100) / 100;
};

// Calcul venit minim necesar (rata ≤ 40% din venit)
exports.calculateMinimumIncome = (monthlyPayment) => {
  return Math.round((monthlyPayment / 0.4) * 100) / 100;
};

// Calcul progres către obiectiv
exports.calculateProgress = (currentAmount, goalAmount) => {
  if (goalAmount === 0) return 0;
  const progress = (currentAmount / goalAmount) * 100;
  return Math.round(progress * 100) / 100;
};

// Conversie luni în ani + luni
exports.monthsToYearsAndMonths = (months) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return { years, months: remainingMonths };
};

// Generare plan de amortizare (pentru grafic)
exports.generateAmortizationSchedule = (principal, annualInterestRate, years, monthlyPayment) => {
  const monthlyRate = annualInterestRate / 12 / 100;
  const months = years * 12;
  let balance = principal;
  const schedule = [];
  
  for (let month = 1; month <= months; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    // Salvăm doar fiecare an (pentru vizualizare)
    if (month % 12 === 0 || month === months) {
      schedule.push({
        year: Math.ceil(month / 12),
        month: month,
        principalPayment: Math.round(principalPayment * 100) / 100,
        interestPayment: Math.round(interestPayment * 100) / 100,
        totalPayment: Math.round(monthlyPayment * 100) / 100,
        balance: Math.max(0, Math.round(balance * 100) / 100),
        cumulativeInterest: Math.round((monthlyPayment * month - (principal - balance)) * 100) / 100
      });
    }
  }
  
  return schedule;
};

// Helper function - Verifică dacă obiectivul este realizabil
exports.isGoalAchievable = (goalAmount, monthlySavings, annualReturnRate, currentAmount, maxMonths = 600) => {
  const months = exports.calculateMonthsWithInvestments(
    goalAmount, 
    monthlySavings, 
    annualReturnRate, 
    currentAmount
  );
  
  return {
    achievable: months <= maxMonths && months !== Infinity,
    months: months,
    years: Math.floor(months / 12),
    monthsRemaining: months % 12
  };
};

// Helper function - Calcul economii lunare necesare pentru a atinge obiectivul într-un anumit timp
exports.calculateRequiredMonthlySavings = (goalAmount, targetMonths, annualReturnRate, currentAmount = 0) => {
  const monthlyRate = annualReturnRate / 12 / 100;
  
  if (targetMonths <= 0) return Infinity;
  if (currentAmount >= goalAmount) return 0;
  
  if (monthlyRate === 0) {
    const remaining = goalAmount - currentAmount;
    return Math.ceil((remaining / targetMonths) * 100) / 100;
  }
  
  // Rezolvăm pentru PMT din: FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
  const onePlusRn = Math.pow(1 + monthlyRate, targetMonths);
  const futureValueFromInitial = currentAmount * onePlusRn;
  const remaining = goalAmount - futureValueFromInitial;
  
  // PMT = remaining × r / [(1+r)^n - 1]
  const requiredPayment = remaining * monthlyRate / (onePlusRn - 1);
  
  return Math.ceil(requiredPayment * 100) / 100;
};