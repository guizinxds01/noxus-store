'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  parentId?: string | null;
  order: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    imageUrl: '',
    parentId: null,
    order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
    setLoading(false);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData(category);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        imageUrl: '',
        parentId: null,
        order: categories.length
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        alert('Erro ao fazer upload da imagem');
      }
    } catch (error) {
      alert('Erro de conexão no upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      alert('Aguarde o fim do upload.');
      return;
    }
    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchCategories();
    } else {
      const data = await res.json();
      alert(`Erro ao salvar categoria: ${data.details || data.error}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir? Isso não exclui os produtos.')) return;
    
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCategories();
    } else {
      alert('Erro ao excluir categoria');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Categorias</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-black px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/5 text-gray-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Ordem</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Nenhuma categoria cadastrada</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                        {cat.imageUrl ? <img src={cat.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-500">IMG</span>}
                      </div>
                      {cat.parentId ? <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Subcategoria de: {categories.find(c => c.id === cat.parentId)?.name}</span> : null}
                      {cat.name}
                    </td>
                    <td className="p-4 text-gray-400">{cat.order}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openModal(cat)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white/5 rounded">
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
          <div className="bg-card border border-white/10 w-full max-w-xl rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Nome da Categoria *</label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Pertence a qual Categoria Principal?</label>
                <select 
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value || null})}
                  className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Nenhuma (É uma categoria principal)</option>
                  {categories.filter(c => !c.parentId && c.id !== editingId).map((parentCat) => (
                    <option key={parentCat.id} value={parentCat.id}>{parentCat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Imagem (Bolinha na Home)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-white"
                />
                {uploadingImage && <p className="text-xs text-primary mt-2">Enviando imagem...</p>}
                {formData.imageUrl && !uploadingImage && (
                  <div className="mt-4 w-16 h-16 rounded-full overflow-hidden border border-white/10">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Ordem (Qual aparece primeiro)</label>
                <input 
                  type="number" 
                  value={formData.order || 0}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
