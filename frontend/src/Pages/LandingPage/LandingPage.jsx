import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Sparkles, Calendar, DollarSign, PieChart, ArrowRight, CheckCircle } from 'lucide-react';
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
              <div className="bg-blue-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Planificare Inteligentă
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Planifică-ți viitorul financiar cu
              <span className="text-blue-600"> sugestii personalizate</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Setează obiective, primești recomandări automate de alocare bazate pe profilul tău investițional și urmărește-ți progresul - totul într-un singur loc.
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
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Echilibrat
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-semibold text-gray-900">ETF S&P 500</p>
                        <p className="text-sm text-gray-600">50% din buget</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600">$250/lună</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold text-gray-900">Acțiuni Blue-chip</p>
                        <p className="text-sm text-gray-600">30% din buget</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600">$150/lună</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
                  <p className="text-sm text-gray-600 mb-1">Estimat în 36 luni</p>
                  <p className="text-2xl font-bold text-green-600">$20,150</p>
                  <p className="text-sm text-green-600 mt-1">+$2,150 profit (+11.94%)</p>
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
              Simplu, inteligent și personalizat pentru fiecare utilizator
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sugestii Personalizate</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritm inteligent care generează recomandări de alocare bazate pe profilul tău de risc, buget și orizont de timp.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Planuri Financiare</h3>
              <p className="text-gray-600 leading-relaxed">
                Creează și urmărește obiective multiple - casă, pensionare, educație. Adaugă contribuții și vezi progresul în timp real.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Intuitiv</h3>
              <p className="text-gray-600 leading-relaxed">
                Vizualizează toate planurile și sugestiile într-un singur loc. Design curat și ușor de folosit.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tracking Progres</h3>
              <p className="text-gray-600 leading-relaxed">
                Adaugă contribuții lunare și urmărește cum crește suma investită către obiectivele tale financiare.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Știri Financiare</h3>
              <p className="text-gray-600 leading-relaxed">
                Rămâi la curent cu ultimele știri despre investiții, piață și economie - integrate direct în aplicație.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proiecții Financiare</h3>
              <p className="text-gray-600 leading-relaxed">
                Vezi estimări realiste despre câți bani vei avea în viitor bazate pe contribuțiile și randamentele estimate.
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
              Simplu în 4 pași
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Înregistrează-te</h3>
              <p className="text-gray-600">Creează cont gratuit în 30 de secunde</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Setează Preferințe</h3>
              <p className="text-gray-600">Răspunde la câteva întrebări despre obiectivele tale</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Primești Sugestii</h3>
              <p className="text-gray-600">Algoritmul generează recomandări personalizate</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Urmărește Progresul</h3>
              <p className="text-gray-600">Adaugă contribuții și vezi cum crești</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🆓 TS FinVest este gratuit?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Da, 100% gratuit! Nu există taxe ascunse, abonamente sau costuri. Toate funcționalitățile - sugestii personalizate, tracking planuri, dashboard și știri - sunt complet gratuite.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                💰 TS FinVest investește bani reali?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <strong>Nu.</strong> TS FinVest este un tool de <strong>planificare financiară</strong>, nu o platformă de trading. Nu gestionăm bani reali și nu executăm tranzacții. Îți oferim recomandări inteligente despre cum să-ți aloci bugetul, iar tu decizi unde și cum să investești efectiv.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🤖 Cum funcționează algoritmul de sugestii?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritmul analizează profilul tău - buget lunar, nivel de risc (conservator/echilibrat/agresiv), obiectiv principal și orizont de timp. Pe baza acestor date, generează o strategie de alocare personalizată (ETF-uri, acțiuni, obligațiuni, crypto) și calculează proiecții financiare realiste folosind formule de dobândă compusă.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                📊 Ce înseamnă nivelurile de risc?
              </h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p><strong>Conservator (Risc Scăzut):</strong> 60% obligațiuni + 25% ETF + 15% cash. Randament estimat: 4-6% anual. Ideal pentru capital pe termen scurt sau aversiune la risc mare.</p>
                <p><strong>Echilibrat (Risc Mediu):</strong> 50% ETF + 30% acțiuni + 15% obligațiuni + 5% crypto. Randament estimat: 7-10% anual. Echilibru între siguranță și creștere.</p>
                <p><strong>Agresiv (Risc Ridicat):</strong> 40% acțiuni growth + 30% crypto + 20% ETF tematice + 10% blue-chip. Randament estimat: 12-20% anual. Pentru orizont lung și toleranță mare la volatilitate.</p>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🔒 Datele mele sunt sigure?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Da! Folosim criptare pentru toate datele sensibile (parole, informații personale). Nu stocăm informații financiare reale (carduri, conturi bancare) deoarece nu procesăm bani. Datele tale sunt vizibile doar pentru tine și nu sunt partajate cu terți.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🎯 Cum primesc sugestii personalizate?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                După înregistrare, vei completa un formular de preferințe (2-3 minute) cu întrebări despre bugetul lunar, toleranța la risc, obiectivul principal (casă, pensionare, educație etc.) și orizontul de timp. Imediat după salvare, vei vedea sugestiile în Dashboard - o strategie completă de alocare cu proiecții financiare.
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                📈 Cum urmăresc progresul?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Creezi planuri financiare (ex: "Avans casă $50,000 în 3 ani") și adaugi contribuții lunare. Aplicația trackuiește automat progresul cu progress bars, calculează cât ai investit și cât mai lipsește. În Dashboard vezi statistici generale: total investit, planuri active, progres mediu.
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🗑️ Pot șterge contul și datele mele?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Da, poți șterge contul oricând din Profil → Setări. La ștergere, toate datele tale (preferințe, planuri, contribuții) sunt eliminate permanent din baza de date. Operațiunea este ireversibilă.
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
                Bine ai revenit! 👋
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