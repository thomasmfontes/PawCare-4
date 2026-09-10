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
import Colors from '../../theme/Colors';
import { useVaccines } from '../../hooks/useVaccines';
import VaccineModal from '../../components/VaccineModal';
import { Vaccine, VaccinePayload } from '../../types/vaccine';

export default function VaccinesScreen() {
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
    if (vaccineId) {
      await updateVaccine({ vaccineId, payload });
      Alert.alert('Sucesso', 'Registro de vacina atualizado!');
    } else {
      await createVaccine(payload);
      Alert.alert('Sucesso', 'Vacina registrada com sucesso!');
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
            try {
              await deleteVaccine(vac.id);
              Alert.alert('Sucesso', 'Vacina removida.');
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao remover vacina.');
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: Vaccine['status']) => {
    switch (status) {
      case 'done':
        return { label: 'Aplicada', bg: Colors.successLight, text: Colors.success, icon: 'checkmark-circle' };
      case 'overdue':
        return { label: 'Atrasada', bg: Colors.dangerLight, text: Colors.danger, icon: 'alert-circle' };
      case 'pending':
      default:
        return { label: 'Pendente', bg: Colors.warningLight, text: Colors.warning, icon: 'time-outline' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header padronizado */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Carteira de Vacinas</Text>
            <Text style={styles.subtitle}>Acompanhamento e controle de imunização</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreate}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Barra de Filtros */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Todas ({vaccines.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'done' && styles.filterChipActive]}
            onPress={() => setFilter('done')}
          >
            <Text style={[styles.filterText, filter === 'done' && styles.filterTextActive]}>
              Aplicadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'pending' && styles.filterChipActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pendentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'overdue' && styles.filterChipActive]}
            onPress={() => setFilter('overdue')}
          >
            <Text style={[styles.filterText, filter === 'overdue' && styles.filterTextActive]}>
              Atrasadas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exibição dos 3 status da consulta: Loading, Erro ou FlatList */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando carteira de vacinas...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>
            Erro ao carregar vacinas: {(error as Error)?.message || 'Falha na requisição'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredVaccines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma vacina encontrada</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'all'
                  ? 'Cadastre a primeira vacina para manter o pet protegido.'
                  : 'Nenhuma vacina nesta categoria.'}
              </Text>
              {filter === 'all' && (
                <TouchableOpacity style={styles.createFirstBtn} onPress={handleOpenCreate}>
                  <Text style={styles.createFirstBtnText}>Cadastrar Vacina</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const badge = getStatusBadge(item.status);
            return (
              <View style={[styles.card, { borderLeftColor: badge.text }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.vaccineName}>{item.name}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={12} color={badge.text} />
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                <View style={styles.datesRow}>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>Data Aplicação</Text>
                    <Text style={styles.dateValue}>{item.date || 'Não informada'}</Text>
                  </View>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>Próxima Dose</Text>
                    <Text style={[styles.dateValue, { fontWeight: '700', color: badge.text }]}>
                      {item.nextDate}
                    </Text>
                  </View>
                </View>

                {item.veterinarian && item.veterinarian !== 'Não informado' ? (
                  <Text style={styles.detailText}>
                    <Text style={styles.detailBold}>Vet: </Text>
                    {item.veterinarian} {item.clinic ? `• ${item.clinic}` : ''}
                  </Text>
                ) : null}

                {item.notes ? (
                  <Text style={styles.notesText}>{item.notes}</Text>
                ) : null}

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleOpenEdit(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="pencil" size={16} color={Colors.primary} />
                    <Text style={styles.actionBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDeleteVaccine(item)}
                    disabled={isDeleting}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                    <Text style={[styles.actionBtnText, { color: Colors.danger }]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Modal Reutilizável de Cadastro/Edição de Vacina */}
      <VaccineModal
        visible={modalVisible}
        vaccineToEdit={selectedVaccine}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveVaccine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.white,
  },
  list: {
    padding: 16,
    paddingBottom: 30,
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
    color: Colors.textLight,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.darkBlue,
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
    color: Colors.text,
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
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 13,
    color: Colors.textBody,
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  detailBold: {
    fontWeight: '600',
    color: Colors.textBody,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  createFirstBtn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
