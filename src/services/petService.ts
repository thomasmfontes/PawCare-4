import api from './api';
import { Pet, PetPayload } from '../types/pet';

export const petService = {
  // Lista todos os pets do usuário logado via REST
  getPets: async (userId: string, token: string): Promise<Pet[]> => {
    const response = await api.get(`/users/${userId}/pets.json`, {
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

  // Cria um novo pet (Create)
  createPet: async (userId: string, payload: PetPayload, token: string): Promise<Pet> => {
    const timestamp = Date.now();
    const dataWithTimestamp = { ...payload, createdAt: timestamp };
    const response = await api.post(`/users/${userId}/pets.json`, dataWithTimestamp, {
      params: { auth: token },
    });

    return {
      id: response.data.name,
      ...dataWithTimestamp,
    };
  },

  // Atualiza dados de um pet existente (Update)
  updatePet: async (
    userId: string,
    petId: string,
    payload: PetPayload,
    token: string
  ): Promise<Pet> => {
    await api.put(`/users/${userId}/pets/${petId}.json`, payload, {
      params: { auth: token },
    });

    return {
      id: petId,
      ...payload,
    };
  },

  // Remove um pet (Delete)
  deletePet: async (userId: string, petId: string, token: string): Promise<void> => {
    await api.delete(`/users/${userId}/pets/${petId}.json`, {
      params: { auth: token },
    });
  },
};
