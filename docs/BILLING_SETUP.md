# Ko'rAI — To‘lov Tizimlari Sozlash Qo‘llanmasi (Billing Setup)

Ushbu hujjat O‘zbekiston va xalqaro to‘lov shlyuzlarini (Payme, Click, Stripe) haqiqiy tijoriy faoliyat uchun ulash talablarini tushuntiradi.

---

## 1. Shaffoflik Tamoyili

Ko'rAI foydalanuvchilarga soxta muvaffaqiyatli to‘lovlarni ko‘rsatmaydi. Agar to‘lov provayderining maxfiy kalitlari (Merchant ID / Secret Key) tizimga biriktirilmagan bo‘lsa, tizim to‘lov mavjud emasligini ochiq bildiradi.

---

## 2. Click va Payme Integratsiyasi (O‘zbekiston)

### Zarur Hujjatlar:
1. O‘zbekistonda ro‘yxatdan o‘tgan yuridik shaxs (MChJ yoki YaTT).
2. Milliy valyutadagi (UZS) korporativ bank hisob raqami.
3. Click Merchant yoki Payme Business portalida shartnoma imzolash.

### Kerakli Muhit O‘zgaruvchilari:
```env
# Payme
PAYME_MERCHANT_ID="your_payme_merchant_id"
PAYME_SECRET_KEY="your_payme_secret_key"
PAYME_TEST_MODE=false

# Click
CLICK_SERVICE_ID="your_service_id"
CLICK_MERCHANT_ID="your_merchant_id"
CLICK_SECRET_KEY="your_secret_key"
```

---

## 3. Stripe Integratsiyasi (Xalqaro foydalanuvchilar)

Xalqaro bank kartalari (Visa / Mastercard) orqali to‘lovlarni qabul qilish uchun:
```env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```
