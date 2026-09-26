import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
const MERCHANTS_FILE = path.join(DATA_DIR, 'merchants.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure files exist
if (!fs.existsSync(MERCHANTS_FILE)) fs.writeFileSync(MERCHANTS_FILE, '[]');
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]');

// Helper functions
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// 1. Merchant Register
router.post('/register', (req, res) => {
  try {
    const { name, password, contact, phone, description } = req.body;
    if (!name || !password) return res.status(400).json({ success: false, message: 'Name and password required' });
    
    const merchants = readJson(MERCHANTS_FILE);
    if (merchants.find(m => m.name === name)) {
      return res.status(400).json({ success: false, message: '该商家名称已被注册' });
    }
    
    const newMerchant = { id: Date.now().toString(), name, password, contact, phone, description, createdAt: new Date().toISOString() };
    merchants.push(newMerchant);
    writeJson(MERCHANTS_FILE, merchants);
    
    res.json({ success: true, message: '注册成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. Merchant Login
router.post('/login', (req, res) => {
  try {
    const { name, password } = req.body;
    const merchants = readJson(MERCHANTS_FILE);
    const merchant = merchants.find(m => m.name === name && m.password === password);
    if (!merchant) return res.status(401).json({ success: false, message: '商家名称或密码错误' });
    
    const { password: _, ...merchantInfo } = merchant;
    res.json({ success: true, merchant: merchantInfo });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') cb(null, true);
    else cb(new Error('Only PNG is allowed'));
  }
});

// 8. Image Upload
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  });
});

// 3. Create Product
router.post('/products', (req, res) => {
  try {
    const { merchantId, name, category, price, imageUrl, description } = req.body;
    if (!merchantId || !name || !category || !price || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const merchants = readJson(MERCHANTS_FILE);
    const merchant = merchants.find(m => m.id === merchantId);
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found' });

    const products = readJson(PRODUCTS_FILE);
    const newProduct = {
      id: `m_${Date.now()}`,
      merchantId,
      merchantName: merchant.name,
      name,
      category,
      price: Number(price),
      originalPrice: Math.floor(Number(price) * 1.5),
      image: imageUrl,
      description: description || name,
      tags: ['商家定制', '原创设计'],
      target: '全部', // Default logic
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    writeJson(PRODUCTS_FILE, products);
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4 & 5. Get Products (All or by merchantId)
router.get('/products', (req, res) => {
  try {
    const { merchantId } = req.query;
    const products = readJson(PRODUCTS_FILE);
    if (merchantId) {
      res.json({ success: true, products: products.filter(p => p.merchantId === merchantId) });
    } else {
      res.json({ success: true, products });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Update Product
router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, imageUrl, description } = req.body;
    
    const products = readJson(PRODUCTS_FILE);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    
    products[idx] = {
      ...products[idx],
      name: name || products[idx].name,
      category: category || products[idx].category,
      price: price ? Number(price) : products[idx].price,
      originalPrice: price ? Math.floor(Number(price) * 1.5) : products[idx].originalPrice,
      image: imageUrl || products[idx].image,
      description: description !== undefined ? description : products[idx].description,
    };
    
    writeJson(PRODUCTS_FILE, products);
    res.json({ success: true, product: products[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Delete Product
router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readJson(PRODUCTS_FILE);
    const initialLen = products.length;
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === initialLen) return res.status(404).json({ success: false, message: 'Product not found' });
    
    writeJson(PRODUCTS_FILE, filtered);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
