require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// JSON File Database
// ============================================
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'store.json');

function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const defaultDb = {
      users: [{ id: 1, username: process.env.ADMIN_USER || 'admin', password: hashedPassword, role: 'admin' }],
      categories: [
        { id: 1, name: 'Bakso', description: 'Bakso Spesial dengan kuah gurih dan nikmat' },
        { id: 2, name: 'Mie Ayam', description: 'Mie Ayam dengan topping ayam pilihan' },
        { id: 3, name: 'Minuman', description: 'Minuman segar pelengkap makan' },
        { id: 4, name: 'Tambahan', description: 'Tambahan lauk dan pelengkap' }
      ],
      products: [
        { id: 1, name: 'Bakso Urat Super', description: 'Bakso urat sapi porsi besar dengan kuah kaldu tulang yang kaya rempah, dilengkapi telur rebus dan bihun.', price: 28000, category_id: 1, image: null, image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', featured: true, available: true, created_at: new Date().toISOString() },
        { id: 2, name: 'Bakso Campur Spesial', description: 'Perpaduan bakso sapi, bakso urat, bakso kecil, tahu, siomay, dan mie kuning dalam kuah gurih.', price: 32000, category_id: 1, image: null, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop', featured: true, available: true, created_at: new Date().toISOString() },
        { id: 3, name: 'Bakso Telur', description: 'Bakso berisi telur ayam utuh dengan kuah bening segar dan pelengkap sayuran.', price: 22000, category_id: 1, image: null, image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 4, name: 'Bakso Mercon', description: 'Bakso pedas level ekstra dengan isian cabai rawit dan sambal rahasia khas Samarinda.', price: 25000, category_id: 1, image: null, image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 5, name: 'Mie Ayam Spesial', description: 'Mie ayam dengan topping ayam cincang bumbu kecap, pangsit goreng, sawi hijau, dan bakso.', price: 27000, category_id: 2, image: null, image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', featured: true, available: true, created_at: new Date().toISOString() },
        { id: 6, name: 'Mie Ayam Bakso', description: 'Mie ayam lengkap dengan 4 butir bakso sapi, pangsit goreng, dan sayuran segar.', price: 30000, category_id: 2, image: null, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 7, name: 'Mie Ayam Jamur', description: 'Mie ayam dengan topping jamur champignon tumis, ayam suwir, dan daun bawang.', price: 28000, category_id: 2, image: null, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de1b100?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 8, name: 'Mie Ayam Yamin', description: 'Mie ayam kering dengan bumbu kecap manis khas, irisan daun bawang, dan minyak wijen.', price: 25000, category_id: 2, image: null, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 9, name: 'Es Teh Manis', description: 'Teh manis dingin segar, cocok sebagai pelengkap makan bakso dan mie ayam.', price: 8000, category_id: 3, image: null, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 10, name: 'Es Jeruk Segar', description: 'Jeruk peras segar dengan es batu, manis alami dari buah jeruk pilihan.', price: 10000, category_id: 3, image: null, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 11, name: 'Es Batagor', description: 'Es batagor bandung dengan bumbu kacang kental dan saus pedas manis.', price: 12000, category_id: 3, image: null, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 12, name: 'Pangsit Goreng', description: 'Pangsit goreng renyah berisi daging ayam dan udang, cocok untuk camilan.', price: 10000, category_id: 4, image: null, image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 13, name: 'Tahu Sumedang', description: 'Tahu sumedang goreng panas dengan sambal kacang pedas.', price: 8000, category_id: 4, image: null, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() },
        { id: 14, name: 'Kerupuk', description: 'Kerupuk udang dan kerupuk emping segar untuk pelengkap.', price: 5000, category_id: 4, image: null, image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=400&fit=crop', featured: false, available: true, created_at: new Date().toISOString() }
      ],
      settings: {
        store_name: process.env.STORE_NAME || 'Bakso & Mie Ayam SMD',
        store_address: process.env.STORE_ADDRESS || 'Jl. P. Diponegoro No. 45, Samarinda, Kalimantan Timur',
        store_phone: process.env.STORE_PHONE || '0812-3456-7890',
        store_hours: process.env.STORE_HOURS || '08:00 - 21:00 WITA',
        store_description: process.env.STORE_DESCRIPTION || 'Menyajikan bakso dan mie ayam terenak di Samarinda',
        facebook: process.env.FACEBOOK_URL || 'https://www.facebook.com/baksoMieAyamSMD',
        instagram: process.env.INSTAGRAM_URL || 'https://www.instagram.com/baksoMieAyamSMD',
        tiktok: process.env.TIKTOK_URL || 'https://www.tiktok.com/@baksoMieAyamSMD',
        hero_image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1920&h=1080&fit=crop',
        about_image: null
      },
      nextIds: { users: 2, categories: 5, products: 15 }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
  }
}

function readDb() {
  ensureDbExists();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getNextId(db, collection) {
  const id = db.nextIds[collection] || 1;
  db.nextIds[collection] = id + 1;
  return id;
}

// Initialize database
ensureDbExists();

// ============================================
// Middleware
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'bakso-smd-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/admin/login');
}

// ============================================
// API Routes
// ============================================

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.username === username);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    return res.json({ success: true, redirect: '/admin/dashboard' });
  }
  return res.json({ success: false, message: 'Username atau password salah' });
});

// Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Categories API
app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories);
});

app.post('/api/categories', requireAuth, (req, res) => {
  const { name, description } = req.body;
  const db = readDb();
  const id = getNextId(db, 'categories');
  db.categories.push({ id, name, description: description || '' });
  writeDb(db);
  res.json({ success: true, id });
});

app.put('/api/categories/:id', requireAuth, (req, res) => {
  const { name, description } = req.body;
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.categories.findIndex(c => c.id === id);
  if (index !== -1) {
    db.categories[index] = { ...db.categories[index], name, description };
    writeDb(db);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Kategori tidak ditemukan' });
  }
});

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  db.categories = db.categories.filter(c => c.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Products API
app.get('/api/products', (req, res) => {
  const db = readDb();
  let products = db.products.map(p => {
    const category = db.categories.find(c => c.id === p.category_id);
    const imageUrl = p.image ? `/uploads/${p.image}` : (p.image_url || null);
    return { ...p, category_name: category ? category.name : null, display_image: imageUrl };
  });

  const { category, featured } = req.query;
  if (category) {
    products = products.filter(p => p.category_id == category);
  }
  if (featured) {
    products = products.filter(p => p.featured);
  }

  products.sort((a, b) => b.id - a.id);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const product = db.products.find(p => p.id === id);
  
  if (product) {
    const category = db.categories.find(c => c.id === product.category_id);
    const imageUrl = product.image ? `/uploads/${product.image}` : (product.image_url || null);
    res.json({ ...product, category_name: category ? category.name : null, display_image: imageUrl });
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

app.post('/api/products', requireAuth, upload.single('image'), (req, res) => {
  const { name, description, price, category_id, featured, available } = req.body;
  const image = req.file ? req.file.filename : null;
  const db = readDb();
  const id = getNextId(db, 'products');
  
  db.products.push({
    id,
    name,
    description: description || '',
    price: parseInt(price),
    category_id: category_id ? parseInt(category_id) : null,
    image,
    featured: featured === 'true' || featured === '1',
    available: available !== 'false' && available !== '0',
    created_at: new Date().toISOString()
  });
  writeDb(db);
  res.json({ success: true, id });
});

app.put('/api/products/:id', requireAuth, upload.single('image'), (req, res) => {
  const { name, description, price, category_id, featured, available } = req.body;
  const db = readDb();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);
  
  if (index !== -1) {
    const image = req.file ? req.file.filename : db.products[index].image;
    db.products[index] = {
      ...db.products[index],
      name,
      description: description || '',
      price: parseInt(price),
      category_id: category_id ? parseInt(category_id) : null,
      image,
      featured: featured === 'true' || featured === '1',
      available: available !== 'false' && available !== '0'
    };
    writeDb(db);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Produk tidak ditemukan' });
  }
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const product = db.products.find(p => p.id === id);
  
  if (product && product.image) {
    const imagePath = path.join(__dirname, 'uploads', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  db.products = db.products.filter(p => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Settings API
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

app.put('/api/settings', requireAuth, (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true });
});

// Settings image upload
app.post('/api/settings/upload-image', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: 'Tidak ada file yang diupload' });
  }
  const { field } = req.body; // 'hero_image' or 'about_image'
  if (!field || !['hero_image', 'about_image'].includes(field)) {
    return res.json({ success: false, message: 'Field tidak valid' });
  }
  const db = readDb();
  db.settings[field] = `/uploads/${req.file.filename}`;
  writeDb(db);
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

// Change password
app.put('/api/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.id === req.session.userId);
  
  if (bcrypt.compareSync(oldPassword, user.password)) {
    user.password = bcrypt.hashSync(newPassword, 10);
    writeDb(db);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Password lama salah' });
  }
});

// ============================================
// Page Routes
// ============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`\n🍜 ========================================`);
  console.log(`   Bakso & Mie Ayam SMD - Server Running`);
  console.log(`========================================`);
  console.log(`\n   Website  : http://localhost:${PORT}`);
  console.log(`   Admin    : http://localhost:${PORT}/admin/login`);
  console.log(`   Username : ${process.env.ADMIN_USER || 'admin'}`);
  console.log(`   Password : ${'*'.repeat((process.env.ADMIN_PASSWORD || 'admin123').length)}`);
  console.log(`\n========================================\n`);
});
