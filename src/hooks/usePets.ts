import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/petService';
import { useAuth } from './useAuth';
import { Pet, PetPayload } from '../types/pet';
import { Alert } from 'react-native';

export function usePets() {
  const { userId, token } = useAuth();
  const queryClient = useQueryClient();

  // Consulta reativa de pets do usuário logado
  const {
    data: pets = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['pets', userId],
    queryFn: () => {
      if (!userId || !token) return Promise.resolve([]);
      return petService.getPets(userId, token);
    },
    enabled: !!userId && !!token,
  });

  // Mutação para criar pet
  const createMutation = useMutation({
    mutationFn: (payload: PetPayload) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return petService.createPet(userId, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar pet.');
    },
  });

  // Mutação para atualizar pet
  const updateMutation = useMutation({
    mutationFn: ({ petId, payload }: { petId: string; payload: PetPayload }) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return petService.updatePet(userId, petId, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao atualizar pet.');
    },
  });

  // Mutação para excluir pet
  const deleteMutation = useMutation({
    mutationFn: (petId: string) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return petService.deletePet(userId, petId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao excluir pet.');
    },
  });

  return {
    pets,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    createPet: createMutation.mutateAsync,
    updatePet: updateMutation.mutateAsync,
    deletePet: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
