
// FIX: Import React to provide the React namespace for React.ReactNode.
import type * as React from 'react';

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
