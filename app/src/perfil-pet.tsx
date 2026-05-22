import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { pet } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface InfoRowProps {
  icon: IoniconsName;
  label: string;
  value: string;
  iconColor?: string;
  last?: boolean;
}

function InfoRow({ icon, label, value, iconColor = Colors.primary, last = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <View style={[styles.infoIconBg, { backgroundColor: iconColor + '14' }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

interface CardProps {
  icon: IoniconsName;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

function SectionCard({ icon, title, accentColor, children }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardTitleRow, { borderLeftColor: accentColor }]}>
        <View style={[styles.cardIconBg, { backgroundColor: accentColor + '14' }]}>
          <Ionicons name={icon} size={15} color={accentColor} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function PerfilPetScreen() {
  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Perfil da Luna</Text>
          <Text style={styles.headerSub}>Golden Retriever • 5 anos</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.photoRing}>
            <Image source={{ uri: pet.photo }} style={styles.petPhoto} resizeMode="cover" />
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.heroName}>{pet.name}</Text>
          <Text style={styles.heroBreed}>{pet.breed}</Text>
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Ionicons name="female" size={11} color={Colors.primary} />
              <Text style={styles.tagText}>{pet.gender}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={11} color={Colors.success} />
              <Text style={[styles.tagText, { color: Colors.success }]}>Saudável</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.warningLight }]}>
              <Ionicons name="star" size={11} color={Colors.warning} />
              <Text style={[styles.tagText, { color: Colors.warning }]}>Vacinada</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { val: String(pet.age), unit: 'anos', lbl: 'Idade' },
            { val: String(pet.weight), unit: 'kg', lbl: 'Peso' },
            { val: '3', unit: 'vacs', lbl: 'Vacinas' },
            { val: '8', unit: 'eventos', lbl: 'Histórico' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.lbl}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statUnit}>{s.unit}</Text>
                <Text style={styles.statLbl}>{s.lbl}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statSep} />}
            </React.Fragment>
          ))}
        </View>

        <SectionCard icon="information-circle" title="Informações Básicas" accentColor={Colors.primary}>
          <InfoRow icon="paw" label="Nome" value={pet.name} />
          <InfoRow icon="ribbon" label="Raça" value={pet.breed} />
          <InfoRow icon="calendar" label="Data de Nascimento" value={pet.birthday} />
          <InfoRow icon="female" label="Sexo" value={pet.gender} iconColor="#EC4899" />
          <InfoRow icon="color-palette" label="Pelagem" value={pet.color} iconColor={Colors.warning} last />
        </SectionCard>

        <SectionCard icon="fitness" title="Dados Físicos" accentColor={Colors.success}>
          <InfoRow icon="barbell" label="Peso Atual" value={`${pet.weight} kg`} iconColor={Colors.success} />
          <InfoRow icon="body" label="Porte" value="Grande (acima de 25 kg)" iconColor={Colors.success} />
          <InfoRow icon="heart-circle" label="Status de Saúde" value="Saudável" iconColor={Colors.success} />
          <InfoRow icon="nutrition" label="Dieta" value="Ração Premium — 350g/dia" iconColor={Colors.success} last />
        </SectionCard>

        <SectionCard icon="shield-checkmark" title="Identificação" accentColor={Colors.purple}>
          <InfoRow icon="qr-code" label="Microchip" value={pet.chip} iconColor={Colors.purple} />
          <InfoRow icon="person" label="Responsável" value={pet.owner} iconColor={Colors.purple} />
          <InfoRow icon="location" label="Cidade" value="São Paulo, SP" iconColor={Colors.purple} />
          <InfoRow icon="call" label="Contato" value="(11) 99999-8888" iconColor={Colors.purple} last />
        </SectionCard>

        <SectionCard icon="medkit" title="Veterinário de Referência" accentColor={Colors.danger}>
          <InfoRow icon="person-circle" label="Veterinário" value="Dr. Gabriel Maciel" iconColor={Colors.danger} />
          <InfoRow icon="business" label="Clínica" value="Clínica VetSaúde" iconColor={Colors.danger} />
          <InfoRow icon="call" label="Telefone" value="(11) 3456-7890" iconColor={Colors.danger} />
          <InfoRow icon="time" label="Última Consulta" value="10/09/2024" iconColor={Colors.danger} last />
        </SectionCard>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: Colors.darkBlue,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 5,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingTop: 16,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  editBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
  },
  photoRing: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  petPhoto: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroBreed: {
    fontSize: 14,
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
    backgroundColor: Colors.primaryLight,
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
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  statUnit: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: -1,
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 3,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingLeft: 10,
    borderLeftWidth: 3,
  },
  cardIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconBg: {
    width: 34,
    height: 34,
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
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});