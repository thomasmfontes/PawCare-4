import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaccineService } from '../services/vaccineService';
import { useAuth } from './useAuth';
import { Vaccine, VaccinePayload } from '../types/vaccine';
import { Alert } from 'react-native';

export function useVaccines() {
  const { userId, token } = useAuth();
  const queryClient = useQueryClient();

  // Consulta reativa de vacinas do usuário
  const {
    data: vaccines = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['vaccines', userId],
    queryFn: () => {
      if (!userId || !token) return Promise.resolve([]);
      return vaccineService.getVaccines(userId, token);
    },
    enabled: !!userId && !!token,
  });

  // Mutação para criar vacina
  const createMutation = useMutation({
    mutationFn: (payload: VaccinePayload) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return vaccineService.createVaccine(userId, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccines', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar vacina.');
    },
  });

  // Mutação para atualizar vacina
  const updateMutation = useMutation({
    mutationFn: ({ vaccineId, payload }: { vaccineId: string; payload: VaccinePayload }) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return vaccineService.updateVaccine(userId, vaccineId, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccines', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao atualizar vacina.');
    },
  });

  // Mutação para excluir vacina
  const deleteMutation = useMutation({
    mutationFn: (vaccineId: string) => {
      if (!userId || !token) throw new Error('Usuário não autenticado');
      return vaccineService.deleteVaccine(userId, vaccineId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccines', userId] });
    },
    onError: (err: any) => {
      Alert.alert('Erro', err.message || 'Falha ao excluir vacina.');
    },
  });

  return {
    vaccines,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    createVaccine: createMutation.mutateAsync,
    updateVaccine: updateMutation.mutateAsync,
    deleteVaccine: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
