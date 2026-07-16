// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
  setupNavigation();
  setupForms();
  setupSidebar();
});

// ============================================
// Dashboard
// ============================================
async function loadDashboard() {
  try {
    const [productsRes, categoriesRes, settingsRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories'),
      fetch('/api/settings')
    ]);
    
    const products = await productsRes.json();
    const categories = await categoriesRes.json();
    const settings = await settingsRes.json();
    
    // Update stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('availableProducts').textContent = products.filter(p => p.available).length;
    document.getElementById('featuredProducts').textContent = products.filter(p => p.featured).length;
    
    // Recent products
    renderRecentProducts(products.slice(0, 5));
    
    // Store global data
    window.allProducts = products;
    window.allCategories = categories;
    
    // Load products table
    renderProductsTable(products);
    
    // Load categories grid
    renderCategoriesGrid(categories);
    
    // Load settings
    loadSettings(settings);
  } catch (error) {
    showToast('Gagal memuat data', 'error');
  }
}

function renderRecentProducts(products) {
  const container = document.getElementById('recentProducts');
  
  if (products.length === 0) {
    container.innerHTML = '<p class="empty-state">Belum ada produk</p>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="recent-item">
      <div class="recent-item-image">
        ${p.display_image 
          ? `<img src="${p.display_image}" alt="${p.name}">`
          : '<i class="fas fa-utensils"></i>'
        }
      </div>
      <div class="recent-item-info">
        <h4>${p.name}</h4>
        <p>${p.category_name || 'Umum'}</p>
      </div>
      <span class="recent-item-price">Rp ${p.price.toLocaleString('id-ID')}</span>
    </div>
  `).join('');
}

// ============================================
// Navigation
// ============================================
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      showSection(section);
    });
  });
}

function showSection(sectionName) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === sectionName) {
      item.classList.add('active');
    }
  });
  
  // Update sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(`section-${sectionName}`).classList.remove('hidden');
  
  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    products: 'Produk',
    categories: 'Kategori',
    settings: 'Pengaturan'
  };
  document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
}

// ============================================
// Sidebar
// ============================================
function setupSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  
  sidebarToggle?.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
  });
  
  mobileSidebarBtn?.addEventListener('click', function() {
    sidebar.classList.toggle('active');
  });
  
  // Close sidebar on outside click (mobile)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !mobileSidebarBtn.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
}

// ============================================
// Products Table
// ============================================
function renderProductsTable(products) {
  const tbody = document.getElementById('productsTable');
  
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Belum ada produk</td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="table-image">
          ${p.display_image 
            ? `<img src="${p.display_image}" alt="${p.name}">`
            : '<i class="fas fa-utensils"></i>'
          }
        </div>
      </td>
      <td>
        <strong>${p.name}</strong>
      </td>
      <td>${p.category_name || '-'}</td>
      <td><strong>Rp ${p.price.toLocaleString('id-ID')}</strong></td>
      <td>
        ${p.featured ? '<span class="status-badge featured"><i class="fas fa-star"></i> Unggulan</span>' : ''}
        ${p.available 
          ? '<span class="status-badge available"><i class="fas fa-check-circle"></i> Tersedia</span>'
          : '<span class="status-badge unavailable"><i class="fas fa-times-circle"></i> Habis</span>'
        }
      </td>
      <td>
        <div class="table-actions">
          <button class="edit-btn" onclick="editProduct(${p.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" onclick="confirmDeleteProduct(${p.id}, '${p.name}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Search products
document.getElementById('searchProducts')?.addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const filtered = window.allProducts.filter(p => 
    p.name.toLowerCase().includes(query) ||
    (p.category_name && p.category_name.toLowerCase().includes(query))
  );
  renderProductsTable(filtered);
});

// ============================================
// Categories Grid
// ============================================
function renderCategoriesGrid(categories) {
  const grid = document.getElementById('categoriesGrid');
  
  if (categories.length === 0) {
    grid.innerHTML = '<p class="empty-state">Belum ada kategori</p>';
    return;
  }
  
  grid.innerHTML = categories.map(c => `
    <div class="category-card">
      <div class="category-card-header">
        <div class="category-icon">
          <i class="fas fa-tag"></i>
        </div>
        <h3>${c.name}</h3>
      </div>
      <p>${c.description || 'Tidak ada deskripsi'}</p>
      <div class="category-card-actions">
        <button class="btn btn-secondary" onclick="editCategory(${c.id})" style="padding: 8px 16px; font-size: 13px;">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger" onclick="confirmDeleteCategory(${c.id}, '${c.name}')" style="padding: 8px 16px; font-size: 13px;">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================
// Product Modal
// ============================================
function openProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  const title = document.getElementById('productModalTitle');
  
  // Populate category select
  const categorySelect = document.getElementById('productCategory');
  categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
  window.allCategories.forEach(c => {
    categorySelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
  
  if (product) {
    title.textContent = 'Edit Produk';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category_id || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productFeatured').checked = product.featured;
    document.getElementById('productAvailable').checked = product.available;
    document.getElementById('productSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Produk';
  } else {
    title.textContent = 'Tambah Produk';
    form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productAvailable').checked = true;
    document.getElementById('productSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Simpan Produk';
  }
  
  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function editProduct(id) {
  const product = window.allProducts.find(p => p.id === id);
  if (product) {
    openProductModal(product);
  }
}

// ============================================
// Category Modal
// ============================================
function openCategoryModal(category = null) {
  const modal = document.getElementById('categoryModal');
  const form = document.getElementById('categoryForm');
  const title = document.getElementById('categoryModalTitle');
  
  if (category) {
    title.textContent = 'Edit Kategori';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description || '';
  } else {
    title.textContent = 'Tambah Kategori';
    form.reset();
    document.getElementById('categoryId').value = '';
  }
  
  modal.classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('active');
}

function editCategory(id) {
  const category = window.allCategories.find(c => c.id === id);
  if (category) {
    openCategoryModal(category);
  }
}

// ============================================
// Delete Confirmation
// ============================================
function confirmDeleteProduct(id, name) {
  const modal = document.getElementById('deleteModal');
  document.getElementById('deleteMessage').textContent = `Apakah Anda yakin ingin menghapus "${name}"?`;
  
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  confirmBtn.onclick = async function() {
    await deleteProduct(id);
    closeDeleteModal();
  };
  
  modal.classList.add('active');
}

function confirmDeleteCategory(id, name) {
  const modal = document.getElementById('deleteModal');
  document.getElementById('deleteMessage').textContent = `Apakah Anda yakin ingin menghapus kategori "${name}"?`;
  
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  confirmBtn.onclick = async function() {
    await deleteCategory(id);
    closeDeleteModal();
  };
  
  modal.classList.add('active');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      showToast('Produk berhasil dihapus', 'success');
      loadDashboard();
    } else {
      showToast(data.message || 'Gagal menghapus produk', 'error');
    }
  } catch (error) {
    showToast('Terjadi kesalahan', 'error');
  }
}

async function deleteCategory(id) {
  try {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      showToast('Kategori berhasil dihapus', 'success');
      loadDashboard();
    } else {
      showToast(data.message || 'Gagal menghapus kategori', 'error');
    }
  } catch (error) {
    showToast('Terjadi kesalahan', 'error');
  }
}

// ============================================
// Forms
// ============================================
function setupForms() {
  // Product Form
  document.getElementById('productForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const formData = new FormData();
    
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('category_id', document.getElementById('productCategory').value);
    formData.append('featured', document.getElementById('productFeatured').checked);
    formData.append('available', document.getElementById('productAvailable').checked);
    
    const imageInput = document.getElementById('productImage');
    if (imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }
    
    try {
      const url = id ? `/api/products/${id}` : '/api/products';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast(id ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan', 'success');
        closeProductModal();
        loadDashboard();
      } else {
        showToast(data.message || 'Gagal menyimpan produk', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  });
  
  // Category Form
  document.getElementById('categoryForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('categoryId').value;
    const data = {
      name: document.getElementById('categoryName').value,
      description: document.getElementById('categoryDescription').value
    };
    
    try {
      const url = id ? `/api/categories/${id}` : '/api/categories';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast(id ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan', 'success');
        closeCategoryModal();
        loadDashboard();
      } else {
        showToast(result.message || 'Gagal menyimpan kategori', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  });
  
  // Settings Form
  document.getElementById('settingsForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const data = {
      store_name: document.getElementById('settingStoreName').value,
      store_address: document.getElementById('settingStoreAddress').value,
      store_phone: document.getElementById('settingStorePhone').value,
      store_hours: document.getElementById('settingStoreHours').value,
      store_description: document.getElementById('settingStoreDescription').value
    };
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Pengaturan berhasil disimpan', 'success');
      } else {
        showToast(result.message || 'Gagal menyimpan pengaturan', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  });
  
  // Social Media Form
  document.getElementById('socialForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const data = {
      facebook: document.getElementById('settingFacebook').value,
      instagram: document.getElementById('settingInstagram').value,
      tiktok: document.getElementById('settingTiktok').value
    };
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Media sosial berhasil disimpan', 'success');
      } else {
        showToast(result.message || 'Gagal menyimpan media sosial', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  });
  
  // Password Form
  document.getElementById('passwordForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
      showToast('Password baru tidak cocok', 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast('Password minimal 6 karakter', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Password berhasil diubah', 'success');
        document.getElementById('passwordForm').reset();
      } else {
        showToast(result.message || 'Gagal mengubah password', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan', 'error');
    }
  });

  // Hero Image Form
  document.getElementById('heroImageForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const file = document.getElementById('heroImageInput').files[0];
    if (!file) { showToast('Pilih gambar terlebih dahulu', 'error'); return; }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('field', 'hero_image');
    try {
      const res = await fetch('/api/settings/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        showToast('Gambar hero berhasil disimpan', 'success');
      } else {
        showToast(data.message || 'Gagal menyimpan', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  });

  // About Image Form
  document.getElementById('aboutImageForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const file = document.getElementById('aboutImageInput').files[0];
    if (!file) { showToast('Pilih gambar terlebih dahulu', 'error'); return; }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('field', 'about_image');
    try {
      const res = await fetch('/api/settings/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        showToast('Gambar toko berhasil disimpan', 'success');
      } else {
        showToast(data.message || 'Gagal menyimpan', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    }
  });

  // Image preview handlers
  document.getElementById('heroImageInput')?.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const box = document.getElementById('heroImagePreview');
        box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('aboutImageInput')?.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const box = document.getElementById('aboutImagePreview');
        box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// ============================================
// Settings
// ============================================
function loadSettings(settings) {
  document.getElementById('settingStoreName').value = settings.store_name || '';
  document.getElementById('settingStoreAddress').value = settings.store_address || '';
  document.getElementById('settingStorePhone').value = settings.store_phone || '';
  document.getElementById('settingStoreHours').value = settings.store_hours || '';
  document.getElementById('settingStoreDescription').value = settings.store_description || '';
  document.getElementById('settingFacebook').value = settings.facebook || '';
  document.getElementById('settingInstagram').value = settings.instagram || '';
  document.getElementById('settingTiktok').value = settings.tiktok || '';
  // Show current image previews
  if (settings.hero_image) {
    document.getElementById('heroImagePreview').innerHTML = `<img src="${settings.hero_image}" style="width:100%;height:100%;object-fit:cover;">`;
  }
  if (settings.about_image) {
    document.getElementById('aboutImagePreview').innerHTML = `<img src="${settings.about_image}" style="width:100%;height:100%;object-fit:cover;">`;
  }
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check',
    error: 'fa-times',
    info: 'fa-info'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${icons[type]}"></i>
    </div>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Make functions global
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.editCategory = editCategory;
window.confirmDeleteProduct = confirmDeleteProduct;
window.confirmDeleteCategory = confirmDeleteCategory;
window.closeDeleteModal = closeDeleteModal;
