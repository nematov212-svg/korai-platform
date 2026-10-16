import { DiagnosisContext } from './ai.interface.js';

export function buildDiagnosticSystemPrompt(): string {
  return `Siz "Ko'rAI" professional vizual diagnostika platformasining yetakchi sun'iy intellekt muhandisi va ekspertisiz.
Sizning vazifangiz — foydalanuvchi yuborgan fotosurat(lar)ni, muammo tavsifini va belgilarini sinchkovlik bilan tahlil qilib, professional, xolis va xavfsiz texnik tashxis xulosasini taqdim etish.

QAT'IY QOIDALAR VA XAVFSIZLIK TALABLARI:
1. XOLISLIK VA ANIQLIK: Agar fotosurat muammoning aniq sababini isbotlash uchun yetarli bo‘lmasa, hech qachon qat’iy tashxis da’vo qilmang. "Suratning o‘zidan sababni 100% ishonch bilan aniqlab bo‘lmaydi" deb ochiq bildiring va isEvidenceSufficient parametrini false qiling.
2. XAVFSIZLIK BIRINCHI O'RINDA: Elektr toki (220V/380V), tabiiy gaz sizishi, yuqori bosimli qozonlar, avtomobil tormoz yoki rul boshqaruvi, yong'in va tutun xavfi mavjud bo'lsa, foydalanuvchiga hech qachon qurilmani ochish yoki xavfli ta'mirlashni tavsiya qilmang! UrgencyLevel ni "HIGH" yoki "CRITICAL" qilib, zudlik bilan tarmoqdan uzishni va professional mutaxassisni chaqirishni buyuring.
3. SOXTA NARXLAR YO'Q: Hech qachon ehtiyot qismlarining narxlarini yoki soxta servis xizmati narxlarini o'ylab topmang. Faqat kerakli asboblar va ehtiyot qismlar nomini ko'rsating.
4. TIL: Barcha tahlil, sabablar, qadamlar va savollar tabiiy, ravon va toza O'zbek tilida (Lotin alifbosida) bo'lishi shart.
5. STRUKTURALI JSON: Faqat va faqat belgilangan JSON formatida javob bering, hech qanday ortiqcha matn yoki izohlarsiz.`;
}

export function buildDiagnosticUserPrompt(context: DiagnosisContext): string {
  let prompt = `Iltimos, ilova qilingan fotosurat(lar)ni quyidagi kontekst asosida tahlil qiling:

Kategoriya: ${context.category}
Muammo sarlavhasi: ${context.title}
${context.description ? `Foydalanuvchi tavsifi: ${context.description}` : ''}
${context.deviceModel ? `Qurilma / Model: ${context.deviceModel}` : ''}
${context.symptoms && context.symptoms.length > 0 ? `Kuzatilgan belgilar: ${context.symptoms.join(', ')}` : ''}
`;

  if (context.previousAnswers && context.previousAnswers.length > 0) {
    prompt += `\nOldingi aniqlashtiruvchi savollarga foydalanuvchi bergan javoblar:\n`;
    for (const qa of context.previousAnswers) {
      prompt += `- Savol: "${qa.questionText}" -> Javob: "${qa.answerText}"\n`;
    }
  }

  prompt += `
Quyidagi JSON sxemasi bo‘yicha to‘liq va professional tahlilni JSON formatida qaytaring:
{
  "detectedObject": "string (aniqlangan aniq obyekt yoki uskuna)",
  "detectedCategory": "string",
  "isEvidenceSufficient": boolean,
  "confidenceAssessment": "string (vizual tahlil ishonchliligi va cheklovlari bo'yicha tushuntirish)",
  "visibleEvidence": ["string (suratda ko'rinib turgan dalillar)"],
  "possibleCauses": [
    {
      "title": "string (sabab nomi)",
      "likelihood": "HIGH" | "MEDIUM" | "LOW",
      "explanation": "string (batafsil tushuntirish)",
      "supportingEvidence": "string (suratdagi aynan qaysi belgilarga tayangan)"
    }
  ],
  "safeNextSteps": ["string (xavfsiz tekshirish qadamlari)"],
  "toolsNeeded": ["string (asboblar)"],
  "partsNeeded": ["string (ehtiyot qismlar)"],
  "professionalRecommended": boolean,
  "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "safetyWarnings": ["string (xavfsizlik ogohlantirishlari)"],
  "followUpQuestions": [
    {
      "questionText": "string",
      "questionType": "TEXT" | "CHOICE" | "YES_NO",
      "options": ["string"]
    }
  ]
}`;

  return prompt;
}
