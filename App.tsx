
import React, { useState, useEffect, useRef } from 'react';
import type { Product, Testimonial, Feature, QuestionAnswer } from './types';
import { PRODUCTS, TESTIMONIALS, FEATURES, FAQS } from './constants';
import { BrandLogo, MenuIcon, CloseIcon, WhatsAppIcon, ChevronDownIcon } from './components/Icons';

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
        { id: 'sobre', text: 'Sobre Nós' },
        { id: 'depoimentos', text: 'Depoimentos' },
        { id: 'onde-comprar', text: 'Onde Comprar' },
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

// Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-brand-green-light p-8 rounded-xl shadow-md flex flex-col items-center text-center">
        <img src={testimonial.imageUrl} alt={testimonial.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-white shadow-lg"/>
        <p className="text-brand-text italic mb-4">"{testimonial.quote}"</p>
        <div className="font-semibold text-brand-green-dark">
            <span className="font-bold">{testimonial.name}</span>
            <span className="text-sm font-normal">, {testimonial.location}</span>
        </div>
    </div>
);

// Feature Card Component
const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
    <div className="text-center p-6">
        <div className="flex justify-center mb-4">{feature.icon}</div>
        <h3 className="text-xl font-bold font-serif text-brand-green-dark mb-2">{feature.title}</h3>
        <p className="text-brand-text">{feature.description}</p>
    </div>
);

// FAQ Item Component
const FAQItem: React.FC<{ faq: QuestionAnswer; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-gray-200 py-4">
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
                        <li className="mb-2"><a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToSection('sobre');}} className="hover:text-brand-earth transition-colors">Sobre Nós</a></li>
                        <li><a href="#contato" onClick={(e) => { e.preventDefault(); scrollToSection('contato');}} className="hover:text-brand-earth transition-colors">Contato</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Contato</h4>
                    <p className="text-gray-300 mb-2">Loja Parceira em Santa Inês – Maranhão</p>
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
            <div className="text-center text-gray-400 mt-12 border-t border-gray-700 pt-6">
                <p>&copy; {new Date().getFullYear()} Brotos da Terra. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
);

export default function App() {
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

        {/* About Section */}
        <section id="sobre" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://picsum.photos/seed/founder/600/700" alt="Júnior, diretor da Brotos da Terra" className="rounded-lg shadow-xl w-full h-auto object-cover"/>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark mb-4">Nossa Raiz, Nossa História</h2>
                        <p className="mb-4 text-lg">"Eu sou o Júnior, diretor da Brotos da Terra. Nossa jornada começou com um propósito simples: levar alívio e bem-estar através do poder da natureza. É gratificante saber que estamos no caminho certo, com um produto de qualidade que vem satisfazendo as necessidades de quem confia em nosso trabalho."</p>
                        <p className="text-gray-600">Com raízes no Maranhão e o coração no cuidado com as pessoas, a Brotos da Terra é mais que uma empresa: é uma missão de vida. Cada pomada é um reflexo do nosso compromisso com a eficácia, a segurança e a confiança que só os ingredientes naturais podem oferecer.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="py-20 bg-brand-green-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Quem Usa, Confia</h2>
                    <p className="text-lg text-gray-600 mt-2">Histórias reais de alívio e bem-estar.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                     {TESTIMONIALS.map(testimonial => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
                </div>
            </div>
        </section>

        {/* Where to Buy Section */}
        <section id="onde-comprar" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-green-dark">Onde Comprar</h2>
                    <p className="text-lg text-gray-600 mt-2">Encontre nossos produtos perto de você ou compre online.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="bg-brand-green-light p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold font-serif text-brand-green-dark mb-4">Loja Parceira</h3>
                        <p className="text-lg font-semibold text-brand-text mb-2">Santa Inês – Maranhão</p>
                        <p className="text-gray-600 mb-6">Visite nosso parceiro para encontrar toda a nossa linha de pomadas terapêuticas.</p>
                        <h3 className="text-2xl font-bold font-serif text-brand-green-dark mb-4">Compre Online</h3>
                        <p className="text-gray-600 mb-6">Prefere a comodidade de receber em casa? Peça pelo nosso WhatsApp com entrega para todo o Brasil.</p>
                        <a href="https://wa.me/5571999190515" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-md hover:bg-green-600 transition-all transform hover:scale-105">
                            <WhatsAppIcon />
                            <span className="ml-3">Comprar pelo WhatsApp</span>
                        </a>
                    </div>
                    <div className="rounded-lg shadow-xl overflow-hidden h-96">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127569.5701833544!2d-45.46194723145408!3d-3.667233299719321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92d0a256a2386345%3A0xf631952e4f215562!2sSanta%20In%C3%AAs%2C%20MA!5e0!3m2!1spt-BR!2sbr!4v1716309831962!5m2!1spt-BR!2sbr"
                            width="100%" 
                            height="100%" 
                            style={{ border:0 }} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização da loja parceira em Santa Inês, Maranhão"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-brand-green-light">
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
                    <a href="https://wa.me/5571999190515" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-all transform hover:scale-105">
                        <WhatsAppIcon />
                        <span className="ml-3">Chamar no WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
      </main>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}