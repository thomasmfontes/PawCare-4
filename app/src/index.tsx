import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { pet, upcomingActivities } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface Activity {
  id: string;
  title: string;
  date: string;
  type: string;
  icon: string;
  color: string;
}

const typeLabel: Record<string, string> = {
  vacina: 'Vacina',
  consulta: 'Consulta',
  banho: 'Banho',
  exame: 'Exame',
};

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View style={[styles.activityCard, { borderLeftColor: activity.color }]}>
      <View style={[styles.activityIconBg, { backgroundColor: activity.color + '18' }]}>
        <Ionicons name={activity.icon as IoniconsName} size={20} color={activity.color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <View style={styles.activityDateRow}>
          <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.activityDate}>{activity.date}</Text>
        </View>
      </View>
      <View style={[styles.activityBadge, { backgroundColor: activity.color + '14' }]}>
        <Text style={[styles.activityBadgeText, { color: activity.color }]}>
          {typeLabel[activity.type] ?? activity.type}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const sortedActivities = [...upcomingActivities].sort((a, b) => {
    const parse = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    };
    return parse(a.date) - parse(b.date);
  });

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Olá, Thomas!</Text>
            <Text style={styles.headerSubtitle}>Como está a Luna hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.petCard}>
          <View style={styles.petCardRow}>
            <Image source={{ uri: pet.photo }} style={styles.petPhoto} resizeMode="cover" />
            <View style={styles.petInfo}>
              <View style={styles.petNameRow}>
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.genderBadge}>
                  <Ionicons name="female" size={11} color={Colors.primary} />
                  <Text style={styles.genderText}>{pet.gender}</Text>
                </View>
              </View>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <View style={styles.petStatsRow}>
                <View style={styles.petStat}>
                  <Text style={styles.petStatVal}>{pet.age}</Text>
                  <Text style={styles.petStatUnit}>anos</Text>
                  <Text style={styles.petStatLbl}>Idade</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.petStat}>
                  <Text style={styles.petStatVal}>{pet.weight}</Text>
                  <Text style={styles.petStatUnit}>kg</Text>
                  <Text style={styles.petStatLbl}>Peso</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.petStat}>
                  <Text style={styles.petStatVal}>{pet.color}</Text>
                  <Text style={styles.petStatUnit}> </Text>
                  <Text style={styles.petStatLbl}>Pelagem</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.healthBar}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.healthBarText}>Saúde em dia — Última consulta: 10/09/2024</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>RESUMO RÁPIDO</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors.primaryLight }]}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.statCardVal, { color: Colors.primary }]}>2</Text>
            <Text style={styles.statCardLbl}>Vacinas{'\n'}Pendentes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.warningLight }]}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.warning + '20' }]}>
              <Ionicons name="time" size={20} color={Colors.warning} />
            </View>
            <Text style={[styles.statCardVal, { color: Colors.warning }]}>8</Text>
            <Text style={styles.statCardLbl}>Eventos no{'\n'}Histórico</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <View style={[styles.statIconBg, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="people" size={20} color={Colors.success} />
            </View>
            <Text style={[styles.statCardVal, { color: Colors.success }]}>6</Text>
            <Text style={styles.statCardLbl}>Veterinários{'\n'}Disponíveis</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>PRÓXIMAS ATIVIDADES</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activitiesList}>
          {sortedActivities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </View>

        <View style={styles.tipBanner}>
          <View style={styles.tipIconBg}>
            <Ionicons name="bulb" size={22} color={Colors.warning} />
          </View>
          <View style={styles.tipBody}>
            <Text style={styles.tipTitle}>Dica do Dia</Text>
            <Text style={styles.tipText}>
              Golden Retrievers precisam de escovação 3–4x por semana. Isso reduz a queda de pelos e mantém o pelo saudável!
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: Colors.darkBlue,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  notifBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1.5,
    borderColor: Colors.darkBlue,
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
  petCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
  },
  petCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  petPhoto: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  petInfo: {
    flex: 1,
    marginLeft: 14,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  petName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    gap: 3,
  },
  genderText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  petBreed: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 12,
  },
  petStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petStat: {
    flex: 1,
    alignItems: 'center',
  },
  petStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  petStatUnit: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: -2,
  },
  petStatLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 7,
  },
  healthBarText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardVal: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statCardLbl: {
    fontSize: 10,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  activitiesList: {
    gap: 10,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  activityIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  activityDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tipBanner: {
    backgroundColor: Colors.warningLight,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
    gap: 12,
    marginBottom: 8,
  },
  tipIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBody: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },
});