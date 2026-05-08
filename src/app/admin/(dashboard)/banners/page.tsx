'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X, Eye, EyeOff, Crop as CropIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface Banner {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  active: boolean;
  order: number;
  fit: string;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1920 / 800);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<Banner>>({
    imageUrl: '',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    active: true,
    order: 0,
    fit: 'cover'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await fetch('/api/admin/banners');
    if (res.ok) {
      const data = await res.json();
      setBanners(data);
    }
    setLoading(false);
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData(banner);
    } else {
      setEditingId(null);
      setFormData({
        imageUrl: '',
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        active: true,
        order: banners.length,
        fit: 'cover'
      });
    }
    setIsModalOpen(true);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageToCrop(imageDataUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const uploadCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    
    setUploadingImage(true);
    try {
      const croppedImageFile = await getCroppedImg(imageToCrop, croppedAreaPixels, 0);
      if (!croppedImageFile) throw new Error('Falha ao cortar imagem');

      const form = new FormData();
      form.append('file', croppedImageFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        setImageToCrop(null); // Fecha o cropper
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
    const url = editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchBanners();
    } else {
      alert('Erro ao salvar banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBanners();
  };

  const toggleActive = async (banner: Banner) => {
    const res = await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...banner, active: !banner.active })
    });
    if (res.ok) fetchBanners();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Gerenciar Banners</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-black px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Banner
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/5 text-gray-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Banner</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ordem</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum banner cadastrado</td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!banner.active ? 'opacity-50' : ''}`}>
                    <td className="p-4 font-medium text-white flex items-center gap-4">
                      <div className="w-32 h-12 bg-white/5 rounded overflow-hidden flex items-center justify-center">
                         {banner.imageUrl ? <img src={banner.imageUrl} className={`w-full h-full ${banner.fit === 'contain' ? 'object-contain' : 'object-cover'}`} /> : <span className="text-[10px] text-gray-500">IMG</span>}
                      </div>
                      <div>
                        <div className="font-bold">{banner.title || 'Sem título'}</div>
                        <div className="text-xs text-gray-400">{banner.subtitle}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${banner.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {banner.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{banner.order}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => toggleActive(banner)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded" title="Ativar/Desativar">
                        {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openModal(banner)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white/5 rounded">
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
          <div className="bg-card border border-white/10 w-full max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto relative">
            
            {imageToCrop && (
              <div className="absolute inset-0 z-50 bg-card rounded-xl flex flex-col p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CropIcon className="w-5 h-5" /> Encaixar Banner
                  </h3>
                  <button onClick={() => setImageToCrop(null)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setAspectRatio(1920/800)}
                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${aspectRatio === 1920/800 ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}
                  >
                    Formato PC (Deitado)
                  </button>
                  <button 
                    onClick={() => setAspectRatio(1)}
                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${aspectRatio === 1 ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}
                  >
                    Formato Quadrado (1:1)
                  </button>
                </div>

                <div className="relative flex-1 w-full bg-black rounded-xl overflow-hidden border border-white/10 min-h-[400px]">
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Zoom:</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => {
                      setZoom(Number(e.target.value))
                    }}
                    className="flex-1 accent-primary"
                  />
                  <button
                    onClick={uploadCroppedImage}
                    disabled={uploadingImage}
                    className="bg-primary text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                  >
                    {uploadingImage ? 'Cortando...' : 'Confirmar e Salvar Foto'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-card z-10">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                {editingId ? 'Editar Banner' : 'Novo Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Imagem do Banner</label>
                <div className="flex flex-col gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={onFileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-white"
                  />
                  {formData.imageUrl && !uploadingImage && (
                    <div className="w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative">
                      <img src={formData.imageUrl} alt="Preview" className={`w-full h-full ${formData.fit === 'contain' ? 'object-contain' : 'object-cover'} opacity-80`} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Título Principal (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Subtítulo (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Texto do Botão (Ex: Comprar)</label>
                  <input 
                    type="text" 
                    value={formData.buttonText || ''}
                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Link do Botão (Ex: /?categoria=Moletons)</label>
                  <input 
                    type="text" 
                    value={formData.buttonLink || ''}
                    onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/5 p-4 rounded-lg border border-white/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-5 h-5 accent-primary bg-white/5 border-white/10 rounded"
                  />
                  <span className="text-sm font-medium text-white uppercase tracking-wider">Banner Ativo</span>
                </label>

                <div className="flex-1 flex justify-end items-center gap-6">
                   <div className="flex items-center gap-3">
                     <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Como exibir?</label>
                     <select 
                       value={formData.fit || 'cover'}
                       onChange={(e) => setFormData({...formData, fit: e.target.value})}
                       className="bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                     >
                       <option value="cover">Preencher Toda Tela (Cortar Bordas)</option>
                       <option value="contain">Encaixar Imagem (Criar Bordas)</option>
                     </select>
                   </div>

                   <div className="flex items-center gap-3">
                     <label className="text-sm font-medium text-white uppercase tracking-wider">Ordem</label>
                     <input 
                      type="number" 
                      value={formData.order || 0}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-20 bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                   </div>
                </div>
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
