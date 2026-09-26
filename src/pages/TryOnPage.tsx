import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Upload,
  Camera,
  Download,
  RotateCcw,
  AlertCircle,
  Scissors,
  Image as ImageIcon,
  User,
  Move,
  Check
} from 'lucide-react';
import { GARMENTS } from '../data/mockData';
import { Garment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const COLOR_OPTIONS: { id: 'red' | 'gold' | 'pink' | 'blue'; name: string; hex: string }[] = [
  { id: 'red', name: '华堂朱红', hex: '#B22222' },
  { id: 'gold', name: '尊荣明金', hex: '#C9A96E' },
  { id: 'pink', name: '海棠初粉', hex: '#D97A8F' },
  { id: 'blue', name: '玄青黛蓝', hex: '#2B3E50' },
];

const FABRIC_OPTIONS: { id: 'silk' | 'satin' | 'embroidery'; name: string }[] = [
  { id: 'silk', name: '天然桑蚕丝' },
  { id: 'satin', name: '重磅织金缎' },
  { id: 'embroidery', name: '非遗盘金刺绣' },
];

const SIZE_SCALE: Record<string, number> = { S: 0.9, M: 1.0, L: 1.1, XL: 1.2 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`图片加载失败: ${src}`));
    img.src = src;
  });
}

function removeBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  
  const visited = new Uint8Array(width * height);
  const stack = new Uint32Array(width * height);
  let stackPtr = 0;
  
  // A pixel is considered background if it's light gray/white (low saturation, high brightness)
  const isBackground = (r: number, g: number, b: number) => {
    return r > 150 && g > 150 && b > 150 && (Math.max(r, g, b) - Math.min(r, g, b)) < 45;
  };

  const push = (x: number, y: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = y * width + x;
      if (visited[idx] === 0) {
        visited[idx] = 1;
        const p = idx * 4;
        if (isBackground(data[p], data[p+1], data[p+2])) {
          data[p+3] = 0; // make transparent
          stack[stackPtr++] = idx;
        }
      }
    }
  };

  // Seed all 4 edges
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  while (stackPtr > 0) {
    const idx = stack[--stackPtr];
    const x = idx % width;
    const y = Math.floor(idx / width);
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }
  
  ctx.putImageData(imgData, 0, 0);
}

function getGarmentBounds(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (minX > maxX) return { minX: 0, minY: 0, maxX: width, maxY: height };
  return { minX, minY, maxX, maxY };
}

export const TryOnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const garmentIdParam = searchParams.get('id');
  const initialGarment = GARMENTS.find(g => g.id === garmentIdParam) || GARMENTS[0];
  
  const [selectedGarment, setSelectedGarment] = useState<Garment>(initialGarment);
  const [allProducts, setAllProducts] = useState<Garment[]>([...GARMENTS]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.products) {
          const combined = [...GARMENTS, ...data.products];
          setAllProducts(combined);
          const found = combined.find((g: Garment) => g.id === garmentIdParam);
          if (found) setSelectedGarment(found);
        }
      })
      .catch(console.error);
  }, [garmentIdParam]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const [color, setColor] = useState<string>('red');
  const [fabric, setFabric] = useState<string>('silk');

  useEffect(() => {
    if (selectedGarment.merchantColors && selectedGarment.merchantColors.length > 0) {
      setColor(selectedGarment.merchantColors[0].id);
    } else {
      setColor('red');
    }
    if (selectedGarment.merchantFabrics && selectedGarment.merchantFabrics.length > 0) {
      setFabric(selectedGarment.merchantFabrics[0].id);
    } else {
      setFabric('silk');
    }
  }, [selectedGarment]);
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Manual Mode State
  const [manualMode, setManualMode] = useState(false);
  const [manTx, setManTx] = useState(0);
  const [manTy, setManTy] = useState(0);
  const [manScale, setManScale] = useState(1);
  const [manRotation, setManRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  
  // Interactive canvas refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interaction state
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const garmentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const garmentBoundsRef = useRef<{minX: number, minY: number, maxX: number, maxY: number} | null>(null);
  const bodyMaskRef = useRef<{w: number, h: number, shoulderWidth: number, torsoHeight: number} | null>(null);

  useEffect(() => {
    if (garmentIdParam) {
      const found = GARMENTS.find(g => g.id === garmentIdParam);
      if (found) {
        setSelectedGarment(found);
      }
    }
  }, [garmentIdParam]);

  useEffect(() => {
    const initMP = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm');
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU'
          },
          runningMode: 'IMAGE',
          numPoses: 1
        });
      } catch (err) {
        console.warn('MediaPipe Init Failed', err);
      }
    };
    initMP();
  }, []);

  // Prevent default page scrolling when using mouse wheel inside the canvas container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preventScroll = (e: WheelEvent) => {
      if (manualMode && status === 'success') {
        e.preventDefault();
      }
    };
    container.addEventListener('wheel', preventScroll, { passive: false });
    return () => container.removeEventListener('wheel', preventScroll);
  }, [manualMode, status]);

  const handleUserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('请上传 5MB 以内的照片');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setUserImage(ev.target.result as string);
        setStatus('idle');
        setManualMode(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const prepareGarmentCanvas = async () => {
    const cObj = (selectedGarment.merchantColors || COLOR_OPTIONS).find((c: any) => c.id === color);
    
    let targetImageSrc = (cObj as any)?.image || selectedGarment.overlayImage || selectedGarment.image;
    if (selectedGarment.merchantVariants && selectedGarment.merchantVariants.length > 0) {
      const variant = selectedGarment.merchantVariants.find((v: any) => 
        (v.colorId === color || (!v.colorId && (!selectedGarment.merchantColors || selectedGarment.merchantColors.length === 0))) &&
        (v.fabricId === fabric || (!v.fabricId && (!selectedGarment.merchantFabrics || selectedGarment.merchantFabrics.length === 0)))
      );
      if (variant && variant.image) {
        targetImageSrc = variant.image;
      }
    }
    
    const garmentImg = await loadImage(targetImageSrc);
    const gW = garmentImg.naturalWidth;
    const gH = garmentImg.naturalHeight;

    const gCanvas = document.createElement('canvas');
    gCanvas.width = gW;
    gCanvas.height = gH;
    const gCtx = gCanvas.getContext('2d')!;
    gCtx.drawImage(garmentImg, 0, 0, gW, gH);
    removeBackground(gCtx, gW, gH);
    
    const bounds = getGarmentBounds(gCtx, gW, gH);

    if (cObj && cObj.hex) {
      gCtx.save();
      gCtx.globalCompositeOperation = 'source-atop';
      gCtx.globalAlpha = 0.3;
      gCtx.fillStyle = cObj.hex;
      gCtx.fillRect(0, 0, gW, gH);
      gCtx.restore();
    }

    gCtx.save();
    if (fabric === 'silk') {
      gCtx.globalCompositeOperation = 'source-atop';
      gCtx.globalAlpha = 0.15;
      const grad = gCtx.createLinearGradient(0, 0, gW, gH);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.8)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, gW, gH);
    } else if (fabric === 'satin') {
      gCtx.globalAlpha = 0.95;
    } else if (fabric === 'embroidery') {
      gCtx.globalAlpha = 0.90;
    }
    gCtx.restore();

    return { gCanvas, bounds };
  };

  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !baseImgRef.current || !garmentCanvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    // Draw base image
    ctx.drawImage(baseImgRef.current, 0, 0, W, H);

    const gCanvas = garmentCanvasRef.current;
    const gW = gCanvas.width;
    const gH = gCanvas.height;
    
    // Apply size multiplier
    const finalScale = manScale * SIZE_SCALE[size];
    const drawW = gW * finalScale;
    const drawH = gH * finalScale;

    // We can draw directly in manual mode, or with mask in auto mode
    ctx.save();
    
    ctx.translate(manTx, manTy);
    ctx.rotate(manRotation);
    ctx.globalAlpha = 0.92;

    if (!manualMode && bodyMaskRef.current) {
        const mask = bodyMaskRef.current;
        const neckRadius = mask.shoulderWidth * 0.35; 
        const neckDepth = mask.torsoHeight * 0.15;
        
        ctx.beginPath();
        // Start from top-left
        ctx.moveTo(-mask.w / 2, 0);
        // Line to left side of neck
        ctx.lineTo(-neckRadius, 0);
        // U-shaped rounded arc for the neck hole (dipping down)
        ctx.bezierCurveTo(
            -neckRadius * 0.4, neckDepth, 
             neckRadius * 0.4, neckDepth, 
             neckRadius, 0
        );
        // Line to top-right
        ctx.lineTo(mask.w / 2, 0);
        // Line to bottom-right
        ctx.lineTo(mask.w / 2, mask.h);
        // Line to bottom-left
        ctx.lineTo(-mask.w / 2, mask.h);
        ctx.closePath();
        ctx.clip();
    }
    
    const bounds = garmentBoundsRef.current;
    let offsetX = -drawW / 2;
    let offsetY = 0;
    
    if (bounds && bounds.maxX > bounds.minX) {
        const croppedW = bounds.maxX - bounds.minX;
        offsetX = -(bounds.minX + croppedW / 2) * finalScale;
        offsetY = -(bounds.minY) * finalScale;
    }

    ctx.drawImage(gCanvas, offsetX, offsetY, drawW, drawH);
    ctx.restore();

  }, [manTx, manTy, manScale, manRotation, size, manualMode]);

  useEffect(() => {
    if (status === 'success') {
      renderCanvas();
    }
  }, [renderCanvas, status]);

  const handleStartTryOn = async () => {
    if (!userImage) return;
    setStatus('generating');
    setErrorMessage('');
    
    try {
      const baseImg = await loadImage(userImage);
      baseImgRef.current = baseImg;
      const W = baseImg.naturalWidth;
      const H = baseImg.naturalHeight;
      
      if (canvasRef.current) {
        canvasRef.current.width = W;
        canvasRef.current.height = H;
      }

      const { gCanvas, bounds } = await prepareGarmentCanvas();
      garmentCanvasRef.current = gCanvas;
      garmentBoundsRef.current = bounds;

      // Load saved manual state if exists
      const savedKey = `manual_${userImage.slice(-20)}`;
      const savedStr = localStorage.getItem(savedKey);
      
      if (manualMode && savedStr) {
          const saved = JSON.parse(savedStr);
          setManTx(saved.x);
          setManTy(saved.y);
          setManScale(saved.scale);
          setManRotation(saved.rotation);
          setStatus('success');
          return;
      }

      // 1. PoseLandmarker detection
      let poseValid = false;
      if (poseLandmarkerRef.current) {
        const results = poseLandmarkerRef.current.detect(baseImg);
        if (results.landmarks && results.landmarks[0]) {
          const lms = results.landmarks[0];
          const lShoulder = lms[11];
          const rShoulder = lms[12];
          const lHip = lms[23];
          const rHip = lms[24];
          const nose = lms[0];

          // 1. Visibility Check > 0.7
          const vis = Math.min(
            lShoulder.visibility ?? 0, rShoulder.visibility ?? 0,
            lHip.visibility ?? 0, rHip.visibility ?? 0
          );

          if (vis >= 0.7) {
            const lx = lShoulder.x * W; const ly = lShoulder.y * H;
            const rx = rShoulder.x * W; const ry = rShoulder.y * H;
            const hlx = lHip.x * W; const hly = lHip.y * H;
            const hrx = rHip.x * W; const hry = rHip.y * H;
            const noseY = nose.y * H;
            
            // MediaPipe: 11 is Left Shoulder (usually on the right side of the image if facing camera)
            // 12 is Right Shoulder (usually on the left side of the image)
            // Vector from image-left to image-right: left shoulder (11) - right shoulder (12)
            const dx = lx - rx;
            const dy = ly - ry;
            const shoulderWidth = Math.hypot(dx, dy);
            let rotation = Math.atan2(dy, dx);

            const shoulderY = (ly + ry) / 2;
            const hipY = (hly + hry) / 2;
            const torsoHeight = Math.abs(hipY - shoulderY) || 100; // prevent division by zero
            
            // Base of the neck is slightly above the shoulder joints
            const neckBaseY = shoulderY - torsoHeight * 0.12; 

            // Calculate true garment dimensions based on non-transparent bounds
            const croppedH = bounds.maxY - bounds.minY;
            const croppedW = bounds.maxX - bounds.minX;
            const actualH = croppedH > 50 ? croppedH : gCanvas.height;
            const actualW = croppedW > 50 ? croppedW : gCanvas.width;

            // Dual-constraint adaptive scaling:
            // 1. A long robe should match ~2.6x the torso height.
            let scaleH = (torsoHeight * 2.6) / actualH;
            // 2. A garment's full flat-lay width (including sleeves) is usually ~3.2x human shoulder width.
            let scaleW = (shoulderWidth * 3.2) / actualW;
            
            // Use the smaller scale to prevent short jackets from becoming gigantic, 
            // and prevent folded-sleeve robes from becoming too long.
            let scale = Math.min(scaleH, scaleW);
            
            // Center horizontally between shoulders.
            let tx = (lx + rx) / 2;
            // Anchor exactly at the base of the neck.
            let ty = neckBaseY;

            // Coordinate Constraints: ensure the dress doesn't fly up and cover the face.
            const garmentDrawH = actualH * scale * SIZE_SCALE[size];
            const garmentTopY = ty;
            
            // Safety check against face (nose)
            if (garmentTopY < noseY + 20) {
               ty += (noseY + 20 - garmentTopY);
            }

            // Geometric Mask:
            // Expand the mask heavily to allow wide sleeves and long skirts to show.
            // Only crop the top tightly to prevent covering the head/face.
            const maskW = shoulderWidth * 3.5;
            const maskH = torsoHeight * 3.0;
            bodyMaskRef.current = {
                w: maskW,
                h: maskH,
                shoulderWidth,
                torsoHeight
            };

            setManTx(tx);
            setManTy(ty);
            setManScale(scale);
            setManRotation(rotation);
            poseValid = true;
          } else {
             throw new Error("未检测到清晰的上半身，请退后一点，露出肩膀和腰部重新拍照。");
          }
        } else {
            throw new Error("未检测到人体姿态。");
        }
      }

      if (!poseValid && !manualMode) {
          throw new Error("姿态检测引擎尚未准备好。");
      }

      setManualMode(false);
      setStatus('success');
    } catch (err: any) {
      console.warn(err);
      setErrorMessage(err.message || "检测失败");
      // Fallback to manual mode defaults
      if (canvasRef.current) {
         setManTx(canvasRef.current.width / 2);
         setManTy(canvasRef.current.height / 2);
         setManScale( (canvasRef.current.width * 0.6) / (garmentCanvasRef.current?.width || 1000) );
         setManRotation(0);
      }
      setManualMode(true);
      setStatus('success');
    }
  };

  // Re-generate on option change if success
  const prevOpts = useRef({ color, fabric, size, garmentId: selectedGarment.id });
  useEffect(() => {
    const cur = { color, fabric, size, garmentId: selectedGarment.id };
    const changed = JSON.stringify(prevOpts.current) !== JSON.stringify(cur);
    prevOpts.current = cur;

    if (changed && status === 'success') {
      const timer = setTimeout(() => {
        handleStartTryOn();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [color, fabric, size, selectedGarment]);

  // Save manual state
  useEffect(() => {
    if (manualMode && status === 'success' && userImage) {
       const savedKey = `manual_${userImage.slice(-20)}`;
       localStorage.setItem(savedKey, JSON.stringify({ x: manTx, y: manTy, scale: manScale, rotation: manRotation }));
    }
  }, [manTx, manTy, manScale, manRotation, manualMode, status, userImage]);

  // Canvas Interactions
  const getMousePos = (e: React.MouseEvent | React.WheelEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!manualMode || status !== 'success') return;
    isDragging.current = true;
    lastMouse.current = getMousePos(e);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !manualMode || status !== 'success') return;
    const pos = getMousePos(e);
    const dx = pos.x - lastMouse.current.x;
    const dy = pos.y - lastMouse.current.y;
    
    if (e.shiftKey) {
        // Rotate
        setManRotation(prev => prev + dx * 0.01);
    } else {
        // Translate
        setManTx(prev => prev + dx);
        setManTy(prev => prev + dy);
    }
    lastMouse.current = pos;
  };

  const onMouseUp = () => { isDragging.current = false; };
  
  const onWheel = (e: React.WheelEvent) => {
    if (!manualMode || status !== 'success') return;
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? 0.95 : 1.05;
    setManScale(prev => Math.max(0.1, prev * zoomDelta));
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    a.download = `野有蔓草_试穿_${Date.now()}.jpg`;
    a.click();
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    const colorObj = COLOR_OPTIONS.find(c => c.id === color);
    const fabricObj = FABRIC_OPTIONS.find(f => f.id === fabric);
    addToCart({
      garmentId: selectedGarment.id,
      title: `${selectedGarment.name} (2D试穿款)`,
      image: canvasRef.current ? canvasRef.current.toDataURL('image/jpeg', 0.9) : selectedGarment.image,
      price: selectedGarment.price,
      size,
      color,
      colorName: colorObj ? colorObj.name : '朱红',
      fabric,
      fabricName: fabricObj ? fabricObj.name : '天然桑蚕丝',
      quantity: 1
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gold/30">
        <h1 className="font-serif text-2xl font-bold text-ink">传统婚嫁礼服 · 2D 智能试穿工坊</h1>
        <Link to={`/custom?id=${selectedGarment.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gold hover:bg-gold/15 text-gold-dark text-xs font-serif"><Scissors className="w-3.5 h-3.5" />前往工坊量体</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-rice p-5 rounded-lg border border-gold/40 shadow-sm space-y-5">
            <div>
              <label className="text-xs font-serif font-bold text-ink flex gap-1.5 mb-2"><User className="w-3.5 h-3.5 text-vermilion" />上传人像照片 (支持 5MB 内)</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="py-2 border border-gold/30 text-xs flex justify-center items-center gap-1"><Upload className="w-3.5 h-3.5"/> 本地照片</button>
                <button type="button" onClick={() => setIsCameraModalOpen(true)} className="py-2 border border-gold/30 text-xs flex justify-center items-center gap-1"><Camera className="w-3.5 h-3.5"/> 拍摄照片</button>
              </div>
              {userImage ? (
                <img src={userImage} className="w-full h-48 object-cover rounded border-2 border-gold/60" />
              ) : (
                <div className="w-full h-48 bg-gold/10 border-2 border-dashed border-gold/40 rounded flex flex-col items-center justify-center text-gold-dark/60">
                   <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                   <span className="text-xs font-serif">请上传您的正面全身或半身照</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUserFileChange} />
            </div>



            <div className="space-y-3 pt-3 border-t border-gold/20">
              <div className="grid grid-cols-4 gap-1">
                {(selectedGarment.merchantColors || COLOR_OPTIONS).map((c: any) => <button key={c.id} onClick={() => setColor(c.id)} className={`py-1 text-[10px] border ${color === c.id ? 'border-vermilion text-vermilion' : 'border-gold/30'}`}>{c.name.length > 2 && c.hex ? c.name.slice(2) : c.name}</button>)}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(selectedGarment.merchantFabrics || FABRIC_OPTIONS).map((f: any) => <button key={f.id} onClick={() => setFabric(f.id)} className={`py-1 text-[10px] border ${fabric === f.id ? 'border-vermilion text-vermilion' : 'border-gold/30'}`}>{f.name}</button>)}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['S', 'M', 'L', 'XL'] as const).map(s => <button key={s} onClick={() => setSize(s)} className={`py-1 text-[10px] border ${size === s ? 'bg-vermilion text-white' : 'border-gold/30'}`}>{s}</button>)}
              </div>
            </div>

            <button disabled={status === 'generating' || !userImage} onClick={handleStartTryOn} className="w-full py-3 bg-vermilion disabled:bg-vermilion/50 text-white text-sm rounded shadow flex items-center justify-center gap-2 transition-colors">
              <Sparkles className="w-4 h-4" /> {status === 'generating' ? '生成中...' : '开始试穿'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-rice-light p-6 rounded-lg border-2 border-gold shadow-md">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-serif text-lg font-bold">试穿结果</h3>
             {status === 'success' && (
               <button onClick={() => setManualMode(!manualMode)} className={`text-xs px-3 py-1 rounded border flex items-center gap-1 ${manualMode ? 'bg-vermilion text-white border-vermilion' : 'bg-white text-ink border-gold'}`}>
                 <Move className="w-3 h-3" /> 手动调整模式 {manualMode && <Check className="w-3 h-3"/>}
               </button>
             )}
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div 
            ref={containerRef} 
            className="relative w-full aspect-[3/4] max-h-[600px] bg-black rounded-lg overflow-hidden border border-gold/50 mx-auto"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            style={{ cursor: manualMode ? (isDragging.current ? 'grabbing' : 'grab') : 'default' }}
          >
            {status !== 'success' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/50">
                {status === 'generating' ? <div className="animate-spin w-8 h-8 border-2 border-vermilion border-t-transparent rounded-full mb-2" /> : <ImageIcon className="w-12 h-12 mb-2" />}
                <p className="text-sm">{status === 'generating' ? '合成中...' : '等待试穿'}</p>
              </div>
            )}
            
            <canvas 
              ref={canvasRef} 
              className={`w-full h-full object-contain ${status === 'success' ? 'block' : 'hidden'}`} 
            />

            {manualMode && status === 'success' && (
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/60 text-white text-[10px] rounded backdrop-blur text-center flex justify-around">
                <span>🖱️ 拖拽移动位置</span>
                <span>🖱️ 滚轮缩放大小</span>
                <span>⇧ Shift + 拖拽旋转</span>
              </div>
            )}
          </div>

          {status === 'success' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={downloadImage} className="py-2.5 border border-gold text-xs flex justify-center items-center gap-1"><Download className="w-4 h-4"/> 保存图片</button>
              <button onClick={handleAddToCart} className="py-2.5 bg-vermilion text-white text-xs flex justify-center items-center gap-1"><ShoppingBag className="w-4 h-4"/> 加入购物车 {addedSuccess && '(已加)'}</button>
            </div>
          )}
        </div>
      </div>
      <CameraCaptureModal isOpen={isCameraModalOpen} onClose={() => setIsCameraModalOpen(false)} onCapture={img => { setUserImage(img); setStatus('idle'); }} />
    </div>
  );
};
