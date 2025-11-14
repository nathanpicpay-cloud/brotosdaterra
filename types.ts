// FIX: Import React to provide the React namespace for React.ReactNode.
import type * as React from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
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
