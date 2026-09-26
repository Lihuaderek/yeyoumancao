/**
 * 野有蔓草 · 摄像头拍照取样模态框
 * 允许用户直接调用摄像头拍摄照片作为试穿底图
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string>('');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      stopStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('当前浏览器环境不支持摄像头调用');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError('无法访问摄像头，请检查浏览器权限设置');
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 水平镜像以符合自拍直觉
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopStream();
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-rice-light border border-gold rounded-lg shadow-2xl overflow-hidden p-6">
        <button
          onClick={() => {
            stopStream();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-lg font-bold text-ink mb-3 text-center">
          摄像头人像拍摄
        </h3>

        {error ? (
          <div className="p-6 text-center text-xs text-red-600 bg-red-50 rounded border border-red-200 space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] max-h-[460px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* 取景构图辅助虚线 */}
              <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-dashed border-gold/40 rounded-3xl pointer-events-none" />

              <button
                type="button"
                onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 border border-gold/40 text-xs flex items-center gap-1 font-serif"
              >
                <SwitchCamera className="w-4 h-4 text-gold" />
                <span>翻转</span>
              </button>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleCapture}
                className="py-3 px-8 rounded-full bg-vermilion hover:bg-vermilion-light text-white font-serif text-sm tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Camera className="w-5 h-5" />
                拍摄并使用此照片
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
