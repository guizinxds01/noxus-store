'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    logoUrl: '',
    primaryColor: '#10B981',
    whatsapp: '',
    whatsappMsg: '',
    instagram: '',
    tiktok: '',
    midBannerUrl: '',
    midBannerTitle: '',
    midBannerLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      setFormData({
        logoUrl: data.logoUrl || '',
        primaryColor: data.primaryColor || '#10B981',
        whatsapp: data.whatsapp || '5511948108764',
        whatsappMsg: data.whatsappMsg || 'Olá, quero comprar o produto: [nome_do_produto]',
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        midBannerUrl: data.midBannerUrl || '',
        midBannerTitle: data.midBannerTitle || '',
        midBannerLink: data.midBannerLink || ''
      });
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, logoUrl: data.imageUrl }));
      } else {
        alert('Erro ao fazer upload da logo');
      }
    } catch (error) {
      alert('Erro de conexão no upload');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleMidBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, midBannerUrl: data.imageUrl }));
      } else {
        alert('Erro ao fazer upload da imagem do banner');
      }
    } catch (error) {
      alert('Erro de conexão no upload');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Configurações salvas com sucesso!');
    } else {
      alert('Erro ao salvar configurações');
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Carregando...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Configurações da Loja</h2>
        <button 
          onClick={handleSubmit}
          className="bg-primary text-black px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Save className="w-4 h-4" /> Salvar Alterações
        </button>
      </div>

      <div className="space-y-8">
        {/* Identidade Visual */}
        <section className="bg-card border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">Identidade Visual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Logo da Loja</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-white"
              />
              {uploadingLogo && <p className="text-xs text-primary mt-2">Enviando logo...</p>}
              {formData.logoUrl && !uploadingLogo && (
                <div className="mt-4 p-4 bg-black rounded border border-white/5 inline-block">
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Cor Principal (Em breve)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  className="w-14 h-14 rounded cursor-not-allowed opacity-50 bg-transparent border-0 p-0"
                  disabled
                />
                <span className="text-sm text-gray-400">A cor afetará botões e detalhes.</span>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp & Redes */}
        <section className="bg-card border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">WhatsApp & Redes Sociais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Número do WhatsApp (Apenas Números)</label>
              <input 
                type="text" 
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="5511999999999"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Mensagem Automática</label>
              <textarea 
                value={formData.whatsappMsg}
                onChange={(e) => setFormData({...formData, whatsappMsg: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                placeholder="Ex: Olá, quero comprar o produto: [nome_do_produto]"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">Use [nome_do_produto] para inserir o nome automaticamente.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Link do Instagram (Opcional)</label>
              <input 
                type="url" 
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Link do TikTok (Opcional)</label>
              <input 
                type="url" 
                value={formData.tiktok}
                onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
        </section>

        {/* Banner Central (Promoções) */}
        <section className="bg-card border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">Banner Central (Promoções)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Imagem de Fundo (Proporção 16:9 ou 21:9)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleMidBannerUpload}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-black hover:file:bg-white"
              />
              {formData.midBannerUrl && (
                <div className="mt-4 p-2 bg-black rounded border border-white/5 inline-block">
                  <img src={formData.midBannerUrl} alt="Mid Banner Preview" className="h-20 object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Título do Banner</label>
                <input 
                  type="text" 
                  value={formData.midBannerTitle}
                  onChange={(e) => setFormData({...formData, midBannerTitle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: PROMOÇÕES IMPERDÍVEIS"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Link do Botão "Aproveitar"</label>
                <input 
                  type="text" 
                  value={formData.midBannerLink}
                  onChange={(e) => setFormData({...formData, midBannerLink: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: /?categoria=Promoções#catalogo"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
