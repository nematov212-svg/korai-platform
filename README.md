# Ko'rAI — Professional AI Visual Problem Diagnosis Platform

> **"Muammoni ko‘rsating. Ko‘rAI yechim topishga yordam beradi."**

Ko'rAI — ko‘rinib turgan texnik, maishiy va mexanik nosozliklarni sun’iy intellekt (Computer Vision & Multimodal LLM) orqali chuqur tahlil qiluvchi, xolis vizual dalillar asosida ehtimoliy sabablarni saralovchi, xavfsiz tekshirish qadamlarini ko‘rsatuvchi va zarur asboblar ro‘yxatini tavsiya etuvchi to‘liq stakli veb-platforma.

---

## 🌟 Asosiy Imkoniyatlar (Features)

1. **Multimodal Vizual AI Tahlili (Computer Vision)**:
   - Haqiqiy multimodal AI modellari bilan integratsiya (`Google Gemini 1.5/2.0 Flash` yoki `OpenAI GPT-4o-mini`).
   - Ob’yektiv vizual dalillarni aniqlash, ehtimoliy sabablar reytingi (Yuqori / O‘rta / Past), xavfsiz amaliy tekshirish qadamlari va kerakli asboblar/ehtiyot qismlar ro‘yxati.
   - Vizual dalil yetarli bo‘lmaganda sun’iy da’vo qilmasdan, aniqlashtiruvchi savollar berish (`Follow-Up Q&A`).

2. **Qat’iy Xavfsizlik Protokollari (Safety First)**:
   - 220V/380V elektr toki, tabiiy gaz sizishi, yuqori bosim, ochiq olov va avtomobil tormoz/rul boshqaruvi bo‘yicha avtomatik ogohlantirishlar bannerlari.
   - Xavfli o‘zboshimchalik bilan ta’mirlashni to‘xtatish va professional ustani jalb qilish bo‘yicha aniq tavsiyalar.

3. **To‘liq Kamera va Rasm Qabul Qilish Tizimi (Camera & Intake Engine)**:
   - Brauzer kamerasi orqali to‘g‘ridan-to‘g‘ri suratga olish (mobil qurilmalarda orqa kamerani tanlash, old/orqa kamerani almashtirish).
   - Drag-and-drop va fayl tanlash (JPEG, PNG, WebP — 10MB gacha).
   - `sharp` orqali serverda MIME tekshiruvi, xavfsiz optimallashtirish va o‘lchamni moslash.

4. **Keng Qamrovli Yo‘nalishlar (Modular Problem Domains)**:
   - Maishiy texnika (kir yuvish mashinalari, muzlatgichlar, gaz plitalari, mikroto‘lqinli pechlar).
   - Avtomobillar (dvigatel uzelari, suyuqlik sizishi, tormoz, shina yeyilishi).
   - Kompyuter va smartfonlar (noutbuklar, ekranlar, portlar, ona plata komponentlari).
   - Santexnika va uy ta’miri (quvurlar, kranlar, devor namligi va darzlar).
   - Elektronika (bosma platalar, kondensatorlar, rezistorlar, lehim nuqsonlari).
   - Universal & Umumiy shikastlanishlar.

5. **Foydalanuvchi Boshqaruvi va Xavfsizlik (Security & Access Control)**:
   - Argon2id / bcrypt parol xeshlash.
   - Qisqa muddatli Access Token (JWT, 15m) + xavfsiz Refresh Token rotatsiyasi (DB-hashed, 7d).
   - IDOR (Broken Object Level Authorization) himoyasi — boshqa foydalanuvchilarning hisobotlari va rasmlariga ruxsatsiz kirish butunlay bloklangan.
   - AI so‘rovlari va avtorizatsiya uchun qat’iy Rate Limiting (`express-rate-limit`).
   - Xavfsizlik sarlavhalari (`helmet`, CORS allowlist).

6. **Interaktiv Ishchi Maydoni va Hisobotlar**:
   - `/app` — Shaxsiy dashboard, so‘nggi tashxislar, oylik kvota ko‘rsatkichi.
   - `/app/diagnose` — Qadamma-qadam diagnostika sehrgari (Wizard).
   - `/app/history` — Filtrlanuvchi, qidiriluvchi va saralanuvchi tashxislar arxivi.
   - `/app/history/:id` — To‘liq vizual hisobot, chop etish (Print/PDF), interaktiv fikr-mulohaza (Feedback).
   - `/app/favorites` — Saqlab qo‘yilgan yechimlar.
   - `/app/billing` — Kvotalar va tarif rejalari.
   - `/app/settings` — Profil va maxfiylik sozlamalari.

---

## 🏗️ Loyiha Strukturasi (Project Architecture)

```text
korai/
├── backend/                        # Express.js + TypeScript REST API
│   ├── prisma/
│   │   └── schema.prisma           # PostgreSQL Prisma sxemasi va indekslar
│   ├── src/
│   │   ├── config/                 # Typed muhit sozlamalari (process.env)
│   │   ├── controllers/            # Auth, Diagnosis, Billing kontrollerlari
│   │   ├── middleware/             # Auth, Error, Rate-limit, Multer upload
│   │   ├── providers/
│   │   │   ├── ai/                 # Gemini & OpenAI modulli AI provayderlari
│   │   │   └── storage/            # Sharp optimallashtirilgan lokal/S3 saqlagich
│   │   ├── routes/                 # /api/v1 endpoint marshrutlari
│   │   ├── schemas/                # Zod kiruvchi va AI chiquvchi sxemalari
│   │   ├── services/               # Biznes mantiq (Auth, Diagnosis, Billing)
│   │   ├── tests/                  # 22 ta avtomatlashtirilgan Vitest testlari
│   │   ├── app.ts                  # Express ilovasi konfiguratsiyasi
│   │   └── index.ts                # Server bootstrap va graceful shutdown
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/                       # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── camera/             # CameraCaptureModal, ImageUploader
│   │   │   ├── diagnosis/          # DiagnosticReportView, FollowUpForm, AnalyzingLoader
│   │   │   ├── landing/            # Hero, Categories, HowItWorks, SampleReport, Safety, Pricing, FAQ
│   │   │   └── layout/             # Navbar, Footer, AppLayout, ProtectedRoute
│   │   ├── context/                # AuthContext, LanguageContext
│   │   ├── i18n/                   # O'zbek tili (Lotin) asosiy, EN/RU tayyor
│   │   ├── pages/                  # Landing, Login, Register, Dashboard, Diagnose, History, Detail, Favorites, Billing, Settings
│   │   ├── services/               # Typed API mijozi (token refresh bilan)
│   │   ├── types/                  # TypeScript interfeyslari
│   │   ├── App.tsx                 # React Router va TanStack Query
│   │   ├── index.css               # Tailwind CSS va shishasimon dizayn (Glassmorphism)
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/                           # Qo‘llanmalar va arxitektura
├── .env.example                    # Muhit o‘zgaruvchilari namunasi
├── package.json                    # Npm Workspaces boshqaruv fayli
└── README.md
```

---

## ⚙️ Muhit O‘zgaruvchilari (.env)

Serverni ishga tushirish uchun quyidagi o‘zgaruvchilar kerak bo‘ladi:

| O‘zgaruvchi | Tavsifi | Standart qiymat |
| :--- | :--- | :--- |
| `PORT` | Backend server porti | `5001` |
| `DATABASE_URL` | PostgreSQL ulanish manzili | `postgresql://mirzobek@localhost:5433/koraidb?schema=public` |
| `JWT_ACCESS_SECRET` | JWT Access token kaliti (kamida 32 belgi) | Super maxfiy satr |
| `JWT_REFRESH_SECRET` | JWT Refresh token kaliti | Super maxfiy satr |
| `AI_PROVIDER` | Tanlangan AI provayderi (`gemini` yoki `openai`) | `gemini` |
| `GEMINI_API_KEY` | Google AI Studio rasmiy API kaliti | `""` |
| `GEMINI_MODEL` | Google Gemini modeli | `gemini-1.5-flash` |
| `OPENAI_API_KEY` | OpenAI API kaliti (OpenAI tanlansa) | `""` |
| `OPENAI_MODEL` | OpenAI modeli | `gpt-4o-mini` |
| `STORAGE_PROVIDER` | Fayllarni saqlash usuli (`local` yoki `s3`) | `local` |
| `UPLOAD_DIR` | Yuklangan fayllar katalogi | `uploads` |
| `MAX_FILE_SIZE_MB` | Ruxsat etilgan maksimal rasm hajmi | `10` |

---

## 🚀 O‘rnatish va Ishga Tushirish

### 1. Bog‘liqliklarni o‘rnatish
```bash
npm install
```

### 2. PostgreSQL ma’lumotlar bazasini sozlash
PostgreSQL xizmati ishga tushganligiga ishonch hosil qiling va `koraidb` bazasini yarating:
```bash
# PostgreSQL bazasini yaratish:
createdb koraidb
```

### 3. Ma’lumotlar bazasi sxemasini yuklash (Prisma)
```bash
npm run prisma:generate --workspace=backend
npm run prisma:push --workspace=backend
```

### 4. AI Kalitini kiritish (.env)
`backend/.env` faylini oching va `GEMINI_API_KEY` o‘zgaruvchisiga [Google AI Studio](https://aistudio.google.com/) kalitingizni kiriting:
```env
GEMINI_API_KEY="AIzaSy..."
```
*(Eslatma: Agar API kalit kiritilmasa, tizim soxta yolg‘on tashxis bermaydi; uning o‘rniga API kalitini sozlash bo‘yicha aniq ko‘rsatma beradi).*

### 5. Dasturni ishga tushirish (Development)
Root katalogdan frontend va backendni parallel ishga tushiring:
```bash
# Frontend (http://localhost:3000) va Backend (http://localhost:5001)
npm run dev
```
Yoki alohida terminallarda:
```bash
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

---

## 🧪 Avtomatlashtirilgan Testlarni O‘tkazish

Loyiha uchun 22 ta to‘liq integratsion va birlik testlari yozilgan (`Vitest` + `Supertest`):
```bash
npm run test --workspace=backend
```
Testlar qamrovi:
- Health-check va xizmatlar holati
- Ro‘yxatdan o‘tish va parol mezonlari
- Takroriy email tekshiruvi
- Noto‘g‘ri parol va avtorizatsiya rad etilishi
- Bearer token tekshiruvi va profil olish
- Tashxis seansini yaratish va holat o‘tishi
- Ruxsat etilmagan fayllarni (txt, exe) rad etish
- Haqiqiy tasvirlarni qabul qilish va Sharp bilan tekshirish
- **IDOR himoyasi**: A foydalanuvchi hisobotini B foydalanuvchi ko‘ra olmasligi yoki o‘chira olmasligi
- Multimodal AI provayderi muvaffaqiyati va javob sxemasi validatsiyasi
- Aniqlashtiruvchi savollarga javob berish va tahlilni yangilash
- Fikr-mulohaza (Feedback) yuborish
- Saralanganlarga qo‘shish / chiqarish
- Foydalanish kvotasini kuzatish
- Tashxisni o‘chirish va bog‘liq rasmlarni kaskad tozalash

---

## 📦 Production uchun Build Qilish

```bash
# Backend va Frontendni to‘liq kompilyatsiya qilish:
npm run build
```
Natijada:
- `backend/dist` katalogida toza JavaScript fayllari;
- `frontend/dist` katalogida optimallashtirilgan CSS va JS bundle hosil bo‘ladi.

---

## ⚖️ Xolis Cheklovlar va Tavsiyalar (Limitations)

1. **Jismoniy ko‘rik cheklovi**: Tasvir orqali ichki mexanik yoriqlar yoki elektr kontaktlarining ichki mikro-qarshiligini to‘liq o‘lchab bo‘lmaydi.
2. **Kamera yoritilishi**: Qorong‘i yoki xira olingan suratlarda AI aniqlashtiruvchi savollar berish orqali foydalanuvchidan qo‘shimcha ma’lumot so‘raydi.
3. **To‘lov integratsiyasi**: To‘lov arxitekturasi tayyorlangan bo‘lib, O‘zbekistondagi yuridik shaxs bank hisobi va Payme/Click merchant kalitlari kiritilgach faollashadi.
