import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Check,
  AlertCircle,
  FlipHorizontal,
  Maximize2,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Start video stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setError(null);
    setCapturedDataUrl(null);

    // Stop previous stream tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Brauzeringiz kamera API-ni qo‘llab-quvvatlamaydi');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Kameradan foydalanish uchun ruxsat berilmadi. Iltimos, brauzer sozlamalarida kameraga ruxsat bering.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('Qurilmadagi kamera topilmadi yoki u boshqa dastur tomonidan band qilingan.');
      } else {
        setError(err.message || 'Kamerani ishga tushirishda xatolik yuz berdi');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      // Cleanup on modal close
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      setCapturedDataUrl(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Shutter snap
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedDataUrl(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedDataUrl(null);
  };

  const confirmPhoto = () => {
    if (!capturedDataUrl) return;

    // Convert DataURL to File
    const arr = capturedDataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const filename = `camera_shot_${Date.now()}.jpg`;
    const file = new File([u8arr], filename, { type: mime });

    onCapture(file);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Suratga olish</h3>
              <p className="text-xs text-slate-400">Muammoli qismni aniq va yaqindan tasvirga oling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-black min-h-[360px] max-h-[500px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-8 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-white mb-2">Kamera ishga tushmadi</h4>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Qayta urinish
              </button>
            </div>
          ) : capturedDataUrl ? (
            <img
              src={capturedDataUrl}
              alt="Olingan surat"
              className="w-full h-full object-contain max-h-[500px]"
            />
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <RefreshCw className="w-5 h-5 animate-spin text-brand-400" />
                    <span>Kamera yuklanmoqda...</span>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover min-h-[360px] max-h-[500px]"
              />
              {/* Focusing reticle overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-brand-400/80 rounded-full" />
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {!capturedDataUrl && !error ? (
            <>
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>{facingMode === 'environment' ? 'Old kameraga o‘tish' : 'Orqa kameraga o‘tish'}</span>
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                disabled={isLoading}
                className="relative group p-4 rounded-full bg-white text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                aria-label="Suratga olish"
              >
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-5 h-5 bg-brand-600 rounded-full group-hover:bg-brand-500" />
                </div>
              </button>

              <div className="w-24" /> {/* Spacer */}
            </>
          ) : capturedDataUrl ? (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                Qayta olish
              </button>

              <button
                type="button"
                onClick={confirmPhoto}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <Check className="w-4 h-4" />
                Suratni tasdiqlash
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              Yopish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
