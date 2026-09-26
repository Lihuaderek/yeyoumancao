import merchantRouter from './merchant_api.js';
/**
 * 閲庢湁钄撹崏 路 AI 鐪熷疄铏氭嫙璇曠┛鍚庣鏈嶅姟 (Express + @gradio/client)
 * 瀵规帴 Hugging Face Spaces 涓婄殑寮€婧愯瘯绌挎ā鍨?(IDM-VTON)
 * 鍖呭惈 handle_file 鏂囦欢娴佷笂浼犮€乑eroGPU 閰嶉涓庨槦鍒楀閿欍€佺湡瀹炶瘯绌挎垚鏁堝浘瑙ｆ瀽
 * 涓ユ牸鏉滅粷浠讳綍 2D 璐寸焊鍚堟垚閫犲亣锛屽憟鐜扮収鐗囩骇鏈嶉グ绌跨潃璐ㄦ劅
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Client, handle_file } from '@gradio/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TMP_DIR = path.resolve(__dirname, 'tmp');

// 纭繚涓存椂鐩綍瀛樺湪
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;
const TIMEOUT_MS = 28000; // 28绉掍弗鏍艰秴鏃?
// 涓棿浠堕厤缃?app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/merchant', merchantRouter);
app.use('/api', merchantRouter);
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// 棰勮娆惧紡鍒扮湡瀹炶瘯绌垮疄鎷嶅浘鐨勬槧灏勮〃锛堢敺濂冲悇3娆撅紝100%鍏ㄧ湡鐓х墖锛?)
const PRESET_TRYON_MAP = {
  'men-xiuhe-01': '/images/tryon_men_1.jpg',
  'men-longfeng-02': '/images/tryon_men_2.jpg',
  'men-hanfu-03': '/images/tryon_men_3.jpg',
  'women-xiuhe-01': '/images/tryon_women_1.jpg',
  'women-longfeng-02': '/images/tryon_women_2.jpg',
  'women-qipao-03': '/images/tryon_women_3.jpg',
};

/**
 * 灏?input锛圖ataURL / 鏈湴鐩稿璺緞 / 缃戠粶URL / Base64锛夎惤鐩樹负鐗╃悊鏂囦欢锛岃繑鍥炵粷瀵硅矾寰? */
async function toLocalFilePath(input, prefix = 'upload') {
  if (!input) return null;

  try {
    // 1. 鑻ヤ负鏈湴鐩稿璺緞 (渚嬪 /images/garment_men_1.jpg)
    if (typeof input === 'string' && (input.startsWith('/') || input.startsWith('images/'))) {
      const cleanPath = input.startsWith('/') ? input.slice(1) : input;
      const localFile = path.resolve(__dirname, '..', 'public', cleanPath);
      if (fs.existsSync(localFile)) {
        return localFile;
      }
    }

    // 2. 鑻ヤ负 base64 DataURL
    if (typeof input === 'string' && input.startsWith('data:')) {
      const matches = input.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].includes('png') ? '.png' : '.jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const tmpFile = path.join(TMP_DIR, `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`);
        fs.writeFileSync(tmpFile, buffer);
        return tmpFile;
      }
    }

    // 3. 鑻ヤ负杩滅▼ URL
    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      const response = await fetch(input);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tmpFile = path.join(TMP_DIR, `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`);
      fs.writeFileSync(tmpFile, buffer);
      return tmpFile;
    }

    // 4. 鑻ヤ负绾?base64 字符串）
    if (typeof input === 'string' && input.length > 100) {
      const buffer = Buffer.from(input, 'base64');
      const tmpFile = path.join(TMP_DIR, `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`);
      fs.writeFileSync(tmpFile, buffer);
      return tmpFile;
    }
  } catch (e) {
    console.error(`[toLocalFilePath Error] prefix=${prefix}:`, e);
  }

  return null;
}

/**
 * 灏?input 杞崲涓哄墠绔彲鐩存帴娓叉煋鐨?DataURL
 */
function toDataUrl(input, defaultMime = 'image/jpeg') {
  if (!input) return '';
  if (typeof input === 'string' && (input.startsWith('data:') || input.startsWith('http://') || input.startsWith('https://'))) {
    return input;
  }
  if (typeof input === 'string' && (input.startsWith('/') || input.startsWith('images/'))) {
    const cleanPath = input.startsWith('/') ? input.slice(1) : input;
    const localFile = path.resolve(__dirname, '..', 'public', cleanPath);
    if (fs.existsSync(localFile)) {
      const buffer = fs.readFileSync(localFile);
      const ext = path.extname(localFile).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
  }
  return input;
}

/**
 * 瀹夊叏瑙ｆ瀽閿欒瀵硅薄锛屾潨缁?[object Object]锛岃緭鍑轰汉绫诲彲璇荤殑鏂囧瓧
 */
function extractErrorMessage(err) {
  if (!err) return '鏈煡閿欒锛岃閲嶈瘯';
  if (typeof err === 'string') {
    if (err.includes('[object Object]')) {
      return '浜戠绠楀姏鑺傜偣鍝嶅簲寮傚父锛岃閲嶈瘯';
    }
    return err;
  }

  const errMsg = err.message || '';
  if (typeof errMsg === 'string') {
    if (errMsg.includes('ZeroGPU quota')) {
      return 'Hugging Face ZeroGPU 鍏叡閰嶉鑰楀敖';
    }
    if (errMsg.includes('Timeout') || errMsg.includes('timeout') || errMsg.includes('timed out')) {
      return 'AI 鐢熸垚瓒呮椂锛岃閲嶈瘯';
    }
  }

  // Gradio client status 缁撴瀯瀵硅薄
  if (err.stage === 'error' || err.type === 'status') {
    const ep = err.endpoint || 'API';
    const detail = typeof err.message === 'string' ? err.message : '';
    return `浜戠 AI 绠楀姏鑺傜偣 (${ep}) 鏆傛椂绻佸繖鎴栭槦鍒楁嫢鎸ゃ€?{detail ? '鍘熷洜: ' + detail : ''}`;
  }

  if (err.error) {
    if (typeof err.error === 'string') return err.error;
    try {
      const j = JSON.stringify(err.error);
      if (j && j !== '{}') return j.slice(0, 100);
    } catch {}
  }

  if (typeof errMsg === 'string' && errMsg.trim().length > 0) {
    return errMsg.slice(0, 120);
  }

  try {
    const raw = JSON.stringify(err);
    if (raw && raw !== '{}') return raw.slice(0, 120);
  } catch {}

  return '浜戠 AI 璇曠┛绠楀姏鑺傜偣绻佸繖锛岃閲嶈瘯';
}

/**
 * 甯︽湁瓒呮椂鎺у埗鐨?Promise 鍖呰鍣? */
function withTimeout(promise, ms, timeoutMessage = 'AI 鐢熸垚瓒呮椂锛岃閲嶈瘯') {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(timeoutMessage);
      err.name = 'TimeoutError';
      reject(err);
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeoutPromise
  ]);
}

// 瀹㈡埛绔繛鎺ョ紦瀛?let cachedClients = {};

async function getClient(spaceId) {
  if (cachedClients[spaceId]) {
    return cachedClients[spaceId];
  }
  const options = {};
  if (process.env.HF_TOKEN) {
    options.hf_token = process.env.HF_TOKEN;
  }
  console.log(`[HF Connect] Connecting to ${spaceId}...`);
  const client = await Client.connect(spaceId, options);
  cachedClients[spaceId] = client;
  console.log(`[HF Connect] Connected to ${spaceId} successfully.`);
  return client;
}

// 1. 接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'yeyoumancao-vton-backend',
    supportedModels: ['yisol/IDM-VTON', 'levihsu/OOTDiffusion'],
    timestamp: new Date().toISOString()
  });
});

// 2. 铏氭嫙璇曠┛鏍稿績鎺ュ彛 (鐪熷疄鐨?AI 铏氭嫙璇曠┛涓庣湡瀹炵┛鐫€鏁堟灉鍛堢幇)
app.post('/api/try-on', async (req, res) => {
  const startTime = Date.now();
  console.log(`[Try-on Request Received] at ${new Date().toISOString()}`);

  const {
    userImage,
    garmentImage,
    garmentId = '',
    tryonImage = '',
    gender = 'women',
    description = '',
    category = 'hanfu',
    color = 'red',
    fabric = 'silk',
    size = 'M',
    denoiseSteps = 25,
    seed = 42
  } = req.body;

  // 鍩虹鍙傛暟鏍￠獙
  if (!userImage) {
    return res.status(400).json({
      success: false,
      message: '',
    });
  }

  if (!garmentImage) {
    return res.status(400).json({
      success: false,
      message: '璇烽€夋嫨鎴栦笂浼犺瘯绌跨殑鐩爣鍗庢湇娆惧紡'
    });
  }

  // 澧炲己鎻愮ず璇?  const colorDesc = color === 'gold' ? 'radiant imperial gold' : color === 'pink' ? 'blossom pink' : color === 'blue' ? 'deep indigo cyan' : 'festive traditional vermilion red';
  const fabricDesc = fabric === 'silk' ? 'smooth luxurious mulberry silk' : fabric === 'satin' ? 'heavy golden brocade satin' : 'intricate gold thread embroidery';
  const enhancedPrompt = `${description || 'traditional Chinese wedding clothing'}, ${colorDesc}, ${fabricDesc}, photorealistic fabric textures, realistic collar and sleeve draping`;

  // 灏嗕汉鍍忎笌鏈嶈钀界洏涓烘湰鍦版枃浠讹紝渚?handle_file 鎻愬彇
  const userFilePath = await toLocalFilePath(userImage, 'user');
  const garmentFilePath = await toLocalFilePath(garmentImage, 'garment');

  if (!userFilePath || !garmentFilePath) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file path' }); } 
  // ========================================================
  try {
    const elapsedSoFar = Date.now() - startTime;
    const remainingTime = Math.max(1000, TIMEOUT_MS - elapsedSoFar - 3000);
    const subTimeout = Math.min(12000, remainingTime);

    console.log(`[Attempt 1: IDM-VTON] Starting predict with handle_file (timeout: ${subTimeout}ms)...`);
    const idmClient = await getClient('yisol/IDM-VTON');

    const idmPredict = idmClient.predict('/tryon', {
      dict: {
        background: handle_file(userFilePath),
        layers: [],
        composite: null
      },
      garm_img: handle_file(garmentFilePath),
      garment_des: enhancedPrompt,
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: Math.min(Math.max(denoiseSteps || 25, 20), 30),
      seed: seed || 42
    });

    const result = await withTimeout(idmPredict, subTimeout, 'IDM-VTON 闃熷垪瓒呮椂');
    if (result && result.data && Array.isArray(result.data) && result.data[0]) {
      const first = result.data[0];
      const outputUrl = typeof first === 'string' ? first : first.url;
      if (outputUrl) {
        // 濡傛灉鏄繑鍥炵殑杩滅▼閾炬帴鎴栨枃浠讹紝杞负鏍囧噯 DataURL
        finalResultUrl = toDataUrl(outputUrl);
        modelUsed = 'yisol/IDM-VTON (绁炵粡鎵╂暎璇曠┛妯″瀷)';
        console.log(`[IDM-VTON Success] Generated result successfully.`);
      }
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    console.warn(`[IDM-VTON Failed] ${msg}`);
    failureReasons.push(`IDM-VTON: ${msg}`);
  }

  // ========================================================
  // 璇曠┛鏁堟灉鍛堢幇锛氭潨缁濋€犲亣锛岃繑鍥炲叏鐪熺収鐗囩骇璇曠┛瀹炴媿
  // 褰撲簯绔?ZeroGPU 鎺掗槦/閰嶉鑰楀敖鏃讹紝鍛堢幇璇ユ绀兼湇鐨勭湡浜哄疄绌块珮娓呮晥鏋?  // ========================================================
  const elapsed = Math.round((Date.now() - startTime) / 1000);

  if (!finalResultUrl) {
    console.log(`[Authentic Reference] Cloud ZeroGPU busy. Returning error instead of fake image.`);
    return res.status(503).json({
      success: false,
      message: failureReasons.join(" | ") || 'Cloud AI busy, try again'
    });
  }

  // 娓呯悊涓存椂鐢熸垚鐨勬枃浠讹紙淇濈暀 public 鍐呯殑闈欐€佸師鍥撅級
  try {
    if (userFilePath.startsWith(TMP_DIR) && fs.existsSync(userFilePath)) {
      fs.unlinkSync(userFilePath);
    }
    if (garmentFilePath.startsWith(TMP_DIR) && fs.existsSync(garmentFilePath)) {
      fs.unlinkSync(garmentFilePath);
    }
  } catch (cleanErr) {
    // 蹇界暐娓呯悊鍋跺彂寮傚父
  }

  const message = isFallback ? 'Cloud AI fallback used.' : 'AI try-on successful!';

  return res.json({
    success: true,
    resultUrl: finalResultUrl,
    modelUsed,
    isFallback,
    message,
    elapsedSeconds: elapsed
  });
});


// 静态托管前端生产环境代码
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend build not found. Please run npm run build.');
    }
  }
});

// 启动服务
const server = 
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
  

server.setTimeout(35000);

