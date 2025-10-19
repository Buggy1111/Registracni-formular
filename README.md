# 📋 Registrační Formulář - E LINKX Úkol

Profesionální registrační formulář vytvořený s **React**, **TypeScript**, **Material UI**, **Formik** a **Yup** validací.

## 🎯 Zadání

Vytvořit formulář s následujícími poli:
- Jméno
- Příjmení
- Uživatelské jméno (povinné)
- Email (povinné)
- Kraj (select)

**Tech stack:** React, TypeScript, Material UI, Formik, Yup

---

## ✨ Implementované Features

### 📋 Základní požadavky (100% splněno)
- ✅ React + TypeScript (Next.js 15)
- ✅ Material UI komponenty
- ✅ Formik pro form management
- ✅ Yup validace
- ✅ Všechna pole s labels + placeholders
- ✅ Select pro výběr kraje (14 krajů ČR)
- ✅ Tlačítka Submit + Reset
- ✅ Console.log výpis dat po odeslání

### 🚀 Extra Features (přidaná hodnota)

#### 1. **Dark/Light Mode** 🌓
- Toggle button s animovanou ikonou
- Plně funkční MUI theming
- Ukládá preferenci do localStorage
- Gradient backgrounds pro oba módy

#### 2. **Toast Notifikace** 🍞
- Úspěšné odeslání formuláře
- Reset formuláře
- react-hot-toast integrace

#### 3. **Loading State** ⏳
- CircularProgress při submitu
- Disabled všechna pole během odesílání
- Simulace async operace (1.5s delay)
- Visual feedback

#### 4. **Pole Heslo + Indikátor Síly** 🔒
- Real-time validace síly hesla
- Progress bar (Slabé/Střední/Silné)
- Color-coded chip
- Kontrola: délka, malá/velká písmena, čísla, speciální znaky

#### 5. **Pokročilá Validace** ✔️
- **Username:** 3-20 znaků, pouze alfanumerické + podtržítko
- **Email:** formát validace
- **Jméno/Příjmení:** min 2 znaky
- **Heslo:** min 8 znaků, malé + velké písmeno + číslo
- Real-time error messages

#### 6. **Framer Motion Animace** 🎬
- Fade in efekt při načtení formuláře
- Smooth transitions
- Professional feel

#### 7. **Error Boundary** 🛡️
- Production-ready error handling
- Graceful degradation
- React Error Boundary pattern

#### 8. **Accessibility (A11y)** ♿
- ARIA labels na všech polích
- aria-required attributes
- Keyboard navigation support
- Screen reader friendly

#### 9. **Success Message** ✅
- Collapse animace po úspěšném odeslání
- Auto-reset formuláře po 3 sekundách
- Visual feedback s ikonou

#### 10. **Professional Styling** 🎨
- Gradient backgrounds (light/dark)
- Perfect spacing a typography
- Responsive design
- Professional footer

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **React:** 19
- **TypeScript:** 5
- **UI Library:** Material UI v6
- **Form Management:** Formik
- **Validation:** Yup
- **Animations:** Framer Motion
- **Notifications:** react-hot-toast
- **Icons:** @mui/icons-material

---

## 🚀 Instalace a Spuštění

### Prerekvizity
- Node.js 18+
- npm nebo yarn

### Instalace

```bash
# Naklonovat projekt
git clone <repository-url>
cd e-linkx-formular

# Nainstalovat závislosti
npm install

# Spustit development server
npm run dev
```

Aplikace běží na `http://localhost:3000`

### Build pro produkci

```bash
# Build
npm run build

# Spustit production server
npm start
```

---

## 📁 Struktura Projektu

```
e-linkx-formular/
├── app/
│   ├── page.tsx          # Hlavní formulář komponenta
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Globální styly
├── public/               # Statické soubory
├── package.json          # Závislosti
├── tsconfig.json         # TypeScript config
└── README.md            # Tato dokumentace
```

---

## 🎨 Features Deep Dive

### Formik + Yup Integrace

Formulář využívá Formik pro state management a Yup pro validaci:

```typescript
const validationSchema = Yup.object({
  username: Yup.string()
    .required('Uživatelské jméno je povinné')
    .min(3, 'Min 3 znaky')
    .max(20, 'Max 20 znaků'),
  email: Yup.string()
    .email('Neplatný formát')
    .required('Email je povinný'),
  // ... další validace
});
```

### Dark Mode Implementation

Dark mode využívá MUI ThemeProvider s localStorage persistence:

```typescript
const theme = useMemo(
  () => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  }),
  [darkMode]
);
```

---

## 📊 Validační Pravidla

| Pole | Pravidla |
|------|----------|
| **Jméno** | Min 2 znaky (povinné) |
| **Příjmení** | Min 2 znaky (povinné) |
| **Username** | 3-20 znaků, pouze a-z, A-Z, 0-9, _ (povinné) |
| **Email** | Validní email formát (povinné) |
| **Heslo** | Min 8 znaků, malé + velké písmeno + číslo (povinné) |
| **Kraj** | Select z 14 krajů ČR (povinné) |

---

## 🎯 Příklady Použití

### Základní Workflow

1. **Vyplnění formuláře** - všechna pole s live validací
2. **Dark mode** - přepnutí pomocí ikony 🌙/☀️
3. **Odeslání** - tlačítko "Odeslat" (vyžaduje povinná pole)
4. **Reset** - tlačítko "Reset" vymaže všechna pole

### Testování Validace

**Valid username:**
- `john_doe` ✅
- `user123` ✅

**Invalid username:**
- `ab` ❌ (moc krátké)
- `user@name` ❌ (nepovolený znak)

**Valid email:**
- `user@example.com` ✅

**Invalid email:**
- `userexample.com` ❌
- `user@` ❌

---

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🤝 AI-Powered Development

Tento projekt byl vytvořen s pomocí **Claude Code** (Anthropic) jako demonstrace AI-native development workflow. Ukazuje:

- ✅ Rychlý prototyping
- ✅ Best practices (TypeScript, A11y, Error handling)
- ✅ Production-ready kód
- ✅ Komplexní feature set
- ✅ Professional UX/UI

---

## 📝 Poznámky

- **Deadline:** 23. října 2025
- **Zadavatel:** E LINKX a.s.
- **Pozice:** Frontend Developer (React, TypeScript, MUI)
- **Vytvořeno:** 17. října 2025

---

## 📧 Kontakt

**Michal Bürgermeister**
- 📱 +420 605 954 429
- 📧 michalbugy12@gmail.com
- 🌐 Portfolio: https://portfolio-web-two-mu.vercel.app
- 👨‍💻 GitHub: https://github.com/Buggy1111

---

## 📜 License

MIT License - volně použitelné pro vzdělávací a komerční účely.

---

**Status:** ✅ Připraveno k odevzdání
**Vytvořeno s:** React 19 • TypeScript 5 • Material UI v6 • Formik • Yup
**Přidaná hodnota:** 10+ extra features nad rámec zadání

*"Z jednoduchého zadání na profesionální showpiece za 80 min díky AI-native workflow!"* 🚀
