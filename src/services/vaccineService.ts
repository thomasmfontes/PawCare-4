import api from './api';
import { Vaccine, VaccinePayload } from '../types/vaccine';

export const vaccineService = {
  // Lista todas as vacinas do usuário logado via REST
  getVaccines: async (userId: string, token: string): Promise<Vaccine[]> => {
    const response = await api.get(`/users/${userId}/vaccines.json`, {
      params: { auth: token },
    });

    if (!response.data) {
      return [];
    }

    return Object.keys(response.data).map((key) => ({
      id: key,
      ...response.data[key],
    }));
  },

  // Registra uma nova vacina (Create)
  createVaccine: async (
    userId: string,
    payload: VaccinePayload,
    token: string
  ): Promise<Vaccine> => {
    const timestamp = Date.now();
    const dataWithTimestamp = { ...payload, createdAt: timestamp };
    const response = await api.post(`/users/${userId}/vaccines.json`, dataWithTimestamp, {
      params: { auth: token },
    });

    return {
      id: response.data.name,
      ...dataWithTimestamp,
    };
  },

  // Atualiza uma vacina (Update)
  updateVaccine: async (
    userId: string,
    vaccineId: string,
    payload: VaccinePayload,
    token: string
  ): Promise<Vaccine> => {
    await api.put(`/users/${userId}/vaccines/${vaccineId}.json`, payload, {
      params: { auth: token },
    });

    return {
      id: vaccineId,
      ...payload,
    };
  },

  // Exclui uma vacina (Delete)
  deleteVaccine: async (userId: string, vaccineId: string, token: string): Promise<void> => {
    await api.delete(`/users/${userId}/vaccines/${vaccineId}.json`, {
      params: { auth: token },
    });
  },
};
