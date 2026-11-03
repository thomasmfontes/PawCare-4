import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '../../hooks/usePets';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import PetModal from '../../components/PetModal';
import { Pet, PetPayload } from '../../types/pet';

export default function PetsScreen() {
  const { colors, isDark } = useTheme();
  const { sendNotification } = useNotifications();

  const {
    pets,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    createPet,
    updatePet,
    deletePet,
    isDeleting,
  } = usePets();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } catch (e) {
      console.warn('Erro ao atualizar pets:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPet(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleSavePet = async (payload: PetPayload, petId?: string) => {
    if (petId) {
      await updatePet({ petId, payload });
      Alert.alert('Sucesso', 'Pet atualizado com sucesso!');
    } else {
      await createPet(payload);
      await sendNotification(
        '🐾 Pet Cadastrado com Sucesso!',
        `${payload.name} foi adicionado ao PawCare. Não esqueça de verificar a carteira de vacinas!`,
        { screen: 'Pets' }
      );
      Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
    }
  };

  const handleDeletePet = (pet: Pet) => {
    Alert.alert(
      'Remover Pet',
      `Tem certeza que deseja remover ${pet.name}? Esta ação não poderá ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(pet.id);
              Alert.alert('Sucesso', `${pet.name} foi removido com sucesso.`);
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao remover pet.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header superior */}
      <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Meus Pets</Text>
            <Text style={styles.subtitle}>Gerenciamento completo e seguro</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreate}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>Carregando pets...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            Erro ao carregar pets: {(error as Error)?.message || 'Falha na conexão'}
          </Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
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
              <Ionicons name="paw-outline" size={56} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum pet cadastrado</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
                Toque no botão "+" no canto superior para registrar seu primeiro amigo de quatro patas.
              </Text>
              <TouchableOpacity
                style={[styles.createFirstBtn, { backgroundColor: colors.primary }]}
                onPress={handleOpenCreate}
              >
                <Text style={styles.createFirstBtnText}>Cadastrar Primeiro Pet</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
            >
              <View style={styles.photoContainer}>
                <Image
                  source={{
                    uri:
                      item.photo ||
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60',
                  }}
                  style={styles.photo}
                />
              </View>

              <View style={styles.info}>
                <View style={styles.topInfoRow}>
                  <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
                  <View style={[styles.genderBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.genderBadgeText, { color: colors.primary }]}>{item.gender}</Text>
                  </View>
                </View>
                <Text style={[styles.breed, { color: colors.textLight }]}>{item.breed}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                    {item.age} anos
                  </Text>
                  <Text style={[styles.metaPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                    {item.weight} kg
                  </Text>
                  <Text style={[styles.metaPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                    {item.color}
                  </Text>
                </View>
                {item.chip ? (
                  <Text style={[styles.chipText, { color: colors.textMuted }]}>Chip: {item.chip}</Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() => handleOpenEdit(item)}
                >
                  <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: colors.dangerLight }]}
                  onPress={() => handleDeletePet(item)}
                  disabled={isDeleting}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal Reutilizável de Formulário */}
      <PetModal
        visible={modalVisible}
        petToEdit={selectedPet}
        onClose={() => setModalVisible(false)}
        onSave={handleSavePet}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 14,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  info: {
    flex: 1,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
  },
  genderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  breed: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  metaPill: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {},
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
