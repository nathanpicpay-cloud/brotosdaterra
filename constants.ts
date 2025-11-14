
import type { Product, Testimonial, Feature, QuestionAnswer } from './types';
import { LeafIcon, ShieldCheckIcon, SparklesIcon } from './components/Icons';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pomada Alívio Intenso",
    description: "Ideal para dores crônicas como artrite, artrose e reumatismo. Uma fórmula concentrada para um alívio profundo e duradouro.",
    imageUrl: "https://picsum.photos/seed/ointment1/400/400",
    price: "R$ 49,90",
    tags: ["Artrite", "Artrose", "Reumatismo"]
  },
  {
    id: 2,
    name: "Pomada Relaxante Muscular",
    description: "Perfeita para aliviar tensões e dores musculares após atividades físicas ou um dia cansativo. Promove relaxamento e bem-estar.",
    imageUrl: "https://picsum.photos/seed/ointment2/400/400",
    price: "R$ 44,90",
    tags: ["Dor Muscular", "Tensão"]
  },
  {
    id: 3,
    name: "Pomada Cuidado Localizado",
    description: "Alívio rápido e eficaz para dores de cabeça, dente ou ouvido. Uma solução natural para desconfortos pontuais do dia a dia.",
    imageUrl: "https://picsum.photos/seed/ointment3/400/400",
    price: "R$ 39,90",
    tags: ["Dor de Cabeça", "Dente", "Ouvido"]
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Maria S.",
    location: "Santa Inês, MA",
    quote: "Sofria com dores de artrite há anos. A pomada Alívio Intenso da Brotos da Terra foi a única solução natural que realmente funcionou. Sou muito grata!",
    imageUrl: "https://picsum.photos/seed/person1/100/100",
  },
  {
    id: 2,
    name: "João P.",
    location: "Cliente Online",
    quote: "Uso a pomada muscular depois dos meus treinos e a recuperação é outra. É gratificante usar um produto de qualidade que a gente sente que funciona de verdade.",
    imageUrl: "https://picsum.photos/seed/person2/100/100",
  },
  {
    id: 3,
    name: "Ana C.",
    location: "Cliente Online",
    quote: "Tinha minhas dúvidas, mas a pomada para dor de cabeça é incrível. Aplico nas têmporas e sinto o alívio chegar. Recomendo a todos!",
    imageUrl: "https://picsum.photos/seed/person3/100/100",
  }
];

export const FEATURES: Feature[] = [
    {
        id: 1,
        icon: LeafIcon,
        title: "Ingredientes Naturais",
        description: "Nossas fórmulas são cuidadosamente desenvolvidas com extratos de plantas e ingredientes da natureza, garantindo um cuidado puro e eficaz."
    },
    {
        id: 2,
        icon: ShieldCheckIcon,
        title: "Qualidade Comprovada",
        description: "Cada lote é produzido com os mais altos padrões de qualidade, assegurando um produto seguro e confiável para seu bem-estar."
    },
    {
        id: 3,
        icon: SparklesIcon,
        title: "Alívio Terapêutico",
        description: "Mais que um produto, uma solução terapêutica que atua na causa da dor, proporcionando conforto e melhorando sua qualidade de vida."
    }
];

export const FAQS: QuestionAnswer[] = [
    {
        id: 1,
        question: "As pomadas são 100% naturais?",
        answer: "Sim, nossas pomadas são feitas com uma base de ingredientes naturais e extratos de plantas selecionados por suas propriedades terapêuticas. Evitamos o uso de químicos agressivos para garantir um produto seguro e eficaz."
    },
    {
        id: 2,
        question: "Como devo aplicar a pomada para melhores resultados?",
        answer: "Recomendamos aplicar uma pequena quantidade da pomada na área afetada, massageando suavemente em movimentos circulares até a completa absorção. Repita a aplicação 2 a 3 vezes ao dia ou conforme a necessidade."
    },
    {
        id: 3,
        question: "Qual o prazo de entrega para compras online?",
        answer: "O prazo de entrega varia conforme a sua localização. Para Santa Inês - MA, a entrega é mais rápida. Para outras regiões do Brasil, o prazo será calculado no momento da compra, mas geralmente varia de 5 a 15 dias úteis."
    },
    {
        id: 4,
        question: "Posso usar as pomadas se tiver pele sensível?",
        answer: "Nossos produtos são formulados para serem suaves, mas recomendamos sempre fazer um teste de toque em uma pequena área da pele (como o antebraço) antes do uso completo, especialmente se você tem histórico de sensibilidade."
    }
];
