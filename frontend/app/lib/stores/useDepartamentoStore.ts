import { create } from 'zustand';
import apiClient from '@/app/lib/api/client';
import { Departamento } from '@/app/lib/types/departamento';

interface DepartamentoState {
    departamentos: Departamento[];
    eliminados: Departamento[];
    loading: boolean;
    error: string | null;
    fetchDepartamentos: () => Promise<void>;
    fetchEliminados: () => Promise<void>;
    getDepartamento: (id: number) => Promise<Departamento>;
    createDepartamento: (departamento: Omit<Departamento, 'id'>) => Promise<Departamento>;
    updateDepartamento: (id: number, departamento: Partial<Departamento>) => Promise<Departamento>;
    deleteDepartamento: (id: number) => Promise<void>;
    restoreDepartamento: (id: number) => Promise<Departamento>;
}

export const useDepartamentoStore = create<DepartamentoState>((set, get) => ({
    departamentos: [],
    eliminados: [],
    loading: false,
    error: null,

    fetchDepartamentos: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/departamentos');
            set({ departamentos: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error al cargar departamentos', loading: false });
        }
    },

    fetchEliminados: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/departamentos/eliminadas');
            set({ eliminados: response.data, loading: false });
        } catch (error) {
            set({ error: 'Error al cargar departamentos eliminados', loading: false });
        }
    },

    getDepartamento: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get(`/departamentos/${id}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: 'Error al obtener departamento', loading: false });
            throw error;
        }
    },

    createDepartamento: async (departamento) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post('/departamentos', departamento);
            set((state) => ({
                departamentos: [...state.departamentos, response.data],
                loading: false,
            }));
            return response.data;
        } catch (error) {
            set({ error: 'Error al crear departamento', loading: false });
            throw error;
        }
    },

    updateDepartamento: async (id, departamento) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.put(`/departamentos/${id}`, departamento);
            set((state) => ({
                departamentos: state.departamentos.map((dep) =>
                    dep.id === id ? response.data : dep
                ),
                loading: false,
            }));
            return response.data;
        } catch (error) {
            set({ error: 'Error al actualizar departamento', loading: false });
            throw error;
        }
    },

    deleteDepartamento: async (id) => {
        set({ loading: true, error: null });
        try {
            await apiClient.delete(`/departamentos/${id}`);
            set((state) => ({
                departamentos: state.departamentos.filter((dep) => dep.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: 'Error al eliminar departamento', loading: false });
            throw error;
        }
    },

    restoreDepartamento: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.patch(`/departamentos/${id}/restaurar`);
            set((state) => ({
                eliminados: state.eliminados.filter((dep) => dep.id !== id),
                departamentos: [...state.departamentos, response.data],
                loading: false,
            }));
            return response.data;
        } catch (error) {
            set({ error: 'Error al restaurar departamento', loading: false });
            throw error;
        }
    },
}));