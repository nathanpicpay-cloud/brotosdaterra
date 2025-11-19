// FIX: Import React to provide the React namespace for React.ReactNode.
import type * as React from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  category: string;
  tags: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  imageUrl: string;
}

export interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface QuestionAnswer {
    id: number;
    question: string;
    answer: string;
}

export interface ConsultantStep {
    step: number;
    text: string;
}

export interface ConsultantAdvantage {
    title: string;
    description: string;
}

export interface ConsultantSectionData {
    title: string;
    subtitle: string;
    intro: string;
    steps: ConsultantStep[];
    advantages: ConsultantAdvantage[];
    values: string[];
    callToAction: {
        text: string;
        buttonLabel: string;
    };
    footer: string;
}
