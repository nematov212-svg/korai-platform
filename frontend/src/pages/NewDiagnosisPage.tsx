import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiagnosisSession, DiagnosisCategory } from '../types/index.js';
import { ImageUploader } from '../components/camera/ImageUploader.js';
import { AnalyzingLoader } from '../components/diagnosis/AnalyzingLoader.js';
import { FollowUpForm } from '../components/diagnosis/FollowUpForm.js';
import { DiagnosticReportView } from '../components/diagnosis/DiagnosticReportView.js';
import {
  WashingMachine,
  Car,
  Laptop,
  Wrench,
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const NewDiagnosisPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1: Info, 2: Upload, 3: Analyzing, 4: FollowUp, 5: Report
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [category, setCategory] = useState<DiagnosisCategory>('appliances');
  const [title, setTitle] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');

  // Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Active Session & Results
  const [activeSession, setActiveSession] = useState<DiagnosisSession | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Common symptoms suggestions by category
  const commonSymptomsByCategory: Record<DiagnosisCategory, string[]> = {
    appliances: [
      'Suv sizishi / oqishi',
      'Noodatiy shovqin / taqillash',
      'Yoqilmayapti / tok bormayapti',
      'Qizdirilmayapti',
      'Baraban aylanmayapti',
      'Kuyindi hidi kelishi',
    ],
    automotive: [
      'Suyuqlik tomchilashi',
      'Tormoz g‘ichirlashi / sustligi',
      'Dvigateldan taqillash ovozi',
      'Shina notekis yeyilishi',
      'Sovutish suvi kamayishi',
      'Zang va korroziya',
    ],
    computers: [
      'Ekran shikastlanishi / chiziqlar',
      'Port yoki raz’yem sinishi',
      'Ventilyator qattiq shovqin solishi',
      'Zaryad olmayapti',
      'O‘ta qizib ketishi',
      'Plata qismida kuyish izi',
    ],
    plumbing: [
      'Quvur birikmasidan oqish',
      'Devorda namlik va mog‘or',
      'Kran jo‘mragidan tomchilash',
      'Suv bosimi tushib ketishi',
      'Zanglash va qorayish',
    ],
    electronics: [
      'Kondensator shishib ketishi',
      'Lehim yorilishi / uzilishi',
      'Qoraygan rezistor',
      'Qisqa tutashuv izi',
      'Kuyindi / tutun hidi',
    ],
    general: [
      'Yoriq va darz ketish',
      'Mexanik deformatsiya',
      'Mahkamlagich bo‘shashi',
      'Yuzada chuqur tirnalish',
    ],
  };

  const categories = [
    { id: 'appliances', label: 'Maishiy texnika', icon: WashingMachine },
    { id: 'automotive', label: 'Avtomobillar', icon: Car },
    { id: 'computers', label: 'Kompyuter & Gadjet', icon: Laptop },
    { id: 'plumbing', label: 'Santexnika & Ta’mir', icon: Wrench },
    { id: 'electronics', label: 'Elektronika', icon: Cpu },
    { id: 'general', label: 'Umumiy & Boshqa', icon: Layers },
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSymptom.trim()) {
      e.preventDefault();
      if (!selectedSymptoms.includes(customSymptom.trim())) {
        setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      }
      setCustomSymptom('');
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Iltimos, muammo sarlavhasini kiriting.');
      return;
    }
    setCurrentStep(2);
  };

  const handleStartAnalysis = async () => {
    setError(null);
    if (files.length === 0) {
      setError('Iltimos, kamida bitta rasm yuklang yoki kameradan oling.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(3);

    try {
      // 1. Create Diagnosis Session
      const session = await api.createDiagnosis({
        title,
        category,
        description,
        deviceModel,
        symptoms: selectedSymptoms,
      });

      // 2. Upload Images
      await api.uploadDiagnosisImages(session.id, files);

      // 3. Trigger AI Analysis
      const analyzedSession = await api.analyzeDiagnosis(session.id);
      setActiveSession(analyzedSession);

      if (analyzedSession.status === 'FOLLOW_UP_REQUIRED' && analyzedSession.questions.length > 0) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setError(err?.message || 'Tashxis tahlilida xatolik yuz berdi');
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswerQuestions = async (
    answers: Array<{ questionId: string; answerText: string }>
  ) => {
    if (!activeSession) return;
    setIsAnalyzing(true);
    setCurrentStep(3);

    try {
      const updated = await api.answerQuestions(activeSession.id, answers);
      setActiveSession(updated);
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Follow-up answer error:', err);
      setError(err?.message || 'Javoblarni qayta ishlashda xatolik yuz berdi');
      setCurrentStep(4);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Wizard Header Progress */}
      {currentStep !== 5 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="text-white font-bold">Yangi AI Tashxis</span>
            <span>Bosqich {currentStep} / 4</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Understand the problem */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              1. Muammoni tavsiflang
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Qurilma turi va kuzatilgan alomatlarni tanlang
            </p>
          </div>

          <form onSubmit={handleStep1Next} className="space-y-6">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Kategoriyani tanlang
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id as DiagnosisCategory);
                        setSelectedSymptoms([]);
                      }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg shadow-brand-500/15'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                      <span className="text-xs sm:text-sm font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Problem Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Muammo sarlavhasi *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Kir yuvish mashinasi pastidan suv oqishi"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Device Model (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Qurilma yoki avtomobil modeli (Ixtiyoriy)
              </label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="Masalan: Samsung WW70, Chevrolet Cobalt 1.5, Asus Zenbook"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Symptoms Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Kuzatilgan belgilar (Bir yoki bir nechta tanlang)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonSymptomsByCategory[category]?.map((sym, i) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                          : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Custom symptom input */}
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={addCustomSymptom}
                placeholder="Boshqa belgi bo‘lsa yozib Enter tugmasini bosing..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Qo‘shimcha izoh yoki tavsif (Ixtiyoriy)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Muammo qachon va qanday holatda yuz berdi? Qanday ovoz yoki hid sezildi?..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Davom etish (Surat yuklash)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Upload Images */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              2. Muammoni suratga oling yoki yuklang
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Yaxshi yoritilgan, umumiy va yaqindan olingan fotosuratlar tahlil aniqligini oshiradi (1-5 ta rasm)
            </p>
          </div>

          <ImageUploader files={files} onChange={setFiles} maxFiles={5} />

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={files.length === 0}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-brand-500/30 flex items-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Ko'rAI Tahlilini boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Scanning & Analysis Loader */}
      {currentStep === 3 && <AnalyzingLoader />}

      {/* STEP 4: Conversational Follow-Up Questions (If evidence was incomplete) */}
      {currentStep === 4 && activeSession && (
        <FollowUpForm
          questions={activeSession.questions}
          onSubmit={handleAnswerQuestions}
          isLoading={isAnalyzing}
        />
      )}

      {/* STEP 5: Final Diagnostic Report */}
      {currentStep === 5 && activeSession && (
        <DiagnosticReportView
          session={activeSession}
          onRefresh={async () => {
            const updated = await api.getDiagnosis(activeSession.id);
            setActiveSession(updated);
          }}
        />
      )}
    </div>
  );
};
