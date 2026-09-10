import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/Colors';
import { useAuth } from '../../hooks/useAuth';
import { usePets } from '../../hooks/usePets';
import { useVaccines } from '../../hooks/useVaccines';
import Loader from '../../components/Loader';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../../routes/AppRoutes';

type HomeScreenNavProp = BottomTabNavigationProp<AppTabParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, logout } = useAuth();
  const { pets, isLoading: loadingPets, refetch: refetchPets, isRefetching: refetchingPets } = usePets();
  const { vaccines, isLoading: loadingVaccines, refetch: refetchVaccines, isRefetching: refetchingVaccines } = useVaccines();

  const activePet = pets.length > 0 ? pets[0] : null;
  const pendingVaccines = vaccines.filter((v) => v.status === 'pending' || v.status === 'overdue');
  const doneVaccines = vaccines.filter((v) => v.status === 'done');

  const isRefreshing = refetchingPets || refetchingVaccines;

  const onRefresh = () => {
    refetchPets();
    refetchVaccines();
  };

  if (loadingPets && loadingVaccines && !pets.length) {
    return <Loader message="Carregando dados da sua conta..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header superior padronizado */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.email?.split('@')[0] || 'Tutor'}! 🐾</Text>
            <Text style={styles.subtitle}>
              {activePet ? `Como está ${activePet.name} hoje?` : 'Bem-vindo ao PawCare'}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="log-out-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats em tempo real vindos do Firebase */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pets.length}</Text>
            <Text style={styles.statLabel}>Pets Cadastrados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: pendingVaccines.length > 0 ? Colors.danger : Colors.success }]}>
              {pendingVaccines.length}
            </Text>
            <Text style={styles.statLabel}>Vacinas Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>{doneVaccines.length}</Text>
            <Text style={styles.statLabel}>Doses Aplicadas</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Card do Pet Ativo */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pet em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Pets')}>
            <Text style={styles.seeAllText}>Ver todos ({pets.length})</Text>
          </TouchableOpacity>
        </View>

        {activePet ? (
          <View style={styles.petCard}>
            <Image
              source={{
                uri:
                  activePet.photo ||
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60',
              }}
              style={styles.petPhoto}
            />
            <View style={styles.petDetails}>
              <View style={styles.petNameRow}>
                <Text style={styles.petName}>{activePet.name}</Text>
                <View style={styles.badgeGender}>
                  <Text style={styles.badgeGenderText}>{activePet.gender}</Text>
                </View>
              </View>
              <Text style={styles.petBreed}>{activePet.breed}</Text>
              <View style={styles.petStatsRow}>
                <Text style={styles.petStatPill}>{activePet.age} anos</Text>
                <Text style={styles.petStatPill}>{activePet.weight} kg</Text>
                <Text style={styles.petStatPill}>{activePet.color}</Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyPetCard} onPress={() => navigation.navigate('Pets')}>
            <Ionicons name="add-circle-outline" size={40} color={Colors.primary} />
            <Text style={styles.emptyPetTitle}>Nenhum pet cadastrado ainda</Text>
            <Text style={styles.emptyPetSubtitle}>Toque aqui para cadastrar seu primeiro companheiro</Text>
          </TouchableOpacity>
        )}

        {/* Alertas de Vacinas Próximas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Vacinas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vaccines')}>
            <Text style={styles.seeAllText}>Gerenciar</Text>
          </TouchableOpacity>
        </View>

        {pendingVaccines.length > 0 ? (
          pendingVaccines.slice(0, 3).map((vac) => (
            <View
              key={vac.id}
              style={[
                styles.vaccineCard,
                { borderLeftColor: vac.status === 'overdue' ? Colors.danger : Colors.warning },
              ]}
            >
              <View style={styles.vaccineIconBg}>
                <Ionicons
                  name={vac.status === 'overdue' ? 'alert-circle' : 'medical'}
                  size={22}
                  color={vac.status === 'overdue' ? Colors.danger : Colors.warning}
                />
              </View>
              <View style={styles.vaccineInfo}>
                <Text style={styles.vaccineName}>{vac.name}</Text>
                <Text style={styles.vaccineDate}>Dose prevista: {vac.nextDate}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: vac.status === 'overdue' ? Colors.dangerLight : Colors.warningLight },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: vac.status === 'overdue' ? Colors.danger : Colors.warning },
                  ]}
                >
                  {vac.status === 'overdue' ? 'Atrasada' : 'Pendente'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-circle-outline" size={32} color={Colors.success} />
            <Text style={styles.emptyBoxText}>Todas as vacinas estão em dia!</Text>
          </View>
        )}

        {/* Dica de Cuidado Inteligente */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBg}>
            <Ionicons name="bulb" size={24} color={Colors.warning} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica do Dia</Text>
            <Text style={styles.tipText}>
              Manter a carteira de vacinas sincronizada garante a imunidade e previne doenças como Cinomose e Parvovirose.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  petPhoto: {
    width: 74,
    height: 74,
    borderRadius: 37,
    marginRight: 14,
  },
  petDetails: {
    flex: 1,
  },
  petNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  badgeGender: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeGenderText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  petBreed: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
    marginBottom: 8,
  },
  petStatsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  petStatPill: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textBody,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  emptyPetCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  emptyPetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  emptyPetSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  vaccineIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  vaccineDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  emptyBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    alignItems: 'center',
    gap: 12,
  },
  tipIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
  },
  tipText: {
    fontSize: 12,
    color: Colors.textBody,
    marginTop: 2,
    lineHeight: 16,
  },
});
