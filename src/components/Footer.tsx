import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer({ settings }: { settings?: any }) {
  const whatsappNumber = settings?.whatsapp || '5511948108764';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const instagramUrl = settings?.instagram || '#';
  const tiktokUrl = settings?.tiktok || '#';

  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-8 object-contain" />
              ) : (
                <div className="w-32 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-bold tracking-[0.5em] text-white/50 text-sm uppercase">
                  LOGO
                </div>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevando o seu estilo para o próximo nível. Qualidade premium e design exclusivo para você.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link href="/#categorias" className="hover:text-primary transition-colors">Categorias</Link></li>
              <li><Link href="/#catalogo" className="hover:text-primary transition-colors">Catálogo Completo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6">Atendimento</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Contato via WhatsApp</a></li>
            </ul>
          </div>


        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            © {new Date().getFullYear()} Loja. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
