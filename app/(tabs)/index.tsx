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

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View style={styles.activityCard}>
      <View style={[styles.activityIconContainer, { backgroundColor: activity.color + '20' }]}>
        <Ionicons name={activity.icon as IoniconsName} size={22} color={activity.color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDate}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} /> {activity.date}
        </Text>
      </View>
      <View style={[styles.activityBadge, { backgroundColor: activity.color + '15' }]}>
        <Text style={[styles.activityBadgeText, { color: activity.color }]}>
          {activity.type === 'vacina' ? 'Vacina' : activity.type === 'consulta' ? 'Consulta' : 'Banho'}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const sortedActivities = [...upcomingActivities].sort((a, b) => {
    const parseDate = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    };
    return parseDate(a.date) - parseDate(b.date);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Olá, Thomas! 👋</Text>
            <Text style={styles.headerSubtitle}>Como está a Luna hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Card */}
        <View style={styles.petCard}>
          <View style={styles.petCardContent}>
            <Image
              source={{ uri: pet.photo }}
              style={styles.petPhoto}
              resizeMode="cover"
            />
            <View style={styles.petInfo}>
              <View style={styles.petNameRow}>
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.genderBadge}>
                  <Ionicons name="female" size={12} color={Colors.primary} />
                  <Text style={styles.genderText}>{pet.gender}</Text>
                </View>
              </View>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <View style={styles.petStatsRow}>
                <View style={styles.petStat}>
                  <Text style={styles.petStatValue}>{pet.age} anos</Text>
                  <Text style={styles.petStatLabel}>Idade</Text>
                </View>
                <View style={styles.petStatDivider} />
                <View style={styles.petStat}>
                  <Text style={styles.petStatValue}>{pet.weight} kg</Text>
                  <Text style={styles.petStatLabel}>Peso</Text>
                </View>
                <View style={styles.petStatDivider} />
                <View style={styles.petStat}>
                  <Text style={styles.petStatValue}>{pet.color}</Text>
                  <Text style={styles.petStatLabel}>Cor</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.healthStatusBar}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.healthStatusText}>Saúde em dia — Última consulta: 10/09/2024</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Resumo Rápido</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EEF3FF' }]}>
            <Ionicons name="medical" size={24} color={Colors.primary} />
            <Text style={styles.statCardValue}>2</Text>
            <Text style={styles.statCardLabel}>Vacinas{'\n'}Pendentes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF4E6' }]}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={[styles.statCardValue, { color: '#F59E0B' }]}>8</Text>
            <Text style={styles.statCardLabel}>Eventos no{'\n'}Histórico</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E6FBF4' }]}>
            <Ionicons name="people" size={24} color={Colors.success} />
            <Text style={[styles.statCardValue, { color: Colors.success }]}>6</Text>
            <Text style={styles.statCardLabel}>Especialistas{'\n'}Disponíveis</Text>
          </View>
        </View>

        {/* Upcoming Activities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Atividades</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesList}>
          {sortedActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>

        {/* Tip Banner */}
        <View style={styles.tipBanner}>
          <View style={styles.tipIconContainer}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica do Dia</Text>
            <Text style={styles.tipText}>
              Golden Retrievers precisam de escovação 3-4x por semana. Isso reduz a queda de pelos e mantém o pelo saudável!
            </Text>
          </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  petCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  petPhoto: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: Colors.border,
  },
  petInfo: {
    flex: 1,
    marginLeft: 14,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  genderText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  petBreed: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
    marginBottom: 10,
  },
  petStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petStat: {
    alignItems: 'center',
    flex: 1,
  },
  petStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  petStatLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  petStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  healthStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  healthStatusText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 6,
  },
  statCardLabel: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
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
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
    marginBottom: 8,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },
  bottomSpacer: {
    height: 20,
  },
});
