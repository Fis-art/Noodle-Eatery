// Main JavaScript for Frontend

document.addEventListener('DOMContentLoaded', function() {
  // Load settings
  loadSettings();
  
  // Load products
  loadProducts();
  
  // Setup event listeners
  setupNavbar();
  setupMobileMenu();
  setupScrollEffects();
  setupSocialSidebar();
  animateStats();
});

// ============================================
// Settings
// ============================================
async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    const settings = await response.json();
    
    if (settings.store_name) {
      document.title = `${settings.store_name} - Enak dan Nikmat di Samarinda`;
    }
    if (settings.store_description) {
      document.getElementById('storeDesc').textContent = settings.store_description;
    }
    if (settings.store_address) {
      document.getElementById('storeAddress').textContent = settings.store_address;
    }
    if (settings.store_phone) {
      document.getElementById('storePhone').textContent = settings.store_phone;
      document.getElementById('orderBtn').href = `tel:${settings.store_phone.replace(/[^0-9]/g, '')}`;
    }
    if (settings.store_hours) {
      document.getElementById('storeHours').textContent = settings.store_hours;
    }
    // Social media links - sidebar
    if (settings.facebook) {
      document.getElementById('linkFacebook').href = settings.facebook;
      document.getElementById('footerFacebook').href = settings.facebook;
      document.getElementById('footerFacebook2').href = settings.facebook;
    }
    if (settings.instagram) {
      document.getElementById('linkInstagram').href = settings.instagram;
      document.getElementById('footerInstagram').href = settings.instagram;
      document.getElementById('footerInstagram2').href = settings.instagram;
    }
    if (settings.tiktok) {
      document.getElementById('linkTiktok').href = settings.tiktok;
      document.getElementById('footerTiktok').href = settings.tiktok;
      document.getElementById('footerTiktok2').href = settings.tiktok;
    }
    // WhatsApp
    if (settings.store_phone) {
      const waPhone = settings.store_phone.replace(/[^0-9]/g, '');
      document.getElementById('footerWhatsapp').href = `https://wa.me/${waPhone}`;
    }
    // Hero background image
    if (settings.hero_image) {
      const heroBg = document.getElementById('heroBg');
      heroBg.classList.add('hero-bg-image');
      heroBg.style.backgroundImage = `url('${settings.hero_image}')`;
    }
    // About store image
    if (settings.about_image) {
      const aboutImg = document.getElementById('aboutStoreImage');
      const aboutPlaceholder = document.getElementById('aboutImagePlaceholder');
      aboutImg.src = settings.about_image;
      aboutImg.style.display = 'block';
      aboutPlaceholder.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// ============================================
// Products
// ============================================
let allProducts = [];
let categories = [];

async function loadProducts() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories')
    ]);
    
    allProducts = await productsRes.json();
    categories = await categoriesRes.json();
    
    renderCategories();
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsGrid').innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-exclamation-circle"></i>
        <p>Gagal memuat menu. Silakan coba lagi.</p>
      </div>
    `;
  }
}

function renderCategories() {
  const filterContainer = document.getElementById('categoryFilter');
  filterContainer.innerHTML = `
    <button class="filter-btn active" data-category="all">
      <i class="fas fa-th"></i>
      Semua
    </button>
  `;
  
  categories.forEach(cat => {
    filterContainer.innerHTML += `
      <button class="filter-btn" data-category="${cat.id}">
        <i class="fas fa-tag"></i>
        ${cat.name}
      </button>
    `;
  });
  
  // Add event listeners
  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter products
      const categoryId = this.dataset.category;
      if (categoryId === 'all') {
        renderProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => p.category_id == categoryId);
        renderProducts(filtered);
      }
    });
  });
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    grid.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-utensils"></i>
        <p>Belum ada menu tersedia</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = products.map(product => `
    <div class="product-card" onclick="showProductDetail(${product.id})">
      <div class="product-image">
        ${product.display_image 
          ? `<img src="${product.display_image}" alt="${product.name}">`
          : `<div class="image-placeholder"><i class="fas fa-utensils"></i></div>`
        }
        ${product.featured ? '<span class="product-badge">Unggulan</span>' : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category_name || 'Umum'}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description || ''}</p>
        <div class="product-footer">
          <div class="product-price">
            Rp ${product.price.toLocaleString('id-ID')}
          </div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); orderWhatsApp('${product.name}', ${product.price})">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function showProductDetail(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalDesc').textContent = product.description || 'Tidak ada deskripsi';
  document.getElementById('modalCategory').textContent = product.category_name || 'Umum';
  document.getElementById('modalPrice').innerHTML = `Rp ${product.price.toLocaleString('id-ID')} <span>/porsi</span>`;
  
  const modalImage = document.getElementById('modalImage');
  if (product.display_image) {
    modalImage.innerHTML = `<img src="${product.display_image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    modalImage.innerHTML = '<i class="fas fa-utensils"></i>';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function orderWhatsApp(productName, price) {
  const phone = document.getElementById('storePhone')?.textContent.replace(/[^0-9]/g, '') || '';
  const message = `Halo, saya ingin pesan ${productName} seharga Rp ${price.toLocaleString('id-ID')}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Close modal
document.getElementById('modalClose')?.addEventListener('click', function() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
});

document.getElementById('productModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ============================================
// Navbar
// ============================================
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ============================================
// Mobile Menu
// ============================================
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  
  mobileMenuBtn?.addEventListener('click', function() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeMenu?.addEventListener('click', function() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// Social Media Sidebar
// ============================================
function setupSocialSidebar() {
  const sidebar = document.getElementById('socialSidebar');
  const toggle = document.getElementById('socialToggle');
  
  toggle?.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('active');
  });
  
  document.addEventListener('click', function(e) {
    if (!sidebar.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
}

// ============================================
// Scroll Effects
// ============================================
function setupScrollEffects() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  });
}

// ============================================
// Animate Stats
// ============================================
function animateStats() {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.count);
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = isDecimal 
            ? current.toFixed(1) 
            : Math.floor(current) + '+';
        }, 30);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}
