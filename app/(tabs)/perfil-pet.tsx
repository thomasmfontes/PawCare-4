import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { pet } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface InfoRowProps {
  icon: IoniconsName;
  label: string;
  value: string;
  iconColor?: string;
}

function InfoRow({ icon, label, value, iconColor = Colors.primary }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function PerfilPetScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil da Luna</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: pet.photo }}
              style={styles.petPhoto}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            </View>
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Ionicons name="female" size={12} color={Colors.primary} />
              <Text style={styles.tagText}>{pet.gender}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.success + '15' }]}>
              <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
              <Text style={[styles.tagText, { color: Colors.success }]}>Saudável</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#F59E0B15' }]}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={[styles.tagText, { color: '#F59E0B' }]}>Vacinada</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pet.age}</Text>
            <Text style={styles.statUnit}>anos</Text>
            <Text style={styles.statLabel}>Idade</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pet.weight}</Text>
            <Text style={styles.statUnit}>kg</Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statUnit}>vacs</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statUnit}>eventos</Text>
            <Text style={styles.statLabel}>Histórico</Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="information-circle" size={16} color={Colors.primary} /> Informações Básicas
          </Text>
          <InfoRow icon="paw" label="Nome" value={pet.name} />
          <InfoRow icon="ribbon" label="Raça" value={pet.breed} />
          <InfoRow icon="calendar" label="Data de Nascimento" value={pet.birthday} />
          <InfoRow icon="female" label="Sexo" value={pet.gender} iconColor="#FF6B9D" />
          <InfoRow icon="color-palette" label="Pelagem" value={pet.color} iconColor="#F59E0B" />
        </View>

        {/* Physical Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="fitness" size={16} color="#10B981" /> Dados Físicos
          </Text>
          <InfoRow icon="barbell" label="Peso Atual" value={`${pet.weight} kg`} iconColor="#10B981" />
          <InfoRow icon="body" label="Porte" value="Grande (acima de 25 kg)" iconColor="#10B981" />
          <InfoRow icon="heart-circle" label="Status de Saúde" value="Saudável" iconColor="#10B981" />
          <InfoRow icon="nutrition" label="Dieta" value="Ração Premium — 350g/dia" iconColor="#10B981" />
        </View>

        {/* Identification */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="shield-checkmark" size={16} color="#8B5CF6" /> Identificação
          </Text>
          <InfoRow icon="qr-code" label="Microchip" value={pet.chip} iconColor="#8B5CF6" />
          <InfoRow icon="person" label="Responsável" value={pet.owner} iconColor="#8B5CF6" />
          <InfoRow icon="location" label="Cidade" value="São Paulo, SP" iconColor="#8B5CF6" />
          <InfoRow icon="call" label="Contato" value="(11) 99999-8888" iconColor="#8B5CF6" />
        </View>

        {/* Vet Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="medkit" size={16} color={Colors.danger} /> Veterinário de Referência
          </Text>
          <InfoRow icon="person-circle" label="Veterinário" value="Dr. Carlos Menezes" iconColor={Colors.danger} />
          <InfoRow icon="business" label="Clínica" value="Clínica VetSaúde" iconColor={Colors.danger} />
          <InfoRow icon="call" label="Telefone" value="(11) 3456-7890" iconColor={Colors.danger} />
          <InfoRow icon="time" label="Última Consulta" value="10/09/2024" iconColor={Colors.danger} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  petPhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  petName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statUnit: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: -1,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomSpacer: {
    height: 20,
  },
});
