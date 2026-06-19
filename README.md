  # TS FinVest

  Aplicație web pentru planificare financiară și planuri de investiții, dezvoltată ca lucrare de licență.

  Platforma permite utilizatorilor să își seteze obiective financiare (studii, locuință, bunuri diverse), să aleagă între economisire pură sau combinație cu
   credit, să primească sugestii personalizate de investiții în funcție de profilul de risc și să urmărească progresul lor prin contribuții lunare.

  ---

  ## Cuprins

  1. [Funcționalități](#funcționalități)
  2. [Tehnologii folosite](#tehnologii-folosite)
  3. [Structura proiectului](#structura-proiectului)
  4. [Cerințe](#cerințe)
  5. [Instalare și configurare](#instalare-și-configurare)
  6. [Variabile de mediu](#variabile-de-mediu)
  7. [Pornirea aplicației](#pornirea-aplicației)
  8. [Utilizare](#utilizare)
  9. [Endpoint-uri API](#endpoint-uri-api)
  10. [Calcule financiare](#calcule-financiare)
  11. [Cont de administrator](#cont-de-administrator)
  12. [Posibile îmbunătățiri](#posibile-îmbunătățiri)
  13. [Autor](#autor)

  ---

  ## Funcționalități

  ### Pentru utilizatori
  - Înregistrare și autentificare cu email și parolă
  - Verificare email prin link de confirmare
  - Setarea preferințelor inițiale: buget lunar, profil de risc (conservator/echilibrat/agresiv), obiectiv principal și orizont temporal
  - Creare planuri financiare cu calcul automat al:
    - Numărului de luni necesare pentru atingerea obiectivului (cu și fără investiții)
    - Proiecției valorii viitoare a investițiilor (formula dobânzii compuse)
    - Ratei lunare la credit, cu grafic de amortizare (în cazul plății prin credit)
    - Venitului minim necesar pentru aprobarea creditului (regula gradului de îndatorare 40%)
  - Adăugarea de contribuții la planuri și urmărirea progresului
  - Sugestii personalizate de investiții (ETF-uri, titluri de stat Tezaur/Fidelis, acțiuni blue-chip)
  - Dashboard cu statistici personale (planuri active, total economisit, progres mediu)
  - Secțiune de știri financiare actualizate (CNBC via NewsAPI)
  - Gestionarea profilului (modificare nume, schimbare parolă, ștergere cont)

  ### Pentru administrator
  - Vizualizarea tuturor utilizatorilor cu statistici
  - Vizualizarea detaliilor despre fiecare utilizator (planuri, preferințe)
  - Acordare/revocare drepturi de administrator
  - Ștergerea utilizatorilor
  - Statistici globale ale platformei

  ---

  ## Tehnologii folosite

  ### Backend
  - **Node.js** + **Express 5** - server și rutare
  - **MongoDB** + **Mongoose** - bază de date și ORM
  - **JSON Web Tokens (JWT)** - autentificare
  - **Bcrypt** - hash-ul parolelor
  - **Nodemailer** - trimiterea email-urilor de verificare
  - **Axios** - preluarea știrilor din NewsAPI
  - **dotenv** - gestionarea variabilelor de mediu

  ### Frontend
  - **React 19** - bibliotecă UI
  - **Vite** - build tool și dev server
  - **React Router v7** - navigare
  - **Tailwind CSS v4** - stilizare
  - **Axios** - comunicare cu API-ul
  - **React Hot Toast** - notificări
  - **Lucide React** + **React Icons** - iconițe
  - **Moment.js** - formatare date

  ---

  ## Structura proiectului

  ```
  TS-FinVest/
  ├── backend/
  │   ├── config/
  │   │   └── db.js                    # Conexiune MongoDB
  │   ├── controllers/
  │   │   ├── adminController.js       # Logica panoului de admin
  │   │   ├── authController.js        # Login, signup, verificare email
  │   │   ├── planController.js        # CRUD planuri financiare
  │   │   ├── preferencesController.js # Preferințe utilizator
  │   │   └── userController.js        # Profil utilizator
  │   ├── middleware/
  │   │   └── authMiddleware.js        # Verificare JWT și rol admin
  │   ├── models/
  │   │   ├── Plan.js
  │   │   ├── User.js
  │   │   └── UserPreferences.js
  │   ├── routes/
  │   │   ├── adminRoutes.js
  │   │   ├── authRoutes.js
  │   │   ├── newsRoutes.js
  │   │   ├── planRoutes.js
  │   │   ├── preferencesRoutes.js
  │   │   └── userRoutes.js
  │   ├── utils/
  │   │   ├── financialCalculations.js # Formule financiare
  │   │   └── suggestionAlgorithm.js   # Alocări pe profil de risc
  │   ├── server.js
  │   └── package.json
  │
  └── frontend/
      ├── src/
      │   ├── Pages/
      │   │   ├── Admin/
      │   │   ├── Auth/                # Login, Signup
      │   │   ├── Dashboard/
      │   │   ├── LandingPage/
      │   │   ├── News/
      │   │   ├── Plans/
      │   │   ├── Preferences/
      │   │   ├── Profile/
      │   │   └── VerifyEmail/
      │   ├── components/
      │   ├── context/
      │   │   └── AuthContext.jsx      # State global autentificare
      │   ├── utils/
      │   │   ├── api.js               # Configurare Axios + interceptors
      │   │   └── iconMap.js
      │   ├── App.jsx
      │   ├── main.jsx
      │   └── index.css
      ├── index.html
      ├── vite.config.js
      └── package.json
  ```

  ---

  ## Cerințe

  - **Node.js** v18 sau mai nou
  - **npm** (vine cu Node.js)
  - **MongoDB** instalat local SAU un cluster MongoDB Atlas
  - Un cont **Gmail** cu parolă de aplicație (pentru trimiterea email-urilor de verificare)
  - O cheie API de la [NewsAPI](https://newsapi.org/) (pentru secțiunea de știri)

  ---

  ## Instalare și configurare

  ### 1. Clonarea repository-ului

  ```bash
  git clone <url-repository>
  cd TS-FinVest-
  ```

  ### 2. Instalarea dependențelor backend

  ```bash
  cd backend
  npm install
  ```

  ### 3. Instalarea dependențelor frontend

  ```bash
  cd ../frontend
  npm install
  ```

  ---

  ## Variabile de mediu

  În folderul `backend/`, creează un fișier `.env` cu următorul conținut:

  ```env
  # Server
  PORT=8000

  # MongoDB
  MONGO_URI=mongodb://localhost:27017/tsfinvest

  # JWT
  JWT_SECRET=cheie_secreta

  # Frontend
  FRONTEND_URL=http://localhost:5173

  # Email (Gmail)
  EMAIL_USER=adresa@gmail.com
  EMAIL_PASSWORD=parola_gmail

  # News API
  NEWS_API_KEY=cheie_newsapi
  ```

  ### Cum obții variabilele

  - **MONGO_URI**: dacă rulezi MongoDB local, lasă valoarea de mai sus. Dacă folosești MongoDB Atlas, copiază connection string-ul din panoul de cluster.
  - **JWT_SECRET**: generează un string lung și random (minim 32 caractere).
  - **EMAIL_PASSWORD**: din contul Google, secțiunea Security, 2-Step Verification, App passwords. Nu folosi parola contului tău Gmail.
  - **NEWS_API_KEY**: înregistrare gratuită la [newsapi.org](https://newsapi.org/).

  > Dacă variabilele pentru email lipsesc, înregistrarea funcționează, dar email-ul de verificare nu se trimite. Dacă lipsește `NEWS_API_KEY`, secțiunea
  News va returna eroare.

  ---

  ## Pornirea aplicației

  ### Backend

  ```bash
  cd backend
  npm run dev
  ```

  Serverul pornește pe `http://localhost:8000`.

  ### Frontend

  În alt terminal:

  ```bash
  cd frontend
  npm run dev
  ```

  Aplicația se deschide la `http://localhost:5173`.

  > Asigură-te că MongoDB rulează înainte de a porni backend-ul.

  ---

  ## Utilizare

  1. Accesează `http://localhost:5173` și creează un cont nou.
  2. (Opțional) Verifică email-ul prin link-ul primit.
  3. Completează preferințele inițiale (buget lunar, profil de risc, obiectiv).
  4. Din Dashboard, apasă "Creează plan nou".
  5. Completează datele planului în wizard (categorie, sumă obiectiv, deadline, metodă de plată).
  6. Vizualizează proiecția economiilor și alocarea sugerată pentru investiții.
  7. Adaugă contribuții lunare pentru a urmări progresul.
  8. Consultă secțiunea News pentru noutăți din piețele financiare.

  ---

  ## Endpoint-uri API

  ### Autentificare (`/api/auth`)

  | Metodă | Endpoint               | Descriere                    | Protejat |
  |--------|------------------------|------------------------------|----------|
  | POST   | `/signup`              | Creare cont nou              | Nu       |
  | POST   | `/login`               | Autentificare                | Nu       |
  | POST   | `/verify-email`        | Verificare email cu token    | Nu       |
  | POST   | `/logout`              | Deconectare                  | Nu       |
  | GET    | `/me`                  | Datele utilizatorului curent | Da       |
  | PUT    | `/update-profile`      | Actualizare profil           | Da       |
  | PUT    | `/change-password`     | Schimbare parolă             | Da       |
  | POST   | `/resend-verification` | Retrimitere email verificare | Da       |
  | DELETE | `/delete-account`      | Ștergere cont                | Da       |

  ### Planuri (`/api/plans`)

  | Metodă | Endpoint            | Descriere                         |
  |--------|---------------------|-----------------------------------|
  | GET    | `/`                 | Listează planurile utilizatorului |
  | POST   | `/`                 | Creează plan nou                  |
  | GET    | `/:id`              | Detalii plan                      |
  | PUT    | `/:id`              | Actualizare plan                  |
  | DELETE | `/:id`              | Ștergere plan                     |
  | POST   | `/:id/contribute`   | Adăugare contribuție              |
  | GET    | `/stats/dashboard`  | Statistici pentru dashboard       |

  ### Preferințe (`/api/preferences`)

  | Metodă | Endpoint        | Descriere                                |
  |--------|-----------------|------------------------------------------|
  | GET    | `/`             | Preferințele utilizatorului              |
  | POST   | `/`             | Setare sau actualizare preferințe        |
  | GET    | `/check`        | Verifică dacă preferințele sunt complete |
  | GET    | `/suggestions`  | Sugestii de investiții bazate pe risc    |
  | DELETE | `/`             | Ștergere preferințe                      |

  ### Admin (`/api/admin`)

  | Metodă | Endpoint                       | Descriere                    |
  |--------|--------------------------------|------------------------------|
  | GET    | `/stats`                       | Statistici globale platformă |
  | GET    | `/users`                       | Listează toți utilizatorii   |
  | GET    | `/users/:userId`               | Detalii utilizator           |
  | DELETE | `/users/:userId`               | Ștergere utilizator          |
  | PATCH  | `/users/:userId/toggle-admin`  | Schimbă rolul de admin       |

  ### Știri (`/api/news`)

  | Metodă | Endpoint | Descriere                          |
  |--------|----------|------------------------------------|
  | GET    | `/all`   | Listează știrile financiare (CNBC) |

  ---

  ## Calcule financiare

  Toate formulele sunt implementate în `backend/utils/financialCalculations.js`:

  - **Valoarea viitoare (FV)** a economiilor cu dobândă compusă:
    `FV = PV × (1+r)ⁿ + PMT × [(1+r)ⁿ - 1] / r`

  - **Numărul de luni necesare** pentru atingerea obiectivului fără investiții: împărțire simplă a sumei rămase la economia lunară.

  - **Numărul de luni cu investiții**: pentru cazul `PV = 0` se folosește o formulă logaritmică directă. Pentru `PV > 0` se aplică metoda **Newton-Raphson**
   (iterativ), pentru că ecuația nu are soluție analitică.

  - **Rata lunară la credit** (formula anuității): `PMT = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]`

  - **Graficul de amortizare**: descompunerea fiecărei rate în principal și dobândă, lună de lună.

  - **Ajustarea pentru inflație**: `valoare_ajustată = valoare × (1 + rata_inflatiei)^ani`

  - **Venitul minim necesar**: `rata_lunară / 0.4` (regula gradului de îndatorare maxim 40% aplicată de băncile din România).

  ---

  ## Cont de administrator

  Implicit, toți utilizatorii noi au `is_admin: false`. Pentru a transforma un utilizator în administrator, modifică direct în MongoDB:

  ```js
  db.users.updateOne(
    { email: "admin@exemplu.com" },
    { $set: { is_admin: true } }
  )
  ```

  După această modificare, utilizatorul respectiv va avea acces la pagina `/admin` după re-login.

  ---

  ## Posibile îmbunătățiri

  Funcționalități care nu au fost implementate dar care ar putea fi adăugate într-o versiune viitoare:

  - Migrare de la `localStorage` la cookies `httpOnly` pentru token-ul JWT (securitate XSS)
  - Refresh tokens cu access tokens cu durată scurtă
  - Pagination pentru listele de utilizatori și planuri
  - Cache cu Redis pentru sugestii și știri
  - Notificări push când utilizatorul atinge un milestone
  - Grafic vizual al proiecției economiilor (Chart.js sau Recharts)
  - Export PDF al planului financiar
  - Teste automate (Jest pentru backend, React Testing Library pentru frontend)
  - Rate limiting pe API
  - Deploy: frontend pe Vercel, backend pe Railway sau Render, DB pe MongoDB Atlas

  ---

  ## Autor

  **Tudosa Ștefan**

  Lucrare de licență, 2026

  ---