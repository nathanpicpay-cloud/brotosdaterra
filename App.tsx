
import React, { useState, useEffect, useRef } from 'react';
import type { Product, Feature, QuestionAnswer } from './types';
import { PRODUCTS, FEATURES, FAQS, CONSULTANT_DATA } from './constants';
import { BrandLogo, MenuIcon, CloseIcon, WhatsAppIcon, ChevronDownIcon } from './components/Icons';
import { AdminPage } from './Admin';
import { ConsultantApp } from './ConsultantSystem';

// Helper function for smooth scrolling
const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

// NavLink Component
const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <a
    href={`#${href}`}
    onClick={(e) => {
      e.preventDefault();
      scrollToSection(href);
      onClick();
    }}
    className="text-brand-text hover:text-brand-green-dark transition-colors duration-300 py-2"
  >
    {children}
  </a>
);

// Header Component
const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { id: 'inicio', text: 'Início' },
        { id: 'produtos', text: 'Produtos' },
        { id: 'seja-consultora', text: 'Seja Consultora' },
        { id: 'onde-comprar', text: 'Comprar' },
        { id: 'faq', text: 'FAQ' },
        { id: 'contato', text: 'Contato' },
    ];

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-1 flex justify-center md:justify-between items-center relative">
                <div onClick={() => scrollToSection('inicio')} className="cursor-pointer">
                     <BrandLogo />
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <NavLink key={link.id} href={link.id} onClick={closeMenu}>{link.text}</NavLink>
                    ))}
                </nav>
                {/* Position the menu button absolutely on mobile so it doesn't affect the logo centering */}
                <div className="md:hidden absolute right-6 top-1/2 -translate-y-1/2">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col items-center px-6 pb-4 space-y-4">
                        {navLinks.map(link => (
                             <NavLink key={link.id} href={link.id} onClick={closeMenu}>{link.text}</NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};


// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
    <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-serif font-semibold text-brand-green-dark mb-2">{product.name}</h3>
      <p className="text-brand-text text-sm mb-4 flex-grow">{product.description}</p>
      <div className="mb-4">
        {product.tags.map(tag => (
            <span key={tag} className="inline-block bg-brand-green-light text-brand-green-dark text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center">
        <span className="text-2xl font-bold text-brand-green-dark">{product.price}</span>
        <button className="bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
          Comprar
        </button>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    // Assuming feature.icon is a component function or element
    const Icon = feature.icon as React.ElementType;
    return (
        <div className="text-center p-6">
            <div className="flex justify-center mb-4">
                 <Icon />
            </div>
            <h3 className="text-xl font-bold font-serif text-brand-green-dark mb-2">{feature.title}</h3>
            <p className="text-brand-text">{feature.description}</p>
        </div>
    );
};

// FAQ Item Component
const FAQItem: React.FC<{ faq: QuestionAnswer; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-brand-green-dark/20 py-4">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left text-lg font-semibold text-brand-green-dark focus:outline-none"
            aria-expanded={isOpen}
        >
            <span>{faq.question}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
            </span>
        </button>
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
            <p className="text-brand-text pr-6">
                {faq.answer}
            </p>
        </div>
    </div>
);

// Consultant Section Component
const ConsultantSection: React.FC = () => {
    const { title, subtitle, intro, steps, advantages, values, callToAction, footer } = CONSULTANT_DATA;

    return (
        <section id="seja-consultora" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-brand-green-dark mb-6">{title}</h2>
                    <h3 className="text-xl md:text-2xl text-brand-earth font-medium mb-8 italic">{subtitle}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{intro}</p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-12 mb-24 relative">
                     {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-brand-green-dark/30 to-transparent -z-10"></div>
                    
                    {steps.map((item) => (
                        <div key={item.step} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-full bg-white border-4 border-brand-green-dark text-brand-green-dark flex items-center justify-center text-3xl font-bold mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                                {item.step}
                            </div>
                            <p className="text-gray-700 font-medium text-lg leading-snug">{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* Advantages */}
                <div className="mb-24">
                    <h3 className="text-3xl font-bold font-serif text-brand-green-dark mb-12 text-center">Vantagens Exclusivas</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advantages.map((adv, idx) => (
                            <div key={idx} className="bg-brand-green-light p-8 rounded-2xl border border-transparent hover:border-brand-earth/30 hover:shadow-lg transition-all duration-300 group">
                                <h4 className="font-bold text-brand-green-dark text-xl mb-4 flex items-center">
                                    <span className="mr-3 text-brand-earth text-2xl group-hover:scale-125 transition-transform duration-300">✦</span> {adv.title}
                                </h4>
                                <p className="text-brand-text leading-relaxed">{adv.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values & CTA */}
                <div className="bg-brand-green-dark rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                     {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-earth/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-bold mb-8 opacity-90">Nossos Valores</h3>
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {values.map((val, idx) => (
                                <span key={idx} className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-sm md:text-base font-medium hover:bg-white/20 transition-colors">
                                    {val}
                                </span>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl md:text-2xl mb-10 text-brand-green-light font-serif italic">{callToAction.text}</p>
                            <a 
                                href="https://wa.me/5571999190515?text=Ol%C3%A1%2C+tenho+interesse+em+ser+consultora+Brotos+da+Terra."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-brand-earth text-brand-green-dark font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-white hover:scale-105 transition-all duration-300"
                            >
                                {callToAction.buttonLabel}
                            </a>
                            <p className="mt-8 text-sm text-brand-green-light/70">{footer}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


// Floating WhatsApp Button
const WhatsAppButton: React.FC = () => (
    <a 
        href="https://wa.me/5571999190515" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 flex items-center justify-center z-40"
        aria-label="Fale conosco no WhatsApp"
    >
        <WhatsAppIcon />
    </a>
);


// Footer Component
const Footer: React.FC = () => (
    <footer className="bg-brand-green-dark text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                <div>
                    <h3 className="font-serif text-2xl font-bold mb-4">Brotos da Terra</h3>
                    <p className="text-gray-300">Alívio natural para suas dores.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Navegação</h4>
                    <ul>
                        <li className="mb-2"><a href="#produtos" onClick={(e) => { e.preventDefault(); scrollToSection('produtos');}} className="hover:text-brand-earth transition-colors">Produtos</a></li>
                        <li className="mb-2"><a href="#seja-consultora" onClick={(e) => { e.preventDefault(); scrollToSection('seja-consultora');}} className="hover:text-brand-earth transition-colors">Seja Consultora</a></li>
                        <li><a href="#contato" onClick={(e) => { e.preventDefault(); scrollToSection('contato');}} className="hover:text-brand-earth transition-colors">Contato</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Contato</h4>
                    <p className="text-gray-300">contato@brotosdaterra.com.br</p>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-4">Políticas</h4>
                    <ul>
                        <li className="mb-2"><a href="#politicas" onClick={(e) => e.preventDefault()} className="hover:text-brand-earth transition-colors">Política de Privacidade</a></li>
                        <li><a href="#termos" onClick={(e) => e.preventDefault()} className="hover:text-brand-earth transition-colors">Termos de Uso</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-gray-400 mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Brotos da Terra. Todos os direitos reservados.</p>
                <div className="mt-4 md:mt-0 space-x-4 text-sm">
                    <a href="#admin" className="hover:text-brand-earth">Admin Produtos</a>
                    <span className="text-gray-600">|</span>
                    <a href="#painel-consultor" className="hover:text-brand-earth font-semibold text-brand-earth">Painel de Consultores</a>
                </div>
            </div>
        </div>
    </footer>
);

const Site: React.FC = () => {
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const handleFaqClick = (id: number) => {
      setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="bg-gray-50 font-sans text-brand-text">
            <Header />
            
            <main>
                {/* Hero Section */}
                <section id="inicio" className="relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/nature/1920/1080')"}}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 drop-shadow-lg">Alívio que Vem da Natureza</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">Descubra o poder terapêutico das pomadas Brotos da Terra. Soluções naturais para o seu bem-estar.</p>
                    <button onClick={() => scrollToSection('produtos')} className="bg-brand-earth text-brand-green-dark font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                    Conheça os Produtos
                    </button>
                </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Por que Brotos da Terra?</h2>
                            <p className="text-lg text-gray-600 mt-2">Nossa dedicação ao seu bem-estar em cada pote.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {FEATURES.map(feature => (
                                <FeatureCard key={feature.id} feature={feature} />
                            ))}
                        </div>
                    </div>
                </section>


                {/* Products Section */}
                <section id="produtos" className="py-20 bg-brand-green-light">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Nossas Soluções Naturais</h2>
                    <p className="text-lg text-gray-600 mt-2">Encontre o alívio certo para a sua necessidade.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PRODUCTS.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
                </section>

                {/* Consultant Section */}
                <ConsultantSection />

                {/* Where to Buy Section */}
                <section id="onde-comprar" className="py-20 bg-brand-green-light">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Compre Online</h2>
                            <p className="text-lg text-gray-600 mt-2">Receba nossos produtos no conforto da sua casa com segurança e agilidade.</p>
                        </div>
                         <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl text-center">
                            <h3 className="text-2xl font-bold font-serif text-brand-green-dark mb-6">Atendimento Personalizado</h3>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Você pode adquirir a <strong>Pomada de Copaíba</strong> e outros produtos Brotos da Terra diretamente pelo nosso WhatsApp. 
                                Enviamos para todo o Brasil!
                            </p>
                            <a href="https://wa.me/5571999190515" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
                                <WhatsAppIcon />
                                <span className="ml-3">Fazer Pedido pelo WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Perguntas Frequentes</h2>
                            <p className="text-lg text-gray-600 mt-2">Tirando suas dúvidas para uma compra tranquila.</p>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            {FAQS.map(faq => (
                                <FAQItem 
                                    key={faq.id} 
                                    faq={faq} 
                                    isOpen={openFaqId === faq.id}
                                    onClick={() => handleFaqClick(faq.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contato" className="py-20 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/contactbg/1920/1080')"}}>
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl text-center">
                            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark mb-4">Fale Conosco</h2>
                            <p className="text-lg text-gray-700 mb-8">Tem alguma dúvida ou quer fazer um pedido? Nossa equipe está pronta para ajudar!</p>
                            <div className="flex flex-col items-center gap-4">
                                <a href="https://wa.me/5571999190515" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
                                    <WhatsAppIcon />
                                    <span className="ml-3">Chamar no WhatsApp</span>
                                </a>
                                <a href="#painel-consultor" className="w-full md:w-auto inline-flex items-center justify-center bg-brand-green-dark text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                                    Painel de Consultores
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

// Route Types
type Route = 'site' | 'admin' | 'consultant';

export default function App() {
  const [route, setRoute] = useState<Route>('site');

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
          setRoute('admin');
      } else if (hash === '#painel-consultor') {
          setRoute('consultant');
      } else {
          setRoute('site');
      }
    };

    window.addEventListener('hashchange', checkHash);
    checkHash(); // Check on initial load

    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  if (route === 'admin') return <AdminPage />;
  if (route === 'consultant') return <ConsultantApp />;
  return <Site />;
}
