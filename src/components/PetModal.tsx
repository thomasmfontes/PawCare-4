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
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../hooks/useTheme';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { Pet, PetPayload } from '../types/pet';
import { formatAgeMask, formatWeightMask, formatMicrochipMask } from '../utils/masks';

const DEFAULT_PET_PHOTO =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60';

interface PetModalProps {
  visible: boolean;
  petToEdit?: Pet | null;
  onClose: () => void;
  onSave: (payload: PetPayload, petId?: string) => Promise<void>;
}

export default function PetModal({ visible, petToEdit, onClose, onSave }: PetModalProps) {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Macho' | 'Fêmea'>('Fêmea');
  const [color, setColor] = useState('');
  const [chip, setChip] = useState('');
  const [photo, setPhoto] = useState(DEFAULT_PET_PHOTO);
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
      setPhoto(petToEdit.photo || DEFAULT_PET_PHOTO);
    } else {
      setName('');
      setBreed('');
      setAge('');
      setWeight('');
      setGender('Fêmea');
      setColor('');
      setChip('');
      setPhoto(DEFAULT_PET_PHOTO);
    }
  }, [petToEdit, visible]);

  const requestPermissions = async () => {
    const cameraRoll = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    return cameraRoll.status === 'granted' && camera.status === 'granted';
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissão Necessária',
        'Conceda permissão à galeria nas configurações para selecionar fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissão Necessária',
        'Conceda permissão à câmera nas configurações para tirar fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Foto do Pet', 'Como deseja adicionar a foto?', [
      { text: 'Tirar Foto', onPress: takePhoto },
      { text: 'Galeria', onPress: pickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

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
        photo: photo.trim() || DEFAULT_PET_PHOTO,
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
              {petToEdit ? 'Editar Pet' : 'Cadastrar Novo Pet'}
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
            {/* Foto do Pet com ação de câmera/galeria */}
            <TouchableOpacity
              style={styles.photoContainer}
              activeOpacity={0.8}
              onPress={showImageOptions}
            >
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: photo }} style={[styles.currentPhoto, { borderColor: colors.primary }]} />
                <View style={[styles.cameraIconBadge, { backgroundColor: colors.primary, borderColor: colors.cardBg }]}>
                  <Ionicons name="camera" size={15} color="#FFFFFF" />
                </View>
              </View>
              <Text style={[styles.photoHint, { color: colors.textMuted }]}>Toque para alterar a foto</Text>
            </TouchableOpacity>

            {/* Botões de Câmera e Galeria */}
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={[
                  styles.photoActionBtn,
                  {
                    backgroundColor: isDark ? colors.background : colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={takePhoto}
              >
                <Ionicons name="camera-outline" size={20} color={colors.primary} />
                <Text style={[styles.photoActionText, { color: colors.primary }]}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.photoActionBtn,
                  {
                    backgroundColor: isDark ? colors.background : colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={pickFromGallery}
              >
                <Ionicons name="images-outline" size={20} color={colors.primary} />
                <Text style={[styles.photoActionText, { color: colors.primary }]}>Galeria</Text>
              </TouchableOpacity>
            </View>

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
                  onChangeText={(val) => setAge(formatAgeMask(val))}
                  maxLength={2}
                />
              </View>
              <View style={styles.spacing} />
              <View style={styles.flex1}>
                <CustomInput
                  label="Peso (kg) *"
                  placeholder="Ex: 28.5"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={(val) => setWeight(formatWeightMask(val))}
                  maxLength={5}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Gênero *</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor: gender === 'Fêmea' ? colors.primary : colors.inputBg,
                    borderColor: gender === 'Fêmea' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setGender('Fêmea')}
              >
                <Ionicons
                  name="female"
                  size={18}
                  color={gender === 'Fêmea' ? '#FFFFFF' : colors.textLight}
                />
                <Text
                  style={[
                    styles.genderText,
                    { color: gender === 'Fêmea' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  Fêmea
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  {
                    backgroundColor: gender === 'Macho' ? colors.primary : colors.inputBg,
                    borderColor: gender === 'Macho' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setGender('Macho')}
              >
                <Ionicons
                  name="male"
                  size={18}
                  color={gender === 'Macho' ? '#FFFFFF' : colors.textLight}
                />
                <Text
                  style={[
                    styles.genderText,
                    { color: gender === 'Macho' ? '#FFFFFF' : colors.text },
                  ]}
                >
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
              keyboardType="numeric"
              value={chip}
              onChangeText={(val) => setChip(formatMicrochipMask(val))}
              maxLength={15}
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
    borderWidth: 1,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 10,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  currentPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  photoHint: {
    fontSize: 12,
    marginTop: 6,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
