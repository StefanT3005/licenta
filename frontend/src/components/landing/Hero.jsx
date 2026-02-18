import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { ArrowUpRight, Wallet, Activity } from "lucide-react";
const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32 space-y-24">
      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          
          
          <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
            <div>
              <span className="flex items-center gap-2 text-blue-600 font-semibold uppercase tracking-wider text-sm">
                <TrendingUp className="w-4 h-4" />
                Investește Inteligent
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Preia controlul asupra viitorului tău financiar.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Într-o lume volatilă, ai nevoie de claritate. Descoperă ultimele noutăți financiare, 
                alege planuri de investiții personalizate și gestionează-ți portofoliul într-un singur loc.
                
              </p>
              <div className="mt-8 flex gap-x-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-800 transition-all duration-200"
                >
                  Începe acum
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 transition-all duration-200"
                >
                  Intră în cont
                </Link>
              </div>
            </div>
          </div>

          
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:flex lg:items-center">
  <div className="relative mx-auto max-w-[320px] sm:max-w-md lg:max-w-none">
    
    {/* CARDUL PRINCIPAL - DASHBOARD */}
    <div className="relative rounded-2xl shadow-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 overflow-hidden z-10">
      
      {/* Header Card: Balanța */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Portofoliu Total</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">$24,593.00</h3>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-bold">+12.5%</span>
        </div>
      </div>

      {/* Grafic Simulat (SVG simplu) */}
      <div className="h-24 w-full mb-6 relative">
         {/* Linie gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
         <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path d="M0 35 Q 25 35, 30 20 T 60 25 T 100 5" fill="none" stroke="#3b82f6" strokeWidth="2" />
            {/* Puncte pe grafic */}
            <circle cx="30" cy="20" r="2" className="fill-blue-400 animate-pulse" />
            <circle cx="100" cy="5" r="2" className="fill-blue-400" />
         </svg>
      </div>

      {/* Lista Active (Mini List) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">₿</div>
            <div>
              <p className="text-white text-sm font-medium">Bitcoin</p>
              <p className="text-slate-500 text-xs">BTC</p>
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">+$1,204</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">A</div>
            <div>
              <p className="text-white text-sm font-medium">Apple Inc.</p>
              <p className="text-slate-500 text-xs">AAPL</p>
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">+$243.5</span>
        </div>
      </div>
    </div>

    {/* CARD PLUTITOR 1 (Dreapta Sus) - Notificare */}
    <div className="absolute -top-6 -right-6 sm:-right-12 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg transform rotate-6 animate-pulse hidden sm:block">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-500 rounded-lg">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white text-xs font-bold">Ordin Executat</p>
          <p className="text-slate-300 text-[10px]">Cumpărare AAPL</p>
        </div>
      </div>
    </div>

    {/* CARD PLUTITOR 2 (Stanga Jos) - Analiza */}
    <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-blue-600 p-3 sm:p-4 rounded-xl shadow-xl flex items-center gap-3 z-20">
      <div className="bg-white/20 p-1.5 rounded-lg">
        <Activity className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-white text-xs sm:text-sm font-bold">Risc Calculat</p>
        <p className="text-blue-100 text-[10px] sm:text-xs">Nivel: Scăzut</p>
      </div>
    </div>

  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;