import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Sparkles, Calendar, DollarSign, PieChart, ArrowRight, CheckCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import ProfileDropdown from '../../components/layout/ProfileDropdown';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token || !!user);
  }, [user]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleCTAClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <img src="/src/assets/logo.png" alt="Logo" className="w-7.5 h-7.5" />
              </div>
              <span className="text-xl font-bold text-gray-900">TS FinVest</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">Cum Funcționează</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <ProfileDropdown
                  isOpen={dropdownOpen}
                  onToggle={() => setDropdownOpen(!dropdownOpen)}
                  name={user?.name || 'User'}
                  email={user?.email || 'user@example.com'}
                  avatar={user?.avatar}
                  onLogout={handleLogout}
                />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    Intră în cont
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
                  >
                    Începe acum
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Planifică-ți viitorul financiar cu
              <span className="text-blue-600"> sugestii personalizate</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Setează obiective, primești recomandări automate de alocare bazate pe profilul tău investițional și urmărește-ți progresul, totul într-un singur loc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
                >
                  Du-te la Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
                  >
                    Începe Gratuit
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl transition"
                  >
                    Intră în cont
                  </Link>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Sugestii personalizate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Algoritm inteligent</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>100% gratuit</span>
              </div>
            </div>
          </div>


{/* Hero Visual */}
<div className="relative">
  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">Sugestii Personalizate</h3>
      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-300">
        Echilibrat
      </span>
    </div>
    
    <div className="space-y-4">
      {/* ETF S&P 500 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Icon instead of emoji */}
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Titluri de stat Tezaur/Fidelis</p>
              <p className="text-sm text-gray-600">50% din buget</p>
            </div>
          </div>
          <p className="text-lg font-bold text-blue-600">$250/lună</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      {/* Acțiuni Blue-chip */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Icon instead of emoji */}
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Acțiuni blue-chip (Microsoft, Apple, J&J, Coca-Cola)</p>
              <p className="text-sm text-gray-600">30% din buget</p>
            </div>
          </div>
          <p className="text-lg font-bold text-blue-600">$150/lună</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
        </div>
      </div>

      {/* Estimat profit */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <p className="text-sm text-gray-600">Estimat în 36 luni</p>
        </div>
        <p className="text-2xl font-bold text-green-600">$20,830</p>
        <p className="text-sm text-green-600 mt-1">+$2,830 profit (+15.7%)</p>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

     {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tot ce ai nevoie pentru planificare financiară
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Instrumente inteligente pentru decizii financiare informate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Comparații Financiare */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comparații Financiare Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Vezi side-by-side diferențele între economisire simplă și investiții, sau între economisire integrală și credit bancar. Compară timp, costuri și câștiguri pentru fiecare strategie cu cifre concrete.
              </p>
            </div>

            {/* Feature 2 - Calculator Credit */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calculator Credit Bancar</h3>
              <p className="text-gray-600 leading-relaxed">
                Calculează automat rata lunară, dobânda totală și venitul minim necesar pentru un credit. Include validare avans 25% și proiecții complete de amortizare pe toată perioada creditului.
              </p>
            </div>

            {/* Feature 3 - Calcule Automate */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calcule Matematice Automate</h3>
              <p className="text-gray-600 leading-relaxed">
                Formule financiare profesionale aplicate în fundal: dobândă compusă pentru investiții, amortizare pentru credite, ajustări pentru inflație. Tu vezi doar rezultate clare și ușor de înțeles.
              </p>
            </div>

            {/* Feature 4 - Sugestii Personalizate */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sugestii Personalizate</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritmul realizat de noi va analiza profilul tău (buget, risc, obiectiv, orizont timp) și generează strategie de alocare optimă: procente exacte în ETF-uri, acțiuni, obligațiuni și crypto.
              </p>
            </div>

            {/* Feature 5 - Planuri Multiple */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Planuri Multiple Simultan</h3>
              <p className="text-gray-600 leading-relaxed">
                Gestionează mai multe obiective financiare în paralel, cum ar fi casă, educație, pensionare, mașină. Distribuie bugetul lunar între planuri și urmărește progresul fiecăruia individual și global.
              </p>
            </div>

            {/* Feature 6 - Știri Live */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Știri Financiare Live</h3>
              <p className="text-gray-600 leading-relaxed">
                Feed direct cu ultimele știri de pe CNBC despre piață, investiții și economie. Rămâi informat cu surse de încredere integrate în aplicație, fără limite și complet gratuit.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cum funcționează? 
            </h2>
            <p className="text-xl text-gray-600">
              De la înregistrare la atingerea obiectivelor în 4 pași
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Înregistrează-te</h3>
              <p className="text-gray-600">
                Creează cont gratuit în 30 de secunde. Nu e nevoie de card sau date financiare.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Setează Preferințe</h3>
              <p className="text-gray-600">
                Setezi buget lunar, nivel de risc (conservator/echilibrat/agresiv) și obiectivul financiar.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Primești Sugestii</h3>
              <p className="text-gray-600">
                Primești o strategie personalizată cu procente exacte și proiecții financiare bazate pe profilul tău.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Creează & Urmărește Planuri</h3>
              <p className="text-gray-600">
                Creezi planuri pas cu pas: obiectiv → sumă → strategie → tracking progres lunar.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm max-w-3xl mx-auto">
              <strong>Bonus:</strong> În orice moment poți ajusta preferințele, crea planuri multiple simultan și accesa știri financiare live direct în aplicație.
            </p>
          </div>
        </div>
      </section>

        {/* FAQ Section*/}
    <section id="faq" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Întrebări Frecvente
          </h2>
          <p className="text-xl text-gray-600">
            Tot ce trebuie să știi despre TS FinVest
          </p>
        </div>

        <div className="space-y-4">
          
          {/* FAQ 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              1. Ce este TS FinVest și la ce mă ajută?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              TS FinVest este o platformă gratuită de planificare financiară care te ajută să îți atingi obiectivele financiare, fie că vrei să cumperi o casă, să economisești pentru educație sau să investești pentru viitor. Platforma calculează automat cât timp îți ia să atingi fiecare obiectiv și compară diferite strategii (economisire simplă, investiții cu dobândă compusă sau credit bancar) pentru a identifica opțiunea cea mai potrivită situației tale. Primești timeline exact, costuri totale și recomandări personalizate de alocare a banilor bazate pe profilul tău de risc.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              2. Aplicația investește efectiv banii mei sau doar planifică?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-gray-900">TS FinVest este strict un instrument de planificare financiară.</strong> Nu gestionăm, nu transferăm și nu investim bani reali. Nu avem acces la conturile tale bancare și nu executăm tranzacții. Platforma oferă recomandări despre cum să îți aloci bugetul (ce procent în economii, investiții, etc.) și calculează proiecții realiste bazate pe formule matematice standard, dar tu decizi în final unde și cum investești efectiv prin banca ta, broker sau platforme de investiții. Suntem un planificator inteligent care te ajută să iei decizii informate, nu o platformă de trading care gestionează bani reali.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              3. Datele și informațiile mele financiare sunt protejate?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Securitatea datelor este prioritatea noastră absolută. Toate parolele sunt criptate folosind bcrypt, un standard industrial de securitate recunoscut global. Sesiunile sunt protejate cu JSON Web Tokens (JWT) pentru autentificare sigură, iar datele tale (preferințe, planuri, contribuții) sunt vizibile doar pentru tine și nu sunt niciodată partajate cu terți. Un aspect important este că nu stocăm informații sensibile precum numere de card sau conturi bancare, deoarece platforma nu procesează bani reali. Poți șterge contul oricând dorești, moment în care toate datele tale sunt eliminate permanent și irevocabil din baza de date.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              4. TS FinVest este gratuit? Există costuri ascunse?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Platforma este complet gratuită, fără nicio excepție. Nu există taxe de utilizare, abonamente lunare, upgrade-uri premium sau costuri ascunse de niciun fel. Toate funcționalitățile (calculatoare financiare avansate, comparații între strategii, tracking progres pentru planuri, dashboard personalizat) sunt disponibile gratuit pentru toți utilizatorii, fără limitări. Nu solicităm date de card la înregistrare și nu vei fi taxat niciodată pentru folosirea platformei. Proiectul a fost dezvoltat ca o soluție educațională open-source cu scopul de a democratiza accesul la planificarea financiară profesională pentru toată lumea.
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              5. Care este diferența între economisire simplă și investiții?
            </h3>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                <strong className="text-gray-900">Economisirea simplă</strong> reprezintă metoda prin care pui bani deoparte fără a-i investi, deci fără nicio dobândă (randament 0%). Această metodă este cea mai sigură deoarece nu există riscul de pierdere, dar este și cea mai lentă. Pentru exemplificare, dacă îți propui un obiectiv de 50.000 de dolari și economisești 500 de dolari lunar, vei avea nevoie de aproximativ 8 ani și 4 luni pentru a atinge ținta.
              </p>
              <p>
                <strong className="text-gray-900">Investițiile</strong> funcționează diferit prin utilizarea instrumentelor financiare precum ETF-uri, acțiuni sau obligațiuni pentru a genera dobândă compusă, cu randamente estimate între 5% și 12% anual în funcție de nivelul de risc acceptat. Continuând exemplul anterior, pentru același obiectiv de 50.000 de dolari și aceeași contribuție lunară de 500 de dolari, dar cu investiții la un randament de 7% anual, vei ajunge la țintă în aproximativ 6 ani și 8 luni. Aceasta înseamnă că economisești 20 de luni din timp și investești cu aproximativ 10.000 de dolari mai puțin din buzunar, deși există riscul de fluctuații pe termen scurt.
              </p>
              <p className="text-gray-600 font-medium">
                Platforma îți prezintă ambele opțiuni detaliat, side-by-side, astfel încât să poți decide în cunoștință de cauză ce metodă se potrivește cel mai bine situației și toleranței tale la risc.
              </p>
            </div>
          </div>

          {/* FAQ 6 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              6. Cum aleg între economisire integrală și credit bancar?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Decizia între economisire integrală și credit bancar depinde fundamental de două factori: urgența cu care ai nevoie să îți atingi obiectivul și costul pe care ești dispus să îl plătești pentru timp. Economisirea integrală necesită mai mult timp pentru acumulare dar nu implică plata dobânzii. De exemplu, pentru achiziționarea unui apartament în valoare de 100.000 de dolari, ar fi nevoie de aproximativ 12 ani de economisire dedicată. Pe de altă parte, creditul bancar (care necesită un avans minim de 25% din valoarea obiectivului) îți permite să achiziționezi proprietatea imediat, dar costă semnificativ mai mult pe termen lung. Pentru același apartament de 100.000 de dolari, pe o perioadă de 25 de ani la o dobândă standard, vei plăti aproximativ 76.000 de dolari în dobândă suplimentară. Platforma calculează automat ambele scenarii și îți prezintă clar comparația între timpul de așteptare necesar economisirii versus costul financiar suplimentar al creditului, astfel încât să poți lua o decizie informată care reflectă prioritățile tale personale.
            </p>
          </div>

          {/* FAQ 7 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              7. Pot gestiona mai multe obiective financiare simultan?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Absolut! Platforma permite crearea de planuri separate și independente pentru fiecare obiectiv financiar pe care îl ai (casă, mașină, educație, pensionare, fond de urgență etc.) și te ajută să îți distribui inteligent bugetul lunar între acestea. Pentru exemplificare, dacă dispui de 1.000 de dolari lunar pentru economisire, poți aloca 600 de dolari pentru avansul unei case, 300 de dolari pentru educația copiilor și 100 de dolari pentru un fond de urgență. Fiecare plan beneficiază de propriul sistem de tracking al progresului, calcule financiare separate și timeline personalizat. În Dashboard-ul central poți vizualiza progresul global pe toate planurile active, cât ai investit în total și cum se distribuie alocările tale, totul într-o singură interfață centralizată și ușor de înțeles.
            </p>
          </div>

          {/* FAQ 8 - Versiune Ultra-Simplă, Fără Bare */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              8. Ce înseamnă nivelurile de risc și cum aleg cel potrivit?
            </h3>
            <div className="text-gray-600 leading-relaxed space-y-4">
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Risc Scăzut (Conservator)</p>
                <p className="text-sm">
                  Acest profil prioritizează siguranța capitalului și minimizarea volatilității. Alocarea sugerată include 60% în obligațiuni guvernamentale și corporative stabile, 25% în ETF-uri cu risc scăzut și 15% în cash sau depozite bancare. Randamentul estimat este de până la 5% anual. Acest profil este ideal dacă ai nevoie de bani în interval scurt (1 până la 3 ani) sau dacă nu tolerezi fluctuații mari ale valorii investițiilor tale.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-2">Risc Mediu (Echilibrat)</p>
                <p className="text-sm">
                  Acest profil oferă un echilibru optim între siguranță și potențial de creștere. Alocarea recomandată cuprinde 50% în ETF-uri diversificate pe sectoare multiple, 30% în acțiuni blue-chip de companii mari și stabile, 15% în obligațiuni și 5% în crypto pentru diversificare alternativă. Randamentul estimat se situează între 7% și 10% anual. Este recomandat pentru un orizont de investiție de 3 până la 7 ani și presupune o toleranță moderată la volatilitatea pieței.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-2">Risc Ridicat (Agresiv)</p>
                <p className="text-sm">
                  Acest profil maximizează potențialul de creștere pe termen lung acceptând volatilitate ridicată pe termen scurt. Alocarea sugerată include 40% în acțiuni growth de companii inovatoare cu potențial mare de apreciere, 30% în crypto și active digitale, 20% în ETF-uri tematice focusate pe sectoare emergente și 10% în acțiuni blue-chip pentru stabilitate minimă. Randamentul estimat depășește 12% anual. Este potrivit pentru un orizont de investiție de peste 7 ani și necesită acceptarea completă a fluctuațiilor semnificative pe perioade scurte de timp.
                </p>
              </div>
              
            </div>
          </div>

          {/* FAQ 9 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              9. Trebuie să am cunoștințe financiare avansate pentru a folosi platforma?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Nu este necesară nicio experiență prealabilă în finanțe!</strong> Platforma a fost concepută special pentru a fi accesibilă oricui dorește să își planifice viitorul financiar, indiferent de nivelul de cunoștințe sau experiență în domeniu. Interfața te ghidează pas cu pas prin întreg procesul: completezi un formular simplu cu informații despre situația ta actuală (buget lunar disponibil, obiective financiare), alegi nivelul de risc cu care te simți confortabil și primești automat sugestii personalizate însoțite de explicații clare și detaliate. Toate calculele matematice complexe (dobândă compusă, amortizare credit, proiecții temporale) sunt procesate automat în fundal, iar tu vezi doar rezultate clare, comparații vizuale intuitive și concluzii ușor de înțeles. Este ca și cum ai avea un asistent financiar personal dedicat, dar complet gratuit și disponibil oricând ai nevoie.
            </p>
          </div>

        </div>
      </div>
    </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {isLoggedIn ? (
                <>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Bine ai revenit! 
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Continuă să-ți gestionezi planurile financiare și să urmărești progresul
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition shadow-xl text-lg"
                  >
                    Du-te la Dashboard
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Gata să începi planificarea financiară?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8">
                    Înregistrează-te gratuit și primește sugestii personalizate în câteva minute
                  </p>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition shadow-xl text-lg"
                  >
                    Începe Acum Gratuit
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </>
              )}
            </div>
         </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">TS FinVest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Planificator financiar inteligent cu sugestii personalizate
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produs</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">Cum Funcționează</a></li>
                <li><Link to="/signup" className="hover:text-white transition">Începe Acum</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Termeni și Condiții</a></li>
                <li><a href="#" className="hover:text-white transition">Politica de Confidențialitate</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                © 2025 TS FinVest<br />
                Toate drepturile rezervate
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;