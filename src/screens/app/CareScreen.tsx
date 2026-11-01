import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface CareGuide {
  id: string;
  title: string;
  category: string;
  frequency: string;
  icon: IoniconsName;
  color: string;
  tips: string[];
}

interface RoutineItem {
  id: string;
  label: string;
  period: string;
  icon: IoniconsName;
  completed: boolean;
}

const CARE_GUIDES: CareGuide[] = [
  {
    id: '1',
    title: 'Alimentação & Hidratação',
    category: 'Nutrição',
    frequency: 'Diária',
    icon: 'restaurant-outline',
    color: '#2F6BFF',
    tips: [
      'Forneça ração super premium dividida em 2 porções diárias equilibradas.',
      'Mantenha sempre água fresca e filtrada em múltiplos recipientes pela casa.',
      'Evite alimentos tóxicos para pets: chocolate, uva, cebola e alho.',
    ],
  },
  {
    id: '2',
    title: 'Higiene & Pelagem',
    category: 'Estética & Saúde',
    frequency: 'Semanal',
    icon: 'water-outline',
    color: '#0EA5C9',
    tips: [
      'Escovação da pelagem 3 a 4 vezes por semana para evitar nós e queda excessiva.',
      'Limpeza das orelhas com solução veterinária neutra semanalmente.',
      'Banho com shampoo hipoalergênico a cada 15 a 20 dias.',
    ],
  },
  {
    id: '3',
    title: 'Exercício & Atividade Física',
    category: 'Bem-estar',
    frequency: 'Diária',
    icon: 'bicycle-outline',
    color: '#10B981',
    tips: [
      'Caminhada matinal e noturna de pelo menos 40 minutos para controle de energia.',
      'Brincadeiras cognitivas com bolinha e busca para estímulo mental.',
      'Evite passeios nos horários de sol forte para prevenir queimaduras nas patas.',
    ],
  },
  {
    id: '4',
    title: 'Saúde Preventiva & Parasitas',
    category: 'Medicina Preventiva',
    frequency: 'Mensal',
    icon: 'shield-checkmark-outline',
    color: '#8B5CF6',
    tips: [
      'Aplicação rigorosa de vermífugo e coleira ou comprimido contra pulgas e carrapatos.',
      'Checagem periódica das gengivas e dentes para prevenir tártaro.',
      'Consulta de rotina a cada 6 meses com o médico veterinário de confiança.',
    ],
  },
];

const INITIAL_ROUTINE: RoutineItem[] = [
  { id: 'r1', label: 'Ração matinal balanceada', period: 'Manhã', icon: 'restaurant-outline', completed: false },
  { id: 'r2', label: 'Troca de água fresca e filtrada', period: 'Manhã', icon: 'water-outline', completed: false },
  { id: 'r3', label: 'Passeio e estímulo físico (30 min)', period: 'Tarde', icon: 'walk-outline', completed: false },
  { id: 'r4', label: 'Escovação de pelos / Limpeza das patas', period: 'Tarde', icon: 'sparkles-outline', completed: false },
  { id: 'r5', label: 'Refeição noturna e verificação de saúde', period: 'Noite', icon: 'moon-outline', completed: false },
];

const ROUTINE_STORAGE_KEY = '@pawcare:daily_routine_v2';

export default function CareScreen() {
  const { colors, isDark } = useTheme();
  const { notifyCareCompleted } = useNotifications();

  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINE);

  useEffect(() => {
    async function loadRoutine() {
      try {
        const stored = await AsyncStorage.getItem(ROUTINE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRoutines(parsed);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar rotina diária:', e);
      }
    }
    loadRoutine();
  }, []);

  const toggleRoutine = async (id: string) => {
    const updated = routines.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          notifyCareCompleted(item.label);
        }
        return { ...item, completed: nextState };
      }
      return item;
    });

    setRoutines(updated);
    try {
      await AsyncStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar rotina:', e);
    }
  };

  const resetRoutine = () => {
    Alert.alert(
      'Reiniciar Rotina',
      'Deseja desmarcar todas as tarefas e recomeçar a rotina diária?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: async () => {
            const reset = routines.map((r) => ({ ...r, completed: false }));
            setRoutines(reset);
            await AsyncStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(reset));
          },
        },
      ]
    );
  };

  const getPeriodBadge = (period: string) => {
    switch (period) {
      case 'Manhã':
        return { label: 'Manhã', bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', color: '#D97706', icon: 'sunny-outline' as const };
      case 'Tarde':
        return { label: 'Tarde', bg: isDark ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE', color: '#0284C7', icon: 'partly-sunny-outline' as const };
      case 'Noite':
        return { label: 'Noite', bg: isDark ? 'rgba(139, 92, 246, 0.15)' : '#EDE9FE', color: '#7C3AED', icon: 'moon-outline' as const };
      default:
        return { label: period, bg: colors.inputBg, color: colors.textMuted, icon: 'time-outline' as const };
    }
  };

  const completedCount = routines.filter((r) => r.completed).length;
  const progressPercent = Math.round((completedCount / routines.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.darkBlue }]}>
        <Text style={styles.title}>Guia & Rotina de Cuidados</Text>
        <Text style={styles.subtitle}>Checklist diário e recomendações de bem-estar</Text>

        {/* Progress Bar Diário */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Checklist de Hoje:</Text>
            <Text style={styles.progressValue}>
              {completedCount}/{routines.length} ({progressPercent}%)
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: colors.success }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Seção Checklist Interativo de Hoje */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Rotina Diária do Pet</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              {completedCount} de {routines.length} tarefas concluídas hoje
            </Text>
          </View>
          {completedCount > 0 && (
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={resetRoutine}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="refresh-outline" size={14} color={colors.textLight} />
              <Text style={[styles.resetBtnText, { color: colors.textLight }]}>Resetar</Text>
            </TouchableOpacity>
          )}
        </View>

        {progressPercent === 100 && (
          <View style={[styles.celebrationCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', borderColor: colors.success }]}>
            <Ionicons name="sparkles" size={20} color={colors.success} />
            <Text style={[styles.celebrationText, { color: colors.success }]}>
              Parabéns! Todos os cuidados diários foram concluídos hoje!
            </Text>
          </View>
        )}

        <View style={styles.routineList}>
          {routines.map((item) => {
            const badge = getPeriodBadge(item.period);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.routineItemCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: item.completed ? (isDark ? 'rgba(16, 185, 129, 0.3)' : '#BBF7D0') : colors.border,
                    borderWidth: 1,
                  },
                  item.completed && { opacity: 0.88 },
                ]}
                onPress={() => toggleRoutine(item.id)}
                activeOpacity={0.7}
              >
                {/* Checkbox Circular */}
                <View
                  style={[
                    styles.checkbox,
                    item.completed
                      ? { backgroundColor: colors.success, borderColor: colors.success }
                      : { borderColor: colors.border, backgroundColor: colors.inputBg },
                  ]}
                >
                  {item.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>

                {/* Ícone da Tarefa em Badge Redondo */}
                <View
                  style={[
                    styles.taskIconCircle,
                    {
                      backgroundColor: item.completed
                        ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7')
                        : colors.inputBg,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.completed ? colors.success : colors.primary}
                  />
                </View>

                {/* Descrição e Período */}
                <View style={styles.routineTextContainer}>
                  <Text
                    style={[
                      styles.routineLabel,
                      { color: colors.text },
                      item.completed && [styles.routineCompletedLabel, { color: colors.textMuted }],
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View style={styles.periodBadgeRow}>
                    <View style={[styles.periodBadge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon} size={11} color={badge.color} style={{ marginRight: 4 }} />
                      <Text style={[styles.periodBadgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Seção Guias Educativos */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
          Guias e Recomendações
        </Text>

        {CARE_GUIDES.map((card) => {
          const isExpanded = expandedId === card.id;
          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.guideCard,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
              activeOpacity={0.9}
              onPress={() => setExpandedId(isExpanded ? null : card.id)}
            >
              <View style={[styles.cardHeader, { backgroundColor: card.color }]}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={card.icon} size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardCategory}>
                      {card.category} • {card.frequency}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              {isExpanded && (
                <View style={styles.cardBody}>
                  {card.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <View style={[styles.tipBullet, { backgroundColor: card.color }]} />
                      <Text style={[styles.tipText, { color: colors.textBody }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressValue: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  celebrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  celebrationText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  routineList: {
    gap: 10,
  },
  routineItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routineTextContainer: {
    flex: 1,
  },
  routineLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  routineCompletedLabel: {
    textDecorationLine: 'line-through',
  },
  periodBadgeRow: {
    flexDirection: 'row',
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  guideCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardCategory: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 10,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
