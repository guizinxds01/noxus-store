'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Copy, Eye, EyeOff, Star, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  promoPrice?: number;
  category: string;
  subcategory?: string | null;
  sizes: string;
  colors?: string;
  sku?: string;
  description: string;
  imageUrl: string;
  images?: string | null;
  videoUrl?: string | null;
  featured: boolean;
  active: boolean;
  badge?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string, parentId?: string | null}[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    promoPrice: 0,
    category: 'Moletons',
    subcategory: '',
    sizes: 'P, M, G, GG',
    colors: '',
    sku: '',
    description: '',
    imageUrl: '',
    images: '',
    videoUrl: '',
    featured: false,
    active: true,
    badge: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  const openModal = (product?: Product, duplicate = false) => {
    if (product) {
      setEditingId(duplicate ? null : product.id);
      setFormData({
        name: duplicate ? `${product.name} (Cópia)` : product.name,
        price: product.price,
        promoPrice: product.promoPrice || 0,
        category: product.category,
        subcategory: product.subcategory || '',
        sizes: product.sizes,
        colors: product.colors || '',
        sku: product.sku || '',
        description: product.description,
        imageUrl: product.imageUrl || '',
        images: product.images || '',
        videoUrl: product.videoUrl || '',
        featured: product.featured || false,
        active: product.active || false,
        badge: product.badge || ''
      });
      try {
        setGalleryUrls(product.images ? JSON.parse(product.images) : []);
      } catch (e) {
        setGalleryUrls([]);
      }
    } else {
      setEditingId(null);
      setGalleryUrls([]);
      setFormData({
        name: '',
        price: 0,
        promoPrice: 0,
        category: 'Moletons',
        subcategory: '',
        sizes: 'P, M, G, GG',
        colors: '',
        sku: '',
        description: '',
        imageUrl: '',
        images: '',
        videoUrl: '',
        featured: false,
        active: true,
        badge: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery' | 'video' = 'main') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video') setUploadingVideo(true);
    else setUploadingImage(true);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        if (type === 'main') {
          setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        } else if (type === 'video') {
          setFormData(prev => ({ ...prev, videoUrl: data.imageUrl }));
        } else {
          const newGallery = [...galleryUrls, data.imageUrl];
          setGalleryUrls(newGallery);
          setFormData(prev => ({ ...prev, images: JSON.stringify(newGallery) }));
        }
      } else {
        alert(`Erro ao fazer upload: ${res.statusText}`);
      }
    } catch (error) {
      alert('Erro de conexão no upload');
    } finally {
      setUploadingImage(false);
      setUploadingVideo(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryUrls.filter((_, i) => i !== index);
    setGalleryUrls(newGallery);
    setFormData(prev => ({ ...prev, images: JSON.stringify(newGallery) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage || uploadingVideo) {
      alert('Aguarde o fim do upload da mídia.');
      return;
    }
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchProducts();
    } else {
      const data = await res.json();
      alert(`Erro ao salvar produto: ${data.error || 'Verifique os campos'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProducts();
    } else {
      alert('Erro ao excluir produto');
    }
  };

  const toggleActive = async (product: Product) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, active: !product.active })
    });
    if (res.ok) fetchProducts();
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Gerenciar Produtos</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-primary text-black px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/5 text-gray-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum produto encontrado</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!product.active ? 'opacity-50' : ''}`}>
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      {product.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      {product.name}
                    </td>
                    <td className="p-4 text-gray-400">{product.category}</td>
                    <td className="p-4 text-primary">R$ {product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${product.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => toggleActive(product)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded" title="Ativar/Desativar">
                        {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openModal(product, true)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded" title="Duplicar">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white/5 rounded" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 w-full max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-card z-10">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Nome do Produto *</label>
                  <input 
                    type="text" 
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Categoria *</label>
                  <select 
                    value={formData.category || ''}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      let newSizes = formData.sizes;
                      if (newCategory.toLowerCase().includes('tênis') || newCategory.toLowerCase().includes('tenis')) {
                        if (newSizes === 'P, M, G, GG') newSizes = '38, 39, 40, 41, 42';
                      } else {
                        if (newSizes === '38, 39, 40, 41, 42' || newSizes === '37, 38, 39, 40, 41, 42') newSizes = 'P, M, G, GG';
                      }
                      setFormData({...formData, category: newCategory, sizes: newSizes});
                    }}
                    className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Selecione uma categoria principal...</option>
                    {categories.filter(c => !c.parentId).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Subcategoria (Opcional)</label>
                  <select 
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    disabled={!formData.category}
                  >
                    <option value="">Nenhuma subcategoria</option>
                    {categories
                      .filter(c => c.parentId && categories.find(parent => parent.id === c.parentId && parent.name === formData.category))
                      .map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Preço (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Preço Promocional (Opcional)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.promoPrice || ''}
                    onChange={(e) => setFormData({...formData, promoPrice: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tamanhos Disponíveis</label>
                  <input 
                    type="text" 
                    value={formData.sizes || ''}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Cores (separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={formData.colors || ''}
                    onChange={(e) => setFormData({...formData, colors: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Preto, Branco, Vermelho"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">SKU (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Badge Personalizada</label>
                  <select 
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Nenhuma</option>
                    <option value="NOVO">NOVO</option>
                    <option value="PROMOÇÃO">PROMOÇÃO</option>
                    <option value="MAIS VENDIDO">MAIS VENDIDO</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/5 p-4 rounded-lg border border-white/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 accent-primary bg-white/5 border-white/10 rounded"
                  />
                  <span className="text-sm font-medium text-white uppercase tracking-wider">Produto em Destaque</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-5 h-5 accent-primary bg-white/5 border-white/10 rounded"
                  />
                  <span className="text-sm font-medium text-white uppercase tracking-wider">Produto Ativo na Loja</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Imagem Principal</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      disabled={uploadingImage}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-green-400"
                    />
                    {formData.imageUrl && !uploadingImage && (
                      <img src={formData.imageUrl} alt="Preview" className="h-24 w-24 mt-4 object-cover rounded border border-white/10" />
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Vídeo do Produto (Opcional - MP4)</label>
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm"
                      onChange={(e) => handleImageUpload(e, 'video')}
                      disabled={uploadingVideo}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-green-400"
                    />
                    {uploadingVideo && <p className="text-xs text-primary mt-2">Enviando vídeo...</p>}
                    {formData.videoUrl && !uploadingVideo && (
                      <video src={formData.videoUrl} className="h-24 mt-4 rounded border border-white/10" controls muted />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Galeria de Fotos Extras (Máx 4)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    disabled={uploadingImage || galleryUrls.length >= 4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-green-400"
                  />
                  {uploadingImage && <p className="text-xs text-primary mt-2">Enviando imagem...</p>}
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    {galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={url} alt={`Gallery ${idx}`} className="h-24 w-24 object-cover rounded border border-white/10" />
                        <button 
                          type="button" 
                          onClick={() => removeGalleryImage(idx)} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
                <textarea 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-lg text-gray-400 font-bold uppercase tracking-wider text-sm hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
