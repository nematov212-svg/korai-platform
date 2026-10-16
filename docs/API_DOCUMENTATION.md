# Ko'rAI — REST API v1 Hujjatlari

Ko'rAI API versiyalangan (`/api/v1`) REST arxitekturasida qurilgan bo‘lib, barcha ma’lumotlar JSON formatida uzatiladi.

## Bazaviy URL
- Lokal muhit: `http://localhost:5001/api/v1`
- Ishlab chiqarish: `https://api.korai.uz/api/v1`

---

## 1. Salomatlik Tekshiruvi (Health Check)

### `GET /health` yoki `GET /api/v1/health`
Ma’lumotlar bazasi, fayllar saqlash katalogi va AI provayderi tayyorligini tekshiradi.

**Muvaffaqiyatli javob (`200 OK`):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "Ko'rAI Diagnostic API",
  "uptimeSeconds": 1420,
  "checks": {
    "database": { "status": "up" },
    "storage": { "status": "up", "provider": "local" },
    "aiProvider": {
      "provider": "google-gemini",
      "model": "gemini-1.5-flash",
      "configured": true,
      "status": "ready"
    }
  }
}
```

---

## 2. Autentifikatsiya (Authentication)

### `POST /api/v1/auth/register`
Yangi foydalanuvchini ro‘yxatdan o‘tkazadi.

**Kiruvchi so‘rov (Body):**
```json
{
  "name": "Ali Valiyev",
  "email": "ali@misol.uz",
  "password": "SecurePassword123!"
}
```

**Javob (`201 Created`):**
```json
{
  "success": true,
  "message": "Muvaffaqiyatli ro‘yxatdan o‘tildi",
  "data": {
    "user": {
      "id": "cm...",
      "name": "Ali Valiyev",
      "email": "ali@misol.uz",
      "role": "USER",
      "plan": "FREE"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### `POST /api/v1/auth/login`
Mavjud foydalanuvchini tekshiradi va tokenlar qaytaradi.

**Kiruvchi so‘rov:**
```json
{
  "email": "ali@misol.uz",
  "password": "SecurePassword123!"
}
```

### `POST /api/v1/auth/refresh`
Muddati tugagan access tokenni yangilaydi (Refresh Token rotatsiyasi).

**Kiruvchi so‘rov:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

### `GET /api/v1/auth/me`
Joriy foydalanuvchi profilini qaytaradi.
- **Sarlavha:** `Authorization: Bearer <accessToken>`

---

## 3. Diagnostika Seanslari (Diagnoses)

Barcha diagnostika endpointlari `Authorization: Bearer <token>` sarlavhasini talab qiladi.

### `POST /api/v1/diagnoses`
Yangi diagnostika seansini boshlaydi (`DRAFT` holati).

**Kiruvchi so‘rov:**
```json
{
  "title": "Kir yuvish mashinasidan suv oqishi",
  "category": "appliances",
  "deviceModel": "Samsung EcoBubble 7kg",
  "symptoms": ["Suv sizishi / oqishi", "Noodatiy shovqin"],
  "description": "Siqish vaqtida pastki burchakdan suv to‘kilmoqda"
}
```

### `POST /api/v1/diagnoses/:id/images`
Seansga 1 tadan 5 tagacha rasm yuklaydi.
- **Content-Type:** `multipart/form-data`
- **Fayl maydoni:** `images` (MIME: `image/jpeg`, `image/png`, `image/webp`)

### `POST /api/v1/diagnoses/:id/analyze`
Yuklangan tasvirlar va foydalanuvchi belgilari asosida haqiqiy AI vizual diagnostikasini ishga tushiradi.

**AI Tahlili Natijasi (`200 OK`):**
```json
{
  "success": true,
  "message": "AI tashxisi muvaffaqiyatli yakunlandi",
  "data": {
    "session": {
      "id": "cm...",
      "status": "COMPLETED",
      "analysis": {
        "detectedObject": "Samsung kir yuvish mashinasi",
        "detectedCategory": "appliances",
        "isEvidenceSufficient": true,
        "confidenceAssessment": "Vizual dalillar nasos filtri sohasida suv sizishini ko‘rsatmoqda",
        "visibleEvidence": [
          "Pastki texnik lyukdan oqqan suv izlari",
          "Korpus ostida ko‘lmak hosil bo‘lgan"
        ],
        "possibleCauses": [
          {
            "title": "Drenaj filtri rezina zichlagichi bo‘shashi",
            "likelihood": "HIGH",
            "explanation": "Filtr qopqog‘i yetarlicha qisilmagan yoki rezina eskirgan",
            "supportingEvidence": "Suv izlari bevosita filtr lyukidan boshlangan"
          }
        ],
        "safeNextSteps": [
          "Elektr tarmog‘idan darhol uzing",
          "Favqulodda to‘kish shlangi orqali suvni bo‘shating",
          "Filtrni ochib tekshiring"
        ],
        "toolsNeeded": ["Katta latta", "Past idish"],
        "partsNeeded": ["Drenaj filtri rezina halqasi"],
        "professionalRecommended": false,
        "urgencyLevel": "HIGH",
        "safetyWarnings": ["Elektr toki urish xavfi! Nam qo‘l bilan elektrga tegmang!"]
      }
    }
  }
}
```

### `POST /api/v1/diagnoses/:id/answers`
Agar vizual dalillar yetarli bo‘lmasa (`FOLLOW_UP_REQUIRED`), foydalanuvchi javoblarini qabul qiladi va tahlilni yangilaydi.

**Kiruvchi so‘rov:**
```json
{
  "answers": [
    {
      "questionId": "cm_q1...",
      "answerText": "Suv faqat siqish vaqtida oqyapti"
    }
  ]
}
```

### `GET /api/v1/diagnoses`
Foydalanuvchining barcha tashxislari ro‘yxati (sahifalash va filtrlash bilan).
- Parametrlar: `page=1`, `limit=10`, `category=appliances`, `search=samsung`, `favoriteOnly=true`

### `GET /api/v1/diagnoses/:id`
Bitta tashxis seansining barcha ma’lumotlari (rasmlar, tahlil, savol-javoblar, fikr-mulohaza).

### `DELETE /api/v1/diagnoses/:id`
Tashxisni va serverda saqlangan barcha fotosuratlarni butunlay o‘chiradi.

### `POST /api/v1/diagnoses/:id/favorite`
Tashxisni saralanganlarga qo‘shadi yoki chiqaradi (`toggle`).

### `POST /api/v1/diagnoses/:id/feedback`
Tashxis foydaliligi va muammoning hal bo‘lganligi bo‘yicha foydalanuvchi bahosi.

---

## 4. Tarif va Kvota (Billing)

### `GET /api/v1/billing/usage`
Joriy oylik foydalanish, sarflangan tashxislar va tarif ma’lumotlarini qaytaradi.
