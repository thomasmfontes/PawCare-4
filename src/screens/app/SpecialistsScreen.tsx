import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { usePets } from '../../hooks/usePets';
import { useNotifications } from '../../hooks/useNotifications';
import { HistoryEventItem } from './HistoryScreen';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { formatDateMask } from '../../utils/masks';

interface SpecialistItem {
  id: string;
  name: string;
  specialty: string;
  crmv: string;
  clinic: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  available: boolean;
  photo: string;
  experience: string;
}

const SPECIALISTS_DATA: SpecialistItem[] = [
  {
    id: '1',
    name: 'Dr. Gabriel Maciel',
    specialty: 'Clínica Geral & Cirurgia',
    crmv: 'CRMV-SP 45.210',
    clinic: 'Clínica VetSaúde',
    address: 'Av. Paulista, 1106 - Bela Vista',
    phone: '(11) 3288-4000',
    rating: 4.9,
    reviews: 124,
    available: true,
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=60',
    experience: '8 anos',
  },
  {
    id: '2',
    name: 'Dra. Vitória Martins',
    specialty: 'Dermatologia & Alergologia',
    crmv: 'CRMV-SP 52.880',
    clinic: 'PetClínic Center',
    address: 'Rua Augusta, 1500 - Consolação',
    phone: '(11) 3120-8899',
    rating: 4.8,
    reviews: 98,
    available: true,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=60',
    experience: '6 anos',
  },
  {
    id: '3',
    name: 'Dr. Matheus Molina',
    specialty: 'Cardiologia & Nefrologia',
    crmv: 'CRMV-SP 39.112',
    clinic: 'Hospital Veterinário 24h',
    address: 'Av. Rebouças, 2200 - Pinheiros',
    phone: '(11) 3814-1100',
    rating: 5.0,
    reviews: 160,
    available: true,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=60',
    experience: '12 anos',
  },
];

const DEFAULT_PET_PHOTO = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60';
const HISTORY_STORAGE_KEY = '@pawcare:clinical_history';

export default function SpecialistsScreen() {
  const { colors, isDark } = useTheme();
  const { pets } = usePets();
  const { notifyAppointmentBooked } = useNotifications();

  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<SpecialistItem | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form states
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('05/11/2026');
  const [bookingReason, setBookingReason] = useState('Consulta Geral de Rotina');

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível iniciar a chamada.');
    });
  };

  const handleOpenMap = (spec: SpecialistItem) => {
    const query = encodeURIComponent(`${spec.clinic}, ${spec.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa.');
    });
  };

  const handleOpenBooking = (spec: SpecialistItem) => {
    setSelectedSpec(spec);
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSpec) return;

    if (!bookingDate.trim() || bookingDate.trim().length !== 10) {
      Alert.alert('Data Inválida', 'Por favor, informe uma data válida no formato DD/MM/AAAA.');
      return;
    }

    if (!bookingReason.trim()) {
      Alert.alert('Motivo Obrigatório', 'Por favor, informe o motivo do agendamento.');
      return;
    }

    try {
      setBookingLoading(true);
      const targetPet = pets.find((p) => p.id === selectedPetId);
      const petName = targetPet ? targetPet.name : 'Pet';

      // 1. Criar novo item no histórico clínico
      const newHistoryEvent: HistoryEventItem = {
        id: Date.now().toString(),
        type: 'consulta',
        title: `Consulta com ${selectedSpec.name} (${petName})`,
        date: bookingDate.trim(),
        description: `${bookingReason.trim()}. Especialidade: ${selectedSpec.specialty}.`,
        veterinarian: selectedSpec.name,
        clinic: selectedSpec.clinic,
        cost: 'A definir no local',
        petName: petName,
      };

      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      const existing: HistoryEventItem[] = stored ? JSON.parse(stored) : [];
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([newHistoryEvent, ...existing]));

      // 2. Disparar notificação local real
      await notifyAppointmentBooked(selectedSpec.name, selectedSpec.specialty, selectedSpec.clinic);

      setBookingModalVisible(false);
      Alert.alert(
        'Agendamento Confirmado!',
        `Consulta para ${petName} agendada para ${bookingDate}. A notificação de confirmação foi emitida e o registro já está no Histórico!`
      );
    } catch (e) {
      console.warn('Erro ao salvar no histórico:', e);
      Alert.alert('Erro', 'Não foi possível confirmar o agendamento.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <Text style={styles.title}>Veterinários Parceiros</Text>
        <Text style={styles.subtitle}>Especialistas qualificados e agendamento direto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {SPECIALISTS_DATA.map((spec) => (
          <View
            key={spec.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <Image source={{ uri: spec.photo }} style={styles.photo} />
              <View style={styles.mainInfo}>
                <Text style={[styles.name, { color: colors.text }]}>{spec.name}</Text>
                <Text style={[styles.specialty, { color: colors.primary }]}>{spec.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={[styles.ratingText, { color: colors.text }]}>{spec.rating}</Text>
                  <Text style={[styles.reviewsText, { color: colors.textMuted }]}>
                    ({spec.reviews} avaliações)
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.availBadge,
                  {
                    backgroundColor: spec.available ? colors.successLight : colors.dangerLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.availText,
                    { color: spec.available ? colors.success : colors.danger },
                  ]}
                >
                  {spec.available ? 'Disponível' : 'Ocupado'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textBody }]}>{spec.clinic}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textBody }]}>{spec.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.detailText, { color: colors.textBody }]}>{spec.phone}</Text>
              </View>
            </View>

            {/* Ações Funcionais: Ligar, Mapa e Agendar */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.smallActionBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => handleCall(spec.phone)}
              >
                <Ionicons name="call" size={15} color={colors.primary} />
                <Text style={[styles.smallActionText, { color: colors.text }]}>Ligar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallActionBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => handleOpenMap(spec)}
              >
                <Ionicons name="navigate-outline" size={15} color={colors.teal} />
                <Text style={[styles.smallActionText, { color: colors.text }]}>Mapa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleOpenBooking(spec)}
              >
                <Ionicons name="calendar-outline" size={15} color="#FFFFFF" />
                <Text style={styles.bookBtnText}>Agendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de Agendamento Rápido */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Agendar Consulta
              </Text>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBody}
            >
              {/* Card Especialista */}
              {selectedSpec && (
                <View style={[styles.specPreviewCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <Image source={{ uri: selectedSpec.photo }} style={styles.specPreviewPhoto} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.specPreviewName, { color: colors.text }]}>{selectedSpec.name}</Text>
                    <Text style={[styles.specPreviewSpecialty, { color: colors.primary }]}>{selectedSpec.specialty}</Text>
                    <Text style={[styles.specPreviewClinic, { color: colors.textMuted }]}>
                      {selectedSpec.clinic} • {selectedSpec.crmv}
                    </Text>
                  </View>
                </View>
              )}

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

              {/* Data da Consulta com Máscara DD/MM/AAAA */}
              <CustomInput
                label="Data da Consulta *"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={bookingDate}
                onChangeText={(val) => setBookingDate(formatDateMask(val))}
                maxLength={10}
              />

              {/* Motivo do Agendamento */}
              <CustomInput
                label="Motivo do Agendamento *"
                placeholder="Ex: Consulta Cardiológica de rotina"
                value={bookingReason}
                onChangeText={setBookingReason}
              />

              {/* Aviso Notificação */}
              <View style={[styles.bookingSummary, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                <Text style={[styles.bookingSummaryText, { color: colors.textBody }]}>
                  Ao confirmar, uma notificação de lembrete será gerada automaticamente e o agendamento constará na aba <Text style={{ fontWeight: '700' }}>"Histórico"</Text>.
                </Text>
              </View>

              <CustomButton
                title="Confirmar Agendamento"
                loading={bookingLoading}
                onPress={handleConfirmBooking}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  specialty: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewsText: {
    fontSize: 11,
  },
  availBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  details: {
    gap: 6,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  smallActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
  specPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  specPreviewPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  specPreviewName: {
    fontSize: 15,
    fontWeight: '700',
  },
  specPreviewSpecialty: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  specPreviewClinic: {
    fontSize: 12,
    marginTop: 2,
  },
  bookingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  bookingSummaryText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  modalSubmitBtn: {
    marginTop: 6,
  },
});