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
import Colors from '../../theme/Colors';
import { usePets } from '../../hooks/usePets';
import PetModal from '../../components/PetModal';
import { Pet, PetPayload } from '../../types/pet';

export default function PetsScreen() {
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
    <View style={styles.container}>
      {/* Header padronizado de 140px como avaliado no PawCare */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Meus Pets</Text>
            <Text style={styles.subtitle}>Gerenciamento completo e seguro</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreate}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exibição dos 3 status da consulta: Loading, Erro ou FlatList */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando pets...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <Text style={styles.errorText}>
            Erro ao carregar pets: {(error as Error)?.message || 'Falha na requisição'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="paw-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Cadastre seu pet agora para acompanhar vacinas e consultas.
              </Text>
              <TouchableOpacity style={styles.createFirstBtn} onPress={handleOpenCreate}>
                <Text style={styles.createFirstBtnText}>Cadastrar Pet</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleOpenEdit(item)}
                style={styles.photoContainer}
              >
                <Image
                  source={{
                    uri:
                      item.photo ||
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60',
                  }}
                  style={styles.photo}
                />
              </TouchableOpacity>
              <View style={styles.info}>
                <View style={styles.topInfoRow}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <View style={styles.genderBadge}>
                    <Text style={styles.genderBadgeText}>{item.gender}</Text>
                  </View>
                </View>
                <Text style={styles.breed}>{item.breed}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaPill}>{item.age} anos</Text>
                  <Text style={styles.metaPill}>{item.weight} kg</Text>
                  <Text style={styles.metaPill}>{item.color}</Text>
                </View>
                {item.chip ? (
                  <Text style={styles.chipText}>Chip: {item.chip}</Text>
                ) : null}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenEdit(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDeletePet(item)}
                  disabled={isDeleting}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal Reutilizável de Cadastro/Edição de Pet */}
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
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: Colors.darkBlue,
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
    color: Colors.text,
  },
  genderBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  breed: {
    fontSize: 13,
    color: Colors.textLight,
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
    color: Colors.textBody,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 11,
    color: Colors.textMuted,
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
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: Colors.dangerLight,
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
