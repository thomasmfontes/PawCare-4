import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVaccines } from '../../hooks/useVaccines';
import { usePets } from '../../hooks/usePets';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import VaccineModal from '../../components/VaccineModal';
import { Vaccine, VaccinePayload } from '../../types/vaccine';

export default function VaccinesScreen() {
  const { colors, isDark } = useTheme();
  const { pets } = usePets();
  const { notifyVaccineScheduled } = useNotifications();

  const {
    vaccines,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    createVaccine,
    updateVaccine,
    deleteVaccine,
    isDeleting,
  } = useVaccines();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [filter, setFilter] = useState<'all' | 'done' | 'pending' | 'overdue'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } catch (e) {
      console.warn('Erro ao atualizar vacinas:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredVaccines = vaccines.filter((v) => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const handleOpenCreate = () => {
    setSelectedVaccine(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (vac: Vaccine) => {
    setSelectedVaccine(vac);
    setModalVisible(true);
  };

  const handleSaveVaccine = async (payload: VaccinePayload, vaccineId?: string) => {
    const matchedPet = pets.find((p) => p.id === payload.petId);
    const petName = matchedPet ? matchedPet.name : 'seu Pet';

    if (vaccineId) {
      await updateVaccine({ vaccineId, payload });
      await notifyVaccineScheduled(payload.name, petName, payload.nextDate);
      Alert.alert('Sucesso', 'Registro de vacina atualizado e notificação agendada!');
    } else {
      await createVaccine(payload);
      await notifyVaccineScheduled(payload.name, petName, payload.nextDate);
      Alert.alert('Sucesso', 'Vacina registrada e lembrete ativo no dispositivo!');
    }
  };

  const handleDeleteVaccine = (vac: Vaccine) => {
    Alert.alert(
      'Remover Vacina',
      `Deseja excluir o registro da vacina "${vac.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteVaccine(vac.id);
            Alert.alert('Sucesso', 'Vacina removida com sucesso!');
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: Vaccine['status']) => {
    switch (status) {
      case 'done':
        return {
          label: 'Aplicada',
          bg: colors.successLight,
          text: colors.success,
          icon: 'checkmark-circle-outline',
        };
      case 'pending':
        return {
          label: 'Pendente',
          bg: colors.warningLight,
          text: colors.warning,
          icon: 'time-outline',
        };
      case 'overdue':
        return {
          label: 'Atrasada',
          bg: colors.dangerLight,
          text: colors.danger,
          icon: 'alert-circle-outline',
        };
      default:
        return {
          label: status,
          bg: colors.inputBg,
          text: colors.textLight,
          icon: 'help-circle-outline',
        };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header superior */}
      <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Carteira de Vacinas</Text>
            <Text style={styles.subtitle}>Acompanhamento e controle de imunização</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreate}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Barra de Filtros */}
        <View style={styles.filterRow}>
          {(['all', 'done', 'pending', 'overdue'] as const).map((mode) => {
            const labels: Record<string, string> = {
              all: `Todas (${vaccines.length})`,
              done: 'Aplicadas',
              pending: 'Pendentes',
              overdue: 'Atrasadas',
            };
            const isActive = filter === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setFilter(mode)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {labels[mode]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Conteúdo */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>
            Carregando carteira de vacinas...
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            Erro ao carregar vacinas: {(error as Error)?.message || 'Falha na requisição'}
          </Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredVaccines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.cardBg}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={56} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma vacina encontrada</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
                {filter === 'all'
                  ? 'Cadastre a primeira vacina para manter o pet protegido.'
                  : 'Nenhuma vacina nesta categoria.'}
              </Text>
              {filter === 'all' && (
                <TouchableOpacity
                  style={[styles.createFirstBtn, { backgroundColor: colors.primary }]}
                  onPress={handleOpenCreate}
                >
                  <Text style={styles.createFirstBtnText}>Cadastrar Vacina</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const badge = getStatusBadge(item.status);
            return (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.cardBg,
                    borderLeftColor: badge.text,
                    borderColor: colors.border,
                    borderWidth: isDark ? 1 : 0,
                    borderLeftWidth: 4,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.vaccineName, { color: colors.text }]}>{item.name}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={12} color={badge.text} />
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                <View style={[styles.datesRow, { backgroundColor: colors.inputBg }]}>
                  <View style={styles.dateCol}>
                    <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Data Aplicação</Text>
                    <Text style={[styles.dateValue, { color: colors.textBody }]}>{item.date}</Text>
                  </View>
                  <View style={styles.dateCol}>
                    <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Próxima Dose</Text>
                    <Text
                      style={[
                        styles.dateValue,
                        {
                          fontWeight: '700',
                          color: item.status === 'overdue' ? colors.danger : colors.textBody,
                        },
                      ]}
                    >
                      {item.nextDate}
                    </Text>
                  </View>
                </View>

                {item.veterinarian ? (
                  <Text style={[styles.detailText, { color: colors.textLight }]}>
                    Veterinário: <Text style={[styles.detailBold, { color: colors.textBody }]}>{item.veterinarian}</Text>
                  </Text>
                ) : null}

                {item.clinic ? (
                  <Text style={[styles.detailText, { color: colors.textLight }]}>
                    Clínica: <Text style={[styles.detailBold, { color: colors.textBody }]}>{item.clinic}</Text>
                  </Text>
                ) : null}

                {item.notes ? (
                  <Text style={[styles.notesText, { color: colors.textMuted }]}>"{item.notes}"</Text>
                ) : null}

                <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleOpenEdit(item)}
                  >
                    <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                    <Text style={[styles.actionBtnText, { color: colors.primary }]}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDeleteVaccine(item)}
                    disabled={isDeleting}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                    <Text style={[styles.actionBtnText, { color: colors.danger }]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Modal Reutilizável de Cadastro e Edição */}
      <VaccineModal
        visible={modalVisible}
        vaccineToEdit={selectedVaccine}
        pets={pets}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveVaccine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F6BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterTextActive: {
    color: '#0D2B52',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  datesRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 13,
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailBold: {
    fontWeight: '600',
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteActionBtn: {
    opacity: 0.9,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  createFirstBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
