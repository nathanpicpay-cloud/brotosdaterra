
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import type { Consultant, ConsultantRole, ConsultantStatus, ConsultantStats } from './types';
import { 
  BrandLogo, UsersIcon, ChartBarIcon, UserCircleIcon, LogoutIcon, 
  SearchIcon, PlusIcon, PencilIcon, TrashIcon, WhatsAppIcon, LocationIcon, CloseIcon,
  SparklesIcon, ShieldCheckIcon
} from './components/Icons';

// --- 1. Mock Backend / Data Service ---

const STORAGE_KEY = 'brotos_consultants';
const INITIAL_ADMIN_ID = '18112025';

const initialAdmin: Consultant = {
  id: INITIAL_ADMIN_ID,
  name: 'Administrador Geral',
  role: 'admin',
  whatsapp: '71999999999',
  email: 'admin@brotosdaterra.com.br',
  city: 'Santa Inês',
  state: 'MA',
  status: 'active',
  createdAt: new Date().toISOString(),
  teamName: 'Diretoria'
};

// Helper to generate ID
const generateID = (consultants: Consultant[]): string => {
    let newId = '';
    do {
        newId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (consultants.some(c => c.id === newId) || newId === INITIAL_ADMIN_ID);
    return newId;
};

// Service to handle data
const ConsultantService = {
    getAll: (): Consultant[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([initialAdmin]));
            return [initialAdmin];
        }
        return JSON.parse(stored);
    },

    save: (consultant: Consultant) => {
        const consultants = ConsultantService.getAll();
        const index = consultants.findIndex(c => c.id === consultant.id);
        if (index >= 0) {
            consultants[index] = consultant;
        } else {
            consultants.push(consultant);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consultants));
        return consultant;
    },

    delete: (id: string) => {
        let consultants = ConsultantService.getAll();
        consultants = consultants.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consultants));
    },

    login: (id: string): Consultant | null => {
        const consultants = ConsultantService.getAll();
        return consultants.find(c => c.id === id && c.status === 'active') || null;
    },

    getStats: (): ConsultantStats => {
        const consultants = ConsultantService.getAll();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return {
            totalConsultants: consultants.length,
            activeConsultants: consultants.filter(c => c.status === 'active').length,
            totalTeams: new Set(consultants.map(c => c.teamName).filter(Boolean)).size,
            newThisMonth: consultants.filter(c => new Date(c.createdAt) >= startOfMonth).length
        };
    }
};

// --- 2. Context ---

interface ConsultantContextType {
    user: Consultant | null;
    consultants: Consultant[];
    stats: ConsultantStats;
    login: (id: string) => Promise<boolean>;
    logout: () => void;
    addConsultant: (data: Partial<Consultant>) => Promise<Consultant>;
    updateConsultant: (id: string, data: Partial<Consultant>) => Promise<void>;
    deleteConsultant: (id: string) => Promise<void>;
    refreshData: () => void;
}

const ConsultantContext = createContext<ConsultantContextType | undefined>(undefined);

export const ConsultantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [stats, setStats] = useState<ConsultantStats>({ totalConsultants: 0, activeConsultants: 0, totalTeams: 0, newThisMonth: 0 });

    const refreshData = () => {
        const all = ConsultantService.getAll();
        setConsultants(all);
        setStats(ConsultantService.getStats());
    };

    useEffect(() => {
        refreshData();
        // Check for session (simple persistence)
        const sessionUser = localStorage.getItem('brotos_session_user');
        if (sessionUser) {
            const userData = JSON.parse(sessionUser);
            // Re-verify validity
            const validUser = ConsultantService.login(userData.id);
            if (validUser) setUser(validUser);
        }
    }, []);

    const login = async (id: string) => {
        const found = ConsultantService.login(id);
        if (found) {
            setUser(found);
            localStorage.setItem('brotos_session_user', JSON.stringify(found));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('brotos_session_user');
    };

    const addConsultant = async (data: Partial<Consultant>) => {
        const all = ConsultantService.getAll();
        const newConsultant: Consultant = {
            ...data,
            id: generateID(all),
            createdAt: new Date().toISOString(),
            status: 'active',
        } as Consultant;
        
        ConsultantService.save(newConsultant);
        refreshData();
        return newConsultant;
    };

    const updateConsultant = async (id: string, data: Partial<Consultant>) => {
        const current = consultants.find(c => c.id === id);
        if (current) {
            const updated = { ...current, ...data };
            ConsultantService.save(updated);
            refreshData();
            // Update session if self-update
            if (user?.id === id) {
                setUser(updated);
                localStorage.setItem('brotos_session_user', JSON.stringify(updated));
            }
        }
    };

    const deleteConsultant = async (id: string) => {
        ConsultantService.delete(id);
        refreshData();
    };

    return (
        <ConsultantContext.Provider value={{ user, consultants, stats, login, logout, addConsultant, updateConsultant, deleteConsultant, refreshData }}>
            {children}
        </ConsultantContext.Provider>
    );
};

const useConsultant = () => {
    const context = useContext(ConsultantContext);
    if (!context) throw new Error('useConsultant must be used within a ConsultantProvider');
    return context;
};

// --- 3. Components ---

// Login Component
const LoginScreen: React.FC = () => {
    const { login } = useConsultant();
    const [id, setId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(id.trim());
        if (!success) {
            setError('ID inválido ou usuário inativo. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-green-light flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <BrandLogo />
                </div>
                <h2 className="text-2xl font-bold font-serif text-brand-green-dark mb-2">Painel de Consultores</h2>
                <p className="text-gray-600 mb-8">Acesse sua conta utilizando seu ID exclusivo.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-left text-sm font-semibold text-brand-text mb-2">ID de Acesso</label>
                        <input 
                            type="text" 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Ex: 592810"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition-all text-lg tracking-widest text-center"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    <button 
                        type="submit"
                        className="w-full bg-brand-green-dark text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>
                <p className="mt-6 text-xs text-gray-400">Dúvidas? Entre em contato com o suporte.</p>
            </div>
        </div>
    );
};

// Add/Edit Modal
const ConsultantModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    initialData?: Consultant | null; 
    isChildAddition?: boolean; // If true, automatically sets parentId
}> = ({ isOpen, onClose, initialData, isChildAddition }) => {
    const { addConsultant, updateConsultant, user } = useConsultant();
    const [formData, setFormData] = useState<Partial<Consultant>>({
        name: '',
        email: '',
        whatsapp: '',
        city: '',
        state: '',
        role: 'consultant',
        status: 'active',
        teamName: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                email: '',
                whatsapp: '',
                city: '',
                state: '',
                role: 'consultant',
                status: 'active',
                teamName: isChildAddition && user ? `Equipe de ${user.name}` : '',
                parentId: isChildAddition && user ? user.id : undefined
            });
        }
    }, [initialData, isOpen, isChildAddition, user]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData && initialData.id) {
            await updateConsultant(initialData.id, formData);
        } else {
            await addConsultant(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="bg-brand-green-dark p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">{initialData ? 'Editar Consultor' : 'Novo Consultor'}</h3>
                    <button onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <form id="consultant-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input required type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                        </div>
                        
                        {/* Only Admin or Leader can see these settings usually, simplified here */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                            <select className="w-full border p-2 rounded bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                                <option value="consultant">Consultor</option>
                                <option value="leader">Líder</option>
                                {user?.role === 'admin' && <option value="admin">Administrador</option>}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select className="w-full border p-2 rounded bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Equipe (Opcional)</label>
                            <input type="text" className="w-full border p-2 rounded" value={formData.teamName || ''} onChange={e => setFormData({...formData, teamName: e.target.value})} />
                        </div>
                    </form>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancelar</button>
                    <button type="submit" form="consultant-form" className="px-6 py-2 bg-brand-green-dark text-white rounded font-medium hover:bg-opacity-90">Salvar</button>
                </div>
            </div>
        </div>
    );
};

// Dashboard Tabs
const DashboardHome: React.FC = () => {
    const { user, stats } = useConsultant();
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Olá, {user?.name}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Consultores</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><UsersIcon /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalConsultants}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Ativos</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><SparklesIcon /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeConsultants}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Equipes</h3>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheckIcon /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalTeams}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Novos (Mês)</h3>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ChartBarIcon /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.newThisMonth}</p>
                </div>
            </div>

            {/* Quick Action Area */}
             <div className="bg-gradient-to-r from-brand-green-dark to-brand-green-dark/80 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2">Seu ID de Acesso: <span className="bg-white/20 px-2 py-1 rounded font-mono tracking-wider">{user?.id}</span></h3>
                     <p className="mb-6 opacity-90 max-w-lg">Compartilhe este sistema apenas com consultores autorizados. Mantenha seus dados sempre atualizados para receber novidades e materiais.</p>
                 </div>
             </div>
        </div>
    );
};

const ConsultantsList: React.FC<{ filterParentId?: string; title: string; allowAdd?: boolean }> = ({ filterParentId, title, allowAdd = true }) => {
    const { consultants, deleteConsultant, user } = useConsultant();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingC, setEditingC] = useState<Consultant | null>(null);

    const filtered = consultants.filter(c => {
        // If filterParentId is set, only show children. If not, assume Admin view (show all).
        if (filterParentId && c.parentId !== filterParentId) return false;
        
        const search = searchTerm.toLowerCase();
        return c.name.toLowerCase().includes(search) || 
               c.city.toLowerCase().includes(search) || 
               c.email.toLowerCase().includes(search);
    });

    const handleEdit = (c: Consultant) => {
        setEditingC(c);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingC(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Tem certeza que deseja desativar/excluir este consultor?')) {
            deleteConsultant(id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <SearchIcon />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome, cidade..." 
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-dark/50 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"></div>
                    </div>
                    {allowAdd && (
                        <button onClick={handleAdd} className="flex items-center gap-2 bg-brand-green-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                            <PlusIcon /> <span className="hidden md:inline">Adicionar</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                        <tr>
                            <th className="p-4">Consultor</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4">Localização</th>
                            <th className="p-4">Cargo/Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum consultor encontrado.</td></tr>
                        ) : (
                            filtered.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-earth/20 flex items-center justify-center text-brand-earth font-bold">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{c.name}</p>
                                                <p className="text-xs text-gray-500">ID: {c.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <a href={`https://wa.me/55${c.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
                                                <WhatsAppIcon /> {c.whatsapp}
                                            </a>
                                            <span className="text-gray-500">{c.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <LocationIcon /> {c.city} - {c.state}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${c.role === 'admin' ? 'bg-purple-100 text-purple-800' : c.role === 'leader' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {c.role === 'admin' ? 'Admin' : c.role === 'leader' ? 'Líder' : 'Consultor'}
                                        </span>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {c.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(c)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><PencilIcon /></button>
                                            {user?.role === 'admin' && c.id !== user.id && (
                                                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full"><TrashIcon /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ConsultantModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialData={editingC} 
                isChildAddition={!!filterParentId}
            />
        </div>
    );
};

// Main Dashboard Wrapper
const DashboardShell: React.FC = () => {
    const { user, logout } = useConsultant();
    const [activeTab, setActiveTab] = useState<'home' | 'team' | 'all'>('home');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="bg-brand-green-dark text-white w-full md:w-72 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white rounded-lg"><BrandLogo /></div>
                        <span className="font-serif font-bold text-lg">Painel Admin</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-brand-earth flex items-center justify-center font-bold text-brand-green-dark">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-medium truncate">{user?.name}</p>
                            <p className="text-xs opacity-70 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-brand-earth text-brand-green-dark font-bold' : 'hover:bg-white/10'}`}
                    >
                        <ChartBarIcon /> Visão Geral
                    </button>

                    {(user?.role === 'leader' || user?.role === 'admin') && (
                        <button 
                            onClick={() => setActiveTab('team')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'team' ? 'bg-brand-earth text-brand-green-dark font-bold' : 'hover:bg-white/10'}`}
                        >
                            <UsersIcon /> Minha Equipe
                        </button>
                    )}

                    {user?.role === 'admin' && (
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-brand-earth text-brand-green-dark font-bold' : 'hover:bg-white/10'}`}
                        >
                            <UserCircleIcon /> Todos Consultores
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-colors"
                    >
                        <LogoutIcon /> Sair do Sistema
                    </button>
                    <a href="#" className="block mt-4 text-center text-sm opacity-50 hover:opacity-100 transition-opacity">Voltar ao Site</a>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
                {activeTab === 'home' && <DashboardHome />}
                {activeTab === 'team' && <ConsultantsList filterParentId={user?.id} title="Minha Equipe" />}
                {activeTab === 'all' && <ConsultantsList title="Todos os Consultores" />}
            </main>
        </div>
    );
};

// --- 4. Main Entry Point ---

export const ConsultantSystem: React.FC = () => {
    const { user } = useConsultant();
    return user ? <DashboardShell /> : <LoginScreen />;
};

// Wrapped Export
export const ConsultantApp: React.FC = () => (
    <ConsultantProvider>
        <ConsultantSystem />
    </ConsultantProvider>
);
