import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/Colors';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { Vaccine, VaccinePayload } from '../types/vaccine';

interface VaccineModalProps {
  visible: boolean;
  vaccineToEdit?: Vaccine | null;
  onClose: () => void;
  onSave: (payload: VaccinePayload, vaccineId?: string) => Promise<void>;
}

export default function VaccineModal({
  visible,
  vaccineToEdit,
  onClose,
  onSave,
}: VaccineModalProps) {
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
      setName(vaccineToEdit.name || '');
      setDate(vaccineToEdit.date || '');
      setNextDate(vaccineToEdit.nextDate || '');
      setStatus(vaccineToEdit.status || 'done');
      setVeterinarian(vaccineToEdit.veterinarian || '');
      setClinic(vaccineToEdit.clinic || '');
      setNotes(vaccineToEdit.notes || '');
    } else {
      setName('');
      setDate('');
      setNextDate('');
      setStatus('done');
      setVeterinarian('');
      setClinic('');
      setNotes('');
    }
  }, [vaccineToEdit, visible]);

  const formatDateMask = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {vaccineToEdit ? 'Editar Registro de Vacina' : 'Registrar Nova Vacina'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            <CustomInput
              label="Nome da Vacina *"
              placeholder="Ex: V10 (Décupla)"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Status da Vacina *</Text>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  status === 'done' && { backgroundColor: Colors.success, borderColor: Colors.success },
                ]}
                onPress={() => setStatus('done')}
              >
                <Text style={[styles.statusText, status === 'done' && styles.statusTextActive]}>
                  Aplicada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  status === 'pending' && { backgroundColor: Colors.warning, borderColor: Colors.warning },
                ]}
                onPress={() => setStatus('pending')}
              >
                <Text style={[styles.statusText, status === 'pending' && styles.statusTextActive]}>
                  Pendente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  status === 'overdue' && { backgroundColor: Colors.danger, borderColor: Colors.danger },
                ]}
                onPress={() => setStatus('overdue')}
              >
                <Text style={[styles.statusText, status === 'overdue' && styles.statusTextActive]}>
                  Atrasada
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <CustomInput
                  label="Data Aplicação"
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                  value={date}
                  onChangeText={(text) => setDate(formatDateMask(text))}
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
                  onChangeText={(text) => setNextDate(formatDateMask(text))}
                />
              </View>
            </View>

            <CustomInput
              label="Veterinário Responsável"
              placeholder="Ex: Dr. Gabriel Maciel"
              value={veterinarian}
              onChangeText={setVeterinarian}
            />

            <CustomInput
              label="Clínica Veterinária"
              placeholder="Ex: Clínica VetSaúde"
              value={clinic}
              onChangeText={setClinic}
            />

            <CustomInput
              label="Observações Clínicas"
              placeholder="Ex: Reforço anual obrigatório"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <CustomButton
              title={vaccineToEdit ? 'Salvar Alterações' : 'Salvar Registro'}
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
    backgroundColor: 'rgba(13, 43, 82, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingBottom: Platform.OS === 'android' ? 30 : 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
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
    color: Colors.text,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBody,
  },
  statusTextActive: {
    color: Colors.white,
  },
  submitBtn: {
    marginTop: 10,
  },
});
