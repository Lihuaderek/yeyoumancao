/**
 * 野有蔓草 · AR 真人摄像头礼服试穿组件
 * 基于 MediaPipe PoseLandmarker 检测人体肩部、躯干与姿态关键点
 * 自动计算肩膀宽度与倾斜角度，将高清透明婚服实时叠加贴合于画面中
 * 具备摄像头异常降级（静态人像试穿/上传试穿）及姿态平滑滤波
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Camera, RefreshCw, AlertCircle, Upload, Check, Sparkles, SwitchCamera, Download } from 'lucide-react';
import { Garment } from '../types';

interface ArTryOnCameraProps {
  garment: Garment;
  color: 'red' | 'gold' | 'pink' | 'blue';
  fabric: 'silk' | 'satin' | 'embroidery';
  size: 'S' | 'M' | 'L' | 'XL';
}

export const ArTryOnCamera: React.FC<ArTryOnCameraProps> = ({
  garment,
  color,
  fabric,
  size
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);

  // 状态机
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'denied' | 'unavailable' | 'static_mode'>('requesting');
  const [aiStatus, setAiStatus] = useState<'loading_model' | 'tracking' | 'searching' | 'fallback'>('loading_model');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // 静态图片模式相关状态
  const [staticImageSrc, setStaticImageSrc] = useState<string>('/images/dress1.jpg');
  const staticImgRef = useRef<HTMLImageElement | null>(null);
  const [staticOffset, setStaticOffset] = useState<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 });

  // 动画与检测循环引用
  const animFrameIdRef = useRef<number | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 姿态平滑滤波器历史状态 (EMA Exponential Moving Average)
  const smoothedPoseRef = useRef<{
    x: number;
    y: number;
    angle: number;
    scale: number;
    hasPose: boolean;
  }>({
    x: 0,
    y: 0,
    angle: 0,
    scale: 1,
    hasPose: false
  });

  // 预加载当前选中的透明礼服素材
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = garment.overlayImage || garment.image || '/images/ar_dress1.svg';
    img.onload = () => {
      garmentImgRef.current = img;
    };
  }, [garment]);

  // 尺码系数映射
  const getSizeMultiplier = useCallback((s: 'S' | 'M' | 'L' | 'XL') => {
    switch (s) {
      case 'S': return 0.94;
      case 'M': return 1.0;
      case 'L': return 1.06;
      case 'XL': return 1.14;
    }
  }, []);

  // 颜色色调处理
  const getColorTint = useCallback((c: 'red' | 'gold' | 'pink' | 'blue') => {
    switch (c) {
      case 'red': return '#B22222';
      case 'gold': return '#C9A96E';
      case 'pink': return '#D97A8F';
      case 'blue': return '#2B3E50';
    }
  }, []);

  // 初始化 MediaPipe PoseLandmarker
  useEffect(() => {
    let isCancelled = false;

    const initMediaPipe = async () => {
      try {
        setAiStatus('loading_model');

        // 优先加载本地 WASM 资源，失败则加载 CDN
        let vision;
        try {
          vision = await FilesetResolver.forVisionTasks('/wasm');
        } catch {
          vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
        }

        if (isCancelled) return;

        // 优先加载本地模型，失败则从 Google CDN 加载
        let landmarker: PoseLandmarker;
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/pose_landmarker_lite.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numPoses: 1
          });
        } catch {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numPoses: 1
          });
        }

        if (isCancelled) {
          landmarker.close();
          return;
        }

        poseLandmarkerRef.current = landmarker;
        setAiStatus('searching');
      } catch (err) {
        console.warn('MediaPipe 初始化受阻，将启用轻量姿态估算兜底', err);
        setAiStatus('fallback');
      }
    };

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (poseLandmarkerRef.current) {
        try {
          poseLandmarkerRef.current.close();
        } catch {
          // ignore
        }
        poseLandmarkerRef.current = null;
      }
    };
  }, []);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      setCameraStatus('requesting');
      setErrorMessage('');

      // 停止先前流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('unavailable');
        setErrorMessage('当前浏览器环境不支持摄像头调用，已自动为您开启静态画廊试穿模式。');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraStatus('active');
        };
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or failed:', err);
      const e = err as Error;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
        setErrorMessage('摄像头访问权限已被拒绝。请在浏览器地址栏允许摄像头权限，或使用下方静态试穿模式体验。');
      } else {
        setCameraStatus('unavailable');
        setErrorMessage('未检测到可用摄像头设备或设备被占用，已切换为静态人像试穿。');
      }
    }
  }, [facingMode]);

  // 初始自动请求摄像头
  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [startCamera]);

  // 切换前后摄像头
  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // 生成处理面料与颜色的礼服图像
  const prepareTintedGarment = useCallback(
    (sourceImg: HTMLImageElement): HTMLCanvasElement | null => {
      let offCanvas = offscreenCanvasRef.current;
      if (!offCanvas) {
        offCanvas = document.createElement('canvas');
        offscreenCanvasRef.current = offCanvas;
      }

      const w = sourceImg.naturalWidth || 500;
      const h = sourceImg.naturalHeight || 700;
      offCanvas.width = w;
      offCanvas.height = h;

      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return null;

      offCtx.clearRect(0, 0, w, h);

      // 面料滤镜
      if (fabric === 'silk') {
        offCtx.filter = 'contrast(1.15) brightness(1.08)';
      } else if (fabric === 'satin') {
        offCtx.filter = 'saturate(1.08) brightness(1.02)';
      } else if (fabric === 'embroidery') {
        offCtx.filter = 'contrast(1.25) saturate(1.15)';
      } else {
        offCtx.filter = 'none';
      }

      offCtx.drawImage(sourceImg, 0, 0, w, h);

      // 非红色时执行颜色置换合成
      if (color !== 'red') {
        offCtx.save();
        offCtx.globalCompositeOperation = 'hue';
        offCtx.fillStyle = getColorTint(color);
        offCtx.fillRect(0, 0, w, h);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(sourceImg, 0, 0, w, h);
        offCtx.restore();
      }

      // 刺绣面料追加微闪金辉高光
      if (fabric === 'embroidery') {
        offCtx.save();
        offCtx.globalCompositeOperation = 'source-atop';
        const grad = offCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, 'rgba(255, 240, 180, 0.15)');
        grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.25)');
        grad.addColorStop(1, 'rgba(255, 240, 180, 0.15)');
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, w, h);
        offCtx.restore();
      }

      return offCanvas;
    },
    [color, fabric, getColorTint]
  );

  // 每一帧的主绘制与姿态跟踪循环
  useEffect(() => {
    let isRunning = true;
    let lastVideoTime = -1;

    const renderLoop = () => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // ================= A. 摄像头实时 AR 模式 =================
      if (cameraStatus === 'active' && video && video.readyState >= 2) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const width = canvas.width;
        const height = canvas.height;

        // 1. 绘制镜像视频画面 (营造宛若穿衣镜的镜像真实感)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -width, 0, width, height);
        ctx.restore();

        // 2. 使用 MediaPipe 检测姿态关键点
        let targetX = width / 2;
        let targetY = height * 0.42;
        let targetAngle = 0;
        let targetDist = width * 0.32;
        let detected = false;

        const landmarker = poseLandmarkerRef.current;
        if (landmarker && video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          try {
            const results = landmarker.detectForVideo(video, performance.now());
            if (results && results.landmarks && results.landmarks[0]) {
              const lm = results.landmarks[0];
              const leftShoulder = lm[11];
              const rightShoulder = lm[12];

              // 检查关键点可见度与有效性
              if (leftShoulder && rightShoulder && (leftShoulder.visibility || 0) > 0.4 && (rightShoulder.visibility || 0) > 0.4) {
                // 转换至镜像画布坐标系
                const screenLeftX = (1 - leftShoulder.x) * width;
                const screenLeftY = leftShoulder.y * height;
                const screenRightX = (1 - rightShoulder.x) * width;
                const screenRightY = rightShoulder.y * height;

                // 两肩连线中点
                targetX = (screenLeftX + screenRightX) / 2;
                targetY = (screenLeftY + screenRightY) / 2;

                // 两肩倾斜角度
                const dx = screenRightX - screenLeftX;
                const dy = screenRightY - screenLeftY;
                targetAngle = Math.atan2(dy, dx);

                // 两肩物理间距
                targetDist = Math.hypot(dx, dy);
                detected = true;
              }
            }
          } catch {
            // detect 容错
          }
        }

        // 更新 AI 姿态追踪状态显示
        if (detected) {
          setAiStatus('tracking');
        } else if (aiStatus !== 'loading_model' && aiStatus !== 'fallback') {
          setAiStatus('searching');
        }

        // 3. EMA 姿态平滑滤波 (消除高频抖动，实现丝滑贴合)
        const smoothed = smoothedPoseRef.current;
        const alpha = detected ? 0.35 : 0.05; // 追踪到时快速跟手，丢失时慢速归中

        smoothed.x = smoothed.x * (1 - alpha) + targetX * alpha;
        smoothed.y = smoothed.y * (1 - alpha) + targetY * alpha;
        smoothed.angle = smoothed.angle * (1 - alpha) + targetAngle * alpha;

        // 礼服在 500x700 矢量中的基准肩宽约为 260px
        const baseScale = (targetDist / 260) * getSizeMultiplier(size) * 1.35;
        smoothed.scale = smoothed.scale * (1 - alpha) + baseScale * alpha;

        // 4. 绘制叠加华服
        const garmentImg = garmentImgRef.current;
        if (garmentImg && garmentImg.complete) {
          const tinted = prepareTintedGarment(garmentImg);
          if (tinted) {
            ctx.save();
            ctx.translate(smoothed.x, smoothed.y);
            ctx.rotate(smoothed.angle);
            ctx.scale(smoothed.scale, smoothed.scale);

            // 礼服挂载点对齐：SVG 中肩部中点位于 (250, 80)
            ctx.drawImage(tinted, -250, -80, 500, 700);
            ctx.restore();
          }
        }

        // 5. 绘制肩颈微提示引导线 (仅当未检测到人时给予视觉辅助)
        if (!detected && aiStatus === 'searching') {
          ctx.save();
          ctx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.arc(width / 2, height * 0.28, 70, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ================= B. 静态人像试穿降级模式 =================
      else if (cameraStatus === 'static_mode' || cameraStatus === 'denied' || cameraStatus === 'unavailable') {
        const staticImg = staticImgRef.current;
        if (staticImg && staticImg.complete) {
          if (canvas.width !== 640 || canvas.height !== 480) {
            canvas.width = 640;
            canvas.height = 480;
          }

          const width = canvas.width;
          const height = canvas.height;

          // 绘制静态模特/上传图
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(staticImg, 0, 0, width, height);

          // 绘制叠加礼服
          const garmentImg = garmentImgRef.current;
          if (garmentImg && garmentImg.complete) {
            const tinted = prepareTintedGarment(garmentImg);
            if (tinted) {
              ctx.save();
              const centerX = width / 2 + staticOffset.x;
              const centerY = height * 0.38 + staticOffset.y;
              const s = (width * 0.3 / 260) * getSizeMultiplier(size) * 1.35 * staticOffset.scale;

              ctx.translate(centerX, centerY);
              ctx.scale(s, s);
              ctx.drawImage(tinted, -250, -80, 500, 700);
              ctx.restore();
            }
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [cameraStatus, aiStatus, size, getSizeMultiplier, prepareTintedGarment, staticOffset]);

  // 处理用户上传自己的静态全身照片试穿
  const handleUploadUserPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        const img = new Image();
        img.src = event.target.result as string;
        img.onload = () => {
          staticImgRef.current = img;
          setStaticImageSrc(event.target?.result as string);
          setCameraStatus('static_mode');
        };
      }
    };
    reader.readAsDataURL(file);
  };

  // 截屏拍照留念
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `野有蔓草_AR试穿留影_${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error('Snapshot failed', e);
    }
  };

  return (
    <div className="w-full h-full min-h-[480px] sm:min-h-[580px] relative bg-black rounded-lg overflow-hidden border border-gold/40 shadow-2xl flex items-center justify-center select-none">
      {/* 隐藏的摄像头视频源 */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="hidden"
      />

      {/* 预加载用于静态降级试穿的模特图 */}
      <img
        ref={staticImgRef}
        src={staticImageSrc}
        alt="静态试穿模特"
        className="hidden"
        onLoad={() => {
          // 首次静默加载就绪
        }}
      />

      {/* 核心渲染画布 */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />

      {/* 顶部 AR 状态与指引浮层 */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        {/* 左上：实时状态指示 */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-gold/30 px-3.5 py-1.5 rounded-full text-xs text-rice pointer-events-auto">
          {cameraStatus === 'active' ? (
            <>
              <span className={`w-2.5 h-2.5 rounded-full ${
                aiStatus === 'tracking'
                  ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500'
                  : 'bg-amber-400 animate-ping'
              }`} />
              <span className="font-serif">
                {aiStatus === 'tracking'
                  ? 'AR 贴身试穿中 · 衣服实时跟随身形'
                  : aiStatus === 'loading_model'
                  ? '正在载入姿态算法模型...'
                  : '请站立在画面中央，露出肩部'}
              </span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-serif">静态人像试穿模式</span>
            </>
          )}
        </div>

        {/* 右上：控制工具栏 (切换镜头、拍照保存) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {cameraStatus === 'active' && (
            <button
              onClick={handleToggleFacingMode}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-rice border border-gold/40 transition-colors shadow-md"
              title="切换前/后置摄像头"
            >
              <SwitchCamera className="w-4 h-4 text-gold" />
            </button>
          )}

          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion/90 hover:bg-vermilion text-white text-xs font-serif shadow-md transition-colors"
            title="保存试穿留影照片"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">留影存照</span>
          </button>
        </div>
      </div>

      {/* 底部贴心操作栏 */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs text-rice/80 pointer-events-none z-10">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-gold/20 font-serif text-[11px] hidden sm:block">
          贴士：保持自然光线，后退至露胸肩位置，礼服将自动根据两肩倾角贴合。
        </div>

        {/* 降级与切换入口 */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {cameraStatus !== 'active' ? (
            <button
              onClick={startCamera}
              className="px-3 py-1.5 rounded bg-gold/20 hover:bg-gold/30 text-gold-light border border-gold/50 flex items-center gap-1.5 font-serif transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新唤起摄像头
            </button>
          ) : (
            <button
              onClick={() => setCameraStatus('static_mode')}
              className="px-3 py-1.5 rounded bg-black/60 hover:bg-black/80 text-rice-dark border border-gold/30 font-serif transition-colors"
            >
              切换至静态照片
            </button>
          )}

          {/* 上传自己的照片进行静态试穿 */}
          <label className="px-3 py-1.5 rounded bg-rice-light/15 hover:bg-rice-light/25 text-rice border border-gold/30 cursor-pointer flex items-center gap-1.5 font-serif transition-colors">
            <Upload className="w-3.5 h-3.5 text-gold" />
            <span>上传全身照试穿</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadUserPhoto}
            />
          </label>
        </div>
      </div>

      {/* 权限被拒或摄像头不可用时的警示浮窗 */}
      {(cameraStatus === 'denied' || cameraStatus === 'unavailable') && (
        <div className="absolute top-16 inset-x-6 z-20 max-w-lg mx-auto bg-ink/90 border border-amber-500/50 rounded-lg p-4 text-rice shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-serif font-bold text-amber-200 mb-1">
                {cameraStatus === 'denied' ? '摄像头权限受限' : '未检测到可用摄像头'}
              </h4>
              <p className="text-rice-dark/80 leading-relaxed mb-3">
                {errorMessage}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={startCamera}
                  className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-serif text-[11px] transition-colors"
                >
                  已在浏览器允许，再次尝试
                </button>
                <button
                  onClick={() => setCameraStatus('static_mode')}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-rice font-serif text-[11px] transition-colors"
                >
                  继续使用静态人像试穿
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
