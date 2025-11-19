
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

// --- New Consultant System Types ---

export type ConsultantRole = 'admin' | 'leader' | 'consultant';
export type ConsultantStatus = 'active' | 'inactive';

export interface Consultant {
    id: string; // The login ID (e.g., "18112025")
    name: string;
    photoUrl?: string;
    whatsapp: string;
    email: string;
    city: string;
    state: string;
    role: ConsultantRole;
    parentId?: string; // ID of the leader who recruited this consultant
    status: ConsultantStatus;
    createdAt: string; // ISO Date string
    teamName?: string;
}

export interface ConsultantStats {
    totalConsultants: number;
    activeConsultants: number;
    totalTeams: number;
    newThisMonth: number;
}
