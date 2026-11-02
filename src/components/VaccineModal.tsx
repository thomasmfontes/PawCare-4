import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { Vaccine, VaccinePayload } from '../types/vaccine';
import { Pet } from '../types/pet';
import { formatDateMask } from '../utils/masks';

const DEFAULT_PET_PHOTO =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60';

interface VaccineModalProps {
  visible: boolean;
  pets: Pet[];
  vaccineToEdit?: Vaccine | null;
  onClose: () => void;
  onSave: (payload: VaccinePayload, vaccineId?: string) => Promise<void>;
}

export default function VaccineModal({
  visible,
  pets,
  vaccineToEdit,
  onClose,
  onSave,
}: VaccineModalProps) {
  const { colors, isDark } = useTheme();
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [status, setStatus] = useState<'done' | 'pending' | 'overdue'>('done');
  const [veterinarian, setVeterinarian] = useState('');
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vaccineToEdit) {
      setSelectedPetId(vaccineToEdit.petId || (pets.length > 0 ? pets[0].id : ''));
      setName(vaccineToEdit.name || '');
      setDate(vaccineToEdit.date || '');
      setNextDate(vaccineToEdit.nextDate || '');
      setStatus(vaccineToEdit.status || 'done');
      setVeterinarian(vaccineToEdit.veterinarian || '');
      setClinic(vaccineToEdit.clinic || '');
      setNotes(vaccineToEdit.notes || '');
    } else {
      setSelectedPetId(pets.length > 0 ? pets[0].id : '');
      setName('');
      setDate('');
      setNextDate('');
      setStatus('done');
      setVeterinarian('');
      setClinic('');
      setNotes('');
    }
  }, [vaccineToEdit, visible, pets]);



  const handleSubmit = async () => {
    if (!name.trim() || !nextDate.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, informe o Nome da Vacina e a Próxima Dose.');
      return;
    }

    if (nextDate.trim().length !== 10) {
      Alert.alert('Data Inválida', 'A data da próxima dose deve estar no formato DD/MM/AAAA.');
      return;
    }

    if (date.trim().length > 0 && date.trim().length !== 10) {
      Alert.alert('Data Inválida', 'A data de aplicação deve estar no formato DD/MM/AAAA.');
      return;
    }

    try {
      setLoading(true);
      const payload: VaccinePayload = {
        petId: selectedPetId || (pets.length > 0 ? pets[0].id : undefined),
        name: name.trim(),
        date: date.trim(),
        nextDate: nextDate.trim(),
        status,
        veterinarian: veterinarian.trim(),
        clinic: clinic.trim(),
        notes: notes.trim(),
      };

      await onSave(payload, vaccineToEdit?.id);
      onClose();
    } catch (error: any) {
      Alert.alert('Erro ao Salvar', error?.message || 'Falha na operação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.content, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {vaccineToEdit ? 'Editar Registro de Vacina' : 'Registrar Nova Vacina'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* Seletor de Pet */}
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
                        <Image
                          source={{ uri: p.photo || DEFAULT_PET_PHOTO }}
                          style={styles.petChipAvatar}
                        />
                        <Text
                          style={[
                            styles.petChipText,
                            { color: isSelected ? '#FFFFFF' : colors.text },
                          ]}
                        >
                          {p.name}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <CustomInput
              label="Nome da Vacina *"
              placeholder="Ex: V10 (Décupla)"
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.text }]}>Status da Vacina *</Text>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  {
                    backgroundColor: status === 'done' ? colors.success : colors.inputBg,
                    borderColor: status === 'done' ? colors.success : colors.border,
                  },
                ]}
                onPress={() => setStatus('done')}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: status === 'done' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  Aplicada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  {
                    backgroundColor: status === 'pending' ? colors.warning : colors.inputBg,
                    borderColor: status === 'pending' ? colors.warning : colors.border,
                  },
                ]}
                onPress={() => setStatus('pending')}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: status === 'pending' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  Agendada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  {
                    backgroundColor: status === 'overdue' ? colors.danger : colors.inputBg,
                    borderColor: status === 'overdue' ? colors.danger : colors.border,
                  },
                ]}
                onPress={() => setStatus('overdue')}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: status === 'overdue' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  Atrasada
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <CustomInput
                  label="Data de Aplicação"
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                  value={date}
                  onChangeText={(val) => setDate(formatDateMask(val))}
                />
              </View>
              <View style={styles.spacing} />
              <View style={styles.flex1}>
                <CustomInput
                  label="Próxima Dose *"
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                  value={nextDate}
                  onChangeText={(val) => setNextDate(formatDateMask(val))}
                />
              </View>
            </View>

            <CustomInput
              label="Veterinário Responsável"
              placeholder="Ex: Dra. Mariana Lima"
              value={veterinarian}
              onChangeText={setVeterinarian}
            />

            <CustomInput
              label="Clínica / Local"
              placeholder="Ex: Clínica Veterinária São Francisco"
              value={clinic}
              onChangeText={setClinic}
            />

            <CustomInput
              label="Observações / Lote"
              placeholder="Ex: Lote 459/2026 - Nenhuma reação adversa"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            <CustomButton
              title={vaccineToEdit ? 'Salvar Alterações' : 'Registrar Vacina'}
              loading={loading}
              onPress={handleSubmit}
              style={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 43, 82, 0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingBottom: Platform.OS === 'android' ? 30 : 36,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  body: {
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
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  spacing: {
    width: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 10,
  },
});
