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
import { Pet, PetPayload } from '../types/pet';

interface PetModalProps {
  visible: boolean;
  petToEdit?: Pet | null;
  onClose: () => void;
  onSave: (payload: PetPayload, petId?: string) => Promise<void>;
}

export default function PetModal({ visible, petToEdit, onClose, onSave }: PetModalProps) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Macho' | 'Fêmea'>('Fêmea');
  const [color, setColor] = useState('');
  const [chip, setChip] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name || '');
      setBreed(petToEdit.breed || '');
      setAge(petToEdit.age?.toString() || '');
      setWeight(petToEdit.weight?.toString() || '');
      setGender(petToEdit.gender || 'Fêmea');
      setColor(petToEdit.color || '');
      setChip(petToEdit.chip || '');
    } else {
      setName('');
      setBreed('');
      setAge('');
      setWeight('');
      setGender('Fêmea');
      setColor('');
      setChip('');
    }
  }, [petToEdit, visible]);

  const handleSubmit = async () => {
    if (!name.trim() || !breed.trim() || !age.trim() || !weight.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha Nome, Raça, Idade e Peso.');
      return;
    }

    try {
      setLoading(true);
      const payload: PetPayload = {
        name: name.trim(),
        breed: breed.trim(),
        age: Number(age),
        weight: Number(weight),
        gender,
        color: color.trim() || 'Indefinida',
        chip: chip.trim() || 'Não informado',
        photo:
          petToEdit?.photo ||
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60',
      };

      await onSave(payload, petToEdit?.id);
      onClose();
    } catch (error: any) {
      Alert.alert('Erro ao Salvar', error?.message || 'Falha na operação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {petToEdit ? 'Editar Pet' : 'Cadastrar Novo Pet'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <CustomInput
              label="Nome do Pet *"
              placeholder="Ex: Luna"
              value={name}
              onChangeText={setName}
            />

            <CustomInput
              label="Raça *"
              placeholder="Ex: Golden Retriever"
              value={breed}
              onChangeText={setBreed}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <CustomInput
                  label="Idade (anos) *"
                  placeholder="Ex: 5"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={styles.spacing} />
              <View style={styles.flex1}>
                <CustomInput
                  label="Peso (kg) *"
                  placeholder="Ex: 28.5"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            <Text style={styles.label}>Gênero *</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'Fêmea' && styles.genderBtnActive]}
                onPress={() => setGender('Fêmea')}
              >
                <Ionicons
                  name="female"
                  size={18}
                  color={gender === 'Fêmea' ? Colors.white : Colors.textBody}
                />
                <Text style={[styles.genderText, gender === 'Fêmea' && styles.genderTextActive]}>
                  Fêmea
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderBtn, gender === 'Macho' && styles.genderBtnActive]}
                onPress={() => setGender('Macho')}
              >
                <Ionicons
                  name="male"
                  size={18}
                  color={gender === 'Macho' ? Colors.white : Colors.textBody}
                />
                <Text style={[styles.genderText, gender === 'Macho' && styles.genderTextActive]}>
                  Macho
                </Text>
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Cor / Pelagem"
              placeholder="Ex: Dourada"
              value={color}
              onChangeText={setColor}
            />

            <CustomInput
              label="Microchip (opcional)"
              placeholder="Ex: 985112004567890"
              value={chip}
              onChangeText={setChip}
            />

            <CustomButton
              title={petToEdit ? 'Salvar Alterações' : 'Cadastrar Pet'}
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
    maxHeight: '90%',
    paddingBottom: 24,
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
  body: {
    padding: 20,
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
  genderRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBody,
  },
  genderTextActive: {
    color: Colors.white,
  },
  submitBtn: {
    marginTop: 10,
  },
});
