import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { usePets } from '../../hooks/usePets';
import { useVaccines } from '../../hooks/useVaccines';
import { useTheme } from '../../hooks/useTheme';
import Loader from '../../components/Loader';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '../../routes/AppRoutes';

type HomeScreenNavProp = any;

interface HomeScreenProps {
  navigation: HomeScreenNavProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { pets, isLoading: loadingPets, refetch: refetchPets, isRefetching: refetchingPets } = usePets();
  const { vaccines, isLoading: loadingVaccines, refetch: refetchVaccines, isRefetching: refetchingVaccines } = useVaccines();

  const activePet = pets.length > 0 ? pets[0] : null;
  const pendingVaccines = vaccines.filter((v) => v.status === 'pending' || v.status === 'overdue');
  const doneVaccines = vaccines.filter((v) => v.status === 'done');

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchPets(),
        refetchVaccines(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } catch (e) {
      console.warn('Erro ao atualizar tela inicial:', e);
    } finally {
      setRefreshing(false);
    }
  };

  if (loadingPets && loadingVaccines && !pets.length) {
    return <Loader message="Carregando dados da sua conta..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor="#FFFFFF"
            progressBackgroundColor={colors.cardBg}
          />
        }
      >
        {/* Header superior padronizado */}
        <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Olá, {user?.email?.split('@')[0] || 'Tutor'}! 🐾</Text>
            <Text style={styles.subtitle}>
              {activePet ? `Como está ${activePet.name} hoje?` : 'Bem-vindo ao PawCare'}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            {/* Alternador rápido de tema claro/escuro */}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={toggleTheme}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Alternar tema claro/escuro"
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Acesso rápido à tela Sobre o App (Requisito da Sprint 4) */}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate('About')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Sobre o App"
            >
              <Ionicons name="information-circle-outline" size={21} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={logout}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Sair da conta"
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats em tempo real vindos do Firebase */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pets.length}</Text>
            <Text style={styles.statLabel}>Pets Cadastrados</Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[
                styles.statNumber,
                { color: pendingVaccines.length > 0 ? colors.danger : colors.success },
              ]}
            >
              {pendingVaccines.length}
            </Text>
            <Text style={styles.statLabel}>Vacinas Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{doneVaccines.length}</Text>
            <Text style={styles.statLabel}>Doses Aplicadas</Text>
          </View>
        </View>
      </View>

        <View style={styles.body}>
        {/* Card do Pet Ativo */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pet em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Pets')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todos ({pets.length})</Text>
          </TouchableOpacity>
        </View>

        {activePet ? (
          <View
            style={[
              styles.petCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
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
                <Text style={[styles.petName, { color: colors.text }]}>{activePet.name}</Text>
                <View style={[styles.badgeGender, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.badgeGenderText, { color: colors.primary }]}>{activePet.gender}</Text>
                </View>
              </View>
              <Text style={[styles.petBreed, { color: colors.textLight }]}>{activePet.breed}</Text>
              <View style={styles.petStatsRow}>
                <Text style={[styles.petStatPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                  {activePet.age} anos
                </Text>
                <Text style={[styles.petStatPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                  {activePet.weight} kg
                </Text>
                <Text style={[styles.petStatPill, { backgroundColor: colors.inputBg, color: colors.textBody }]}>
                  {activePet.color}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.emptyPetCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate('Pets')}
          >
            <Ionicons name="add-circle-outline" size={40} color={colors.primary} />
            <Text style={[styles.emptyPetTitle, { color: colors.text }]}>Nenhum pet cadastrado ainda</Text>
            <Text style={[styles.emptyPetSubtitle, { color: colors.textLight }]}>
              Toque aqui para cadastrar seu primeiro companheiro
            </Text>
          </TouchableOpacity>
        )}

        {/* Alertas de Vacinas Próximas */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas Vacinas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vaccines')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Gerenciar</Text>
          </TouchableOpacity>
        </View>

        {pendingVaccines.length > 0 ? (
          pendingVaccines.slice(0, 3).map((vac) => (
            <View
              key={vac.id}
              style={[
                styles.vaccineCard,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  borderWidth: isDark ? 1 : 0,
                  borderLeftWidth: 4,
                  borderLeftColor: vac.status === 'overdue' ? colors.danger : colors.warning,
                },
              ]}
            >
              <View style={[styles.vaccineIconBg, { backgroundColor: colors.inputBg }]}>
                <Ionicons
                  name={vac.status === 'overdue' ? 'alert-circle' : 'medical'}
                  size={22}
                  color={vac.status === 'overdue' ? colors.danger : colors.warning}
                />
              </View>
              <View style={styles.vaccineInfo}>
                <Text style={[styles.vaccineName, { color: colors.text }]}>{vac.name}</Text>
                <Text style={[styles.vaccineDate, { color: colors.textLight }]}>
                  Dose prevista: {vac.nextDate}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      vac.status === 'overdue' ? colors.dangerLight : colors.warningLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: vac.status === 'overdue' ? colors.danger : colors.warning },
                  ]}
                >
                  {vac.status === 'overdue' ? 'Atrasada' : 'Pendente'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-circle-outline" size={30} color={colors.success} />
            <Text style={[styles.emptyBoxText, { color: colors.success }]}>
              Todas as vacinas estão em dia!
            </Text>
          </View>
        )}

        {/* Dica de Cuidado Inteligente */}
        <View style={[styles.tipCard, { backgroundColor: isDark ? colors.cardBg : colors.warningLight, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={[styles.tipIconBg, { backgroundColor: isDark ? colors.inputBg : '#FFFFFF' }]}>
            <Ionicons name="bulb" size={24} color={colors.warning} />
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.warning }]}>Dica do Dia</Text>
            <Text style={[styles.tipText, { color: colors.textBody }]}>
              Manter a carteira de vacinas sincronizada garante a imunidade e previne doenças como Cinomose e Parvovirose.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
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
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
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
  },
  badgeGender: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeGenderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  petBreed: {
    fontSize: 13,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  emptyPetCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  emptyPetTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyPetSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  vaccineIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  vaccineDate: {
    fontSize: 12,
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
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  emptyBoxText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
