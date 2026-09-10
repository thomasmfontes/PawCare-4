import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/Colors';

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

const CARE_GUIDES: CareGuide[] = [
  {
    id: '1',
    title: 'Alimentação & Hidratação',
    category: 'Nutrição',
    frequency: 'Diária',
    icon: 'restaurant-outline',
    color: Colors.primary,
    tips: [
      'Forneça ração super premium dividida em 2 porções diárias de 180g.',
      'Mantenha sempre água fresca e filtrada em múltiplos recipientes pela casa.',
      'Evite alimentos tóxicos para cães: chocolate, uva, cebola e alho.',
    ],
  },
  {
    id: '2',
    title: 'Higiene & Pelagem',
    category: 'Estética & Saúde',
    frequency: 'Semanal',
    icon: 'water-outline',
    color: Colors.teal,
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
    color: Colors.success,
    tips: [
      'Caminhada matinal e noturna de pelo menos 40 minutos para controle de peso e energia.',
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
    color: Colors.purple,
    tips: [
      'Aplicação rigorosa de vermífugo e coleira ou comprimido contra pulgas e carrapatos.',
      'Checagem periódica das gengivas e dentes para prevenir tártaro.',
      'Consulta de rotina a cada 6 meses com o médico veterinário de confiança.',
    ],
  },
];

export default function CareScreen() {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Guia de Cuidados</Text>
        <Text style={styles.subtitle}>Rotinas e recomendações para a saúde do pet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {CARE_GUIDES.map((card) => {
          const isExpanded = expandedId === card.id;
          return (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => toggleExpand(card.id)}
            >
              <View style={[styles.cardHeader, { backgroundColor: card.color }]}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={card.icon} size={22} color={Colors.white} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardCategory}>{card.category}</Text>
                  </View>
                </View>
                <View style={styles.cardHeaderRight}>
                  <View style={styles.freqBadge}>
                    <Text style={styles.freqText}>{card.frequency}</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.white}
                  />
                </View>
              </View>

              <View style={styles.cardBody}>
                {card.tips.map((tip, idx) => {
                  if (!isExpanded && idx > 0) return null;
                  return (
                    <View key={idx} style={styles.tipRow}>
                      <View style={[styles.tipIndex, { backgroundColor: card.color }]}>
                        <Text style={styles.tipIndexText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  );
                })}

                {!isExpanded && card.tips.length > 1 && (
                  <Text style={[styles.expandHint, { color: card.color }]}>
                    Toque para ver mais {card.tips.length - 1} dicas...
                  </Text>
                )}
              </View>
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
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  cardCategory: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freqBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freqText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  cardBody: {
    padding: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  tipIndex: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tipIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textBody,
    lineHeight: 18,
  },
  expandHint: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
});
