import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { usePets } from '../../hooks/usePets';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { formatDateMask, formatCurrencyMask } from '../../utils/masks';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export interface HistoryEventItem {
  id: string;
  type: 'consulta' | 'vacina' | 'exame' | 'cirurgia' | 'banho' | 'outros';
  title: string;
  date: string;
  description: string;
  veterinarian?: string;
  clinic?: string;
  cost?: string;
  petName?: string;
}

const DEFAULT_PET_PHOTO = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60';
const STORAGE_KEY = '@pawcare:clinical_history';

const INITIAL_EVENTS: HistoryEventItem[] = [
  {
    id: '1',
    type: 'consulta',
    title: 'Check-up Anual Preventivo',
    date: '15/03/2026',
    description: 'Exame clínico geral completo, auscultação cardíaca e avaliação dentária.',
    veterinarian: 'Dr. Gabriel Maciel',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 180,00',
  },
  {
    id: '2',
    type: 'vacina',
    title: 'Aplicação da Vacina V10 e Antirrábica',
    date: '10/03/2026',
    description: 'Imunização anual contra 10 cepas virais e raiva.',
    veterinarian: 'Dr. Gabriel Maciel',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 220,00',
  },
  {
    id: '4',
    type: 'banho',
    title: 'Banho Terapêutico e Tosa Higiênica',
    date: '02/02/2026',
    description: 'Higiene com shampoo hipoalergênico e corte de unhas.',
    veterinarian: 'Equipe de Estética',
    clinic: 'PetCare Spa',
    cost: 'R$ 95,00',
  },
  {
    id: '3',
    type: 'exame',
    title: 'Hemograma Completo e Perfil Bioquímico',
    date: '20/01/2026',
    description: 'Avaliação da função renal, hepática e contagem de plaquetas.',
    veterinarian: 'Dra. Vitória Martins',
    clinic: 'PetClínic Center',
    cost: 'R$ 310,00',
  },
];

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const { sendNotification } = useNotifications();
  const { pets } = usePets();

  const [events, setEvents] = useState<HistoryEventItem[]>(INITIAL_EVENTS);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [savingLoading, setSavingLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<HistoryEventItem['type']>('consulta');
  const [newDate, setNewDate] = useState('');
  const [newVet, setNewVet] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets]);

  const loadEvents = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar histórico:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const saveEvents = async (updated: HistoryEventItem[]) => {
    setEvents(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }
  };

  const handleCreateEvent = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Título Obrigatório', 'Por favor, informe o título ou procedimento realizado.');
      return;
    }

    if (!newDate.trim() || newDate.trim().length !== 10) {
      Alert.alert('Data Inválida', 'Por favor, informe a data no formato DD/MM/AAAA.');
      return;
    }

    try {
      setSavingLoading(true);
      const targetPet = pets.find((p) => p.id === selectedPetId);
      const petName = targetPet ? targetPet.name : undefined;

      const created: HistoryEventItem = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        type: newType,
        date: newDate.trim(),
        veterinarian: newVet.trim() || undefined,
        clinic: newClinic.trim() || undefined,
        cost: newCost.trim() || undefined,
        description: newDescription.trim() || 'Procedimento registrado pelo tutor.',
        petName,
      };

      const updated = [created, ...events];
      await saveEvents(updated);

      // Disparar notificação local
      await sendNotification(
        '📋 Novo Evento no Histórico!',
        `O registro "${created.title}" foi adicionado com sucesso ao prontuário médico.`,
        { screen: 'History' }
      );

      // Limpar form e fechar modal
      setNewTitle('');
      setNewDate('');
      setNewVet('');
      setNewClinic('');
      setNewCost('');
      setNewDescription('');
      setModalVisible(false);

      Alert.alert('Sucesso', 'Registro clínico adicionado com sucesso!');
    } catch (e) {
      console.warn('Erro ao criar registro:', e);
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleDeleteEvent = (id: string, title: string) => {
    Alert.alert('Remover Registro', `Deseja excluir "${title}" do histórico?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const updated = events.filter((e) => e.id !== id);
          await saveEvents(updated);
        },
      },
    ]);
  };

  const parseDateToTimestamp = (dateStr: string): number => {
    if (!dateStr) return 0;
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  const filteredEvents = events
    .filter((e) => {
      if (selectedFilter === 'todos') return true;
      return e.type === selectedFilter;
    })
    .sort((a, b) => {
      const timeA = parseDateToTimestamp(a.date);
      const timeB = parseDateToTimestamp(b.date);
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const getEventConfig = (type: HistoryEventItem['type']): { label: string; color: string; bg: string; icon: IoniconsName } => {
    switch (type) {
      case 'consulta':
        return { label: 'Consulta', color: colors.primary, bg: colors.primaryLight, icon: 'medical-outline' };
      case 'vacina':
        return { label: 'Vacina', color: colors.success, bg: colors.successLight, icon: 'shield-checkmark-outline' };
      case 'exame':
        return { label: 'Exame', color: colors.purple, bg: colors.purpleLight, icon: 'flask-outline' };
      case 'cirurgia':
        return { label: 'Cirurgia', color: colors.danger, bg: colors.dangerLight, icon: 'cut-outline' };
      case 'banho':
        return { label: 'Banho & Tosa', color: colors.teal, bg: colors.tealLight, icon: 'water-outline' };
      default:
        return { label: 'Outros', color: colors.textLight, bg: colors.inputBg, icon: 'ellipsis-horizontal-outline' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Histórico Clínico</Text>
            <Text style={styles.subtitle}>
              {sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.sortToggleBtn}
              onPress={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              activeOpacity={0.8}
            >
              <Ionicons
                name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.sortToggleText}>
                {sortOrder === 'desc' ? 'Recentes' : 'Antigos'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filtro Rápido */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {['todos', 'consulta', 'vacina', 'exame', 'cirurgia', 'banho'].map((f) => {
            const isActive = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterBtn,
                  isActive && styles.filterBtnActive,
                ]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    isActive && styles.filterBtnTextActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={54} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Nenhum registro encontrado para esta categoria.
            </Text>
          </View>
        ) : (
          filteredEvents.map((event, idx) => {
            const cfg = getEventConfig(event.type);
            const isLast = idx === filteredEvents.length - 1;

            return (
              <View key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineSide}>
                  <View style={[styles.dotOuter, { borderColor: cfg.color }]}>
                    <View style={[styles.dotInner, { backgroundColor: cfg.color }]}>
                      <Ionicons name={cfg.icon} size={14} color="#FFFFFF" />
                    </View>
                  </View>
                  {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                </View>

                <View
                  style={[
                    styles.eventCard,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      borderWidth: isDark ? 1 : 0,
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                      <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={[styles.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                      {event.petName && (
                        <View style={[styles.petBadge, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                          <Text style={[styles.petBadgeText, { color: colors.text }]}>🐾 {event.petName}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.headerRight}>
                      <Text style={[styles.eventDate, { color: colors.textLight }]}>{event.date}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteEvent(event.id, event.title)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="trash-outline" size={15} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                  <Text style={[styles.eventDesc, { color: colors.textBody }]}>{event.description}</Text>

                  {(event.veterinarian || event.clinic || event.cost) && (
                    <View style={[styles.metaContainer, { backgroundColor: colors.inputBg }]}>
                      {event.veterinarian && (
                        <View style={styles.metaRow}>
                          <Ionicons name="person-outline" size={12} color={colors.primary} />
                          <Text style={[styles.metaText, { color: colors.textBody }]}>{event.veterinarian}</Text>
                        </View>
                      )}
                      {event.clinic && (
                        <View style={styles.metaRow}>
                          <Ionicons name="business-outline" size={12} color={colors.teal} />
                          <Text style={[styles.metaText, { color: colors.textBody }]}>{event.clinic}</Text>
                        </View>
                      )}
                      {event.cost && (
                        <View style={styles.metaRow}>
                          <Ionicons name="cash-outline" size={12} color={colors.success} />
                          <Text style={[styles.metaText, { color: colors.success, fontWeight: '700' }]}>
                            {event.cost}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal de Cadastro de Evento Clínico */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Novo Registro Clínico</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBody}
            >
              {/* Seletor de Pet com Foto idêntico ao VaccineModal */}
              {pets.length > 0 && (
                <View style={styles.petSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Selecione o Pet *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
                    {pets.map((p) => {
                      const isSelected = p.id === selectedPetId;
                      return (
                        <TouchableOpacity
                          key={p.id}
                          style={[
                            styles.petChip,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.inputBg,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => setSelectedPetId(p.id)}
                        >
                          <Image source={{ uri: p.photo || DEFAULT_PET_PHOTO }} style={styles.petChipAvatar} />
                          <Text
                            style={[
                              styles.petChipText,
                              { color: isSelected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {p.name}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Tipo de Procedimento com chips padronizados */}
              <Text style={[styles.label, { color: colors.text }]}>Tipo de Procedimento *</Text>
              <View style={styles.typeSelectorRow}>
                {(['consulta', 'vacina', 'exame', 'cirurgia', 'banho'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeSelectorChip,
                      {
                        backgroundColor: newType === t ? colors.primary : colors.inputBg,
                        borderColor: newType === t ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setNewType(t)}
                  >
                    <Text
                      style={[
                        styles.typeSelectorChipText,
                        { color: newType === t ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Título com CustomInput */}
              <CustomInput
                label="Título / Procedimento *"
                placeholder="Ex: Consulta Cardiológica"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              {/* Data com formatDateMask e CustomInput */}
              <CustomInput
                label="Data do Procedimento *"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={newDate}
                onChangeText={(val) => setNewDate(formatDateMask(val))}
                maxLength={10}
              />

              {/* Valor com formatCurrencyMask e CustomInput */}
              <CustomInput
                label="Valor do Procedimento (R$)"
                placeholder="Ex: R$ 150,00"
                keyboardType="numeric"
                value={newCost}
                onChangeText={(val) => setNewCost(formatCurrencyMask(val))}
              />

              {/* Veterinário com CustomInput */}
              <CustomInput
                label="Veterinário Responsável"
                placeholder="Ex: Dr. Gabriel Maciel"
                value={newVet}
                onChangeText={setNewVet}
              />

              {/* Clínica com CustomInput */}
              <CustomInput
                label="Clínica ou Hospital"
                placeholder="Ex: Clínica VetSaúde"
                value={newClinic}
                onChangeText={setNewClinic}
              />

              {/* Observações com CustomInput */}
              <CustomInput
                label="Observações / Diagnóstico"
                placeholder="Observações do exame, orientações e prescrições..."
                multiline
                numberOfLines={3}
                value={newDescription}
                onChangeText={setNewDescription}
              />

              <CustomButton
                title="Salvar Registro"
                loading={savingLoading}
                onPress={handleCreateEvent}
                style={styles.modalSubmitBtn}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    marginBottom: 12,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F6BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterBtnTextActive: {
    color: '#0D2B52',
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineSide: {
    width: 32,
    alignItems: 'center',
  },
  dotOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 14,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  metaContainer: {
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 43, 82, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingBottom: Platform.OS === 'android' ? 30 : 36,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalScrollView: {
    flex: 1,
  },
  modalBody: {
    padding: 20,
    paddingBottom: 40,
  },
  petSection: {
    marginBottom: 16,
  },
  petScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  petChipAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  petChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeSelectorChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  typeSelectorChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  petBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  petBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    marginTop: 6,
  },
});