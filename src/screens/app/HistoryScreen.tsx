import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/Colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface HistoryEventItem {
  id: string;
  type: 'consulta' | 'vacina' | 'exame' | 'cirurgia' | 'banho' | 'outros';
  title: string;
  date: string;
  description: string;
  veterinarian?: string;
  clinic?: string;
  cost?: string;
}

const DEFAULT_EVENTS: HistoryEventItem[] = [
  {
    id: '1',
    type: 'consulta',
    title: 'Check-up Anual Preventivo',
    date: '15/03/2024',
    description: 'Exame clínico geral completo, auscultação cardíaca e avaliação dentária.',
    veterinarian: 'Dr. Gabriel Maciel',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 180,00',
  },
  {
    id: '2',
    type: 'vacina',
    title: 'Aplicação da Vacina V10 e Antirrábica',
    date: '10/03/2024',
    description: 'Imunização anual contra 10 cepas virais e raiva.',
    veterinarian: 'Dr. Gabriel Maciel',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 220,00',
  },
  {
    id: '3',
    type: 'exame',
    title: 'Hemograma Completo e Perfil Bioquímico',
    date: '20/11/2023',
    description: 'Avaliação da função renal, hepática e contagem de plaquetas.',
    veterinarian: 'Dra. Vitória Martins',
    clinic: 'PetClínic Center',
    cost: 'R$ 310,00',
  },
  {
    id: '4',
    type: 'banho',
    title: 'Banho Terapêutico e Tosa Higiênica',
    date: '02/02/2024',
    description: 'Higiene com shampoo hipoalergênico e corte de unhas.',
    veterinarian: 'Equipe de Estética',
    clinic: 'PetCare Spa',
    cost: 'R$ 95,00',
  },
];

interface EventTypeConfig {
  label: string;
  color: string;
  bg: string;
  icon: IoniconsName;
}

const eventTypeConfig: Record<HistoryEventItem['type'], EventTypeConfig> = {
  consulta: { label: 'Consulta', color: Colors.primary, bg: Colors.primaryLight, icon: 'medical-outline' },
  vacina: { label: 'Vacina', color: Colors.success, bg: Colors.successLight, icon: 'shield-checkmark-outline' },
  exame: { label: 'Exame', color: Colors.purple, bg: Colors.purpleLight, icon: 'flask-outline' },
  cirurgia: { label: 'Cirurgia', color: Colors.danger, bg: Colors.dangerLight, icon: 'cut-outline' },
  banho: { label: 'Banho & Tosa', color: Colors.teal, bg: Colors.tealLight, icon: 'water-outline' },
  outros: { label: 'Outros', color: Colors.textLight, bg: Colors.borderLight, icon: 'ellipsis-horizontal-outline' },
};

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filteredEvents = DEFAULT_EVENTS.filter((e) => {
    if (selectedFilter === 'todos') return true;
    return e.type === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico Clínico</Text>
        <Text style={styles.subtitle}>Linha do tempo médica e procedimentos</Text>

        {/* Filtro Rápido */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {['todos', 'consulta', 'vacina', 'exame', 'banho'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, selectedFilter === f && styles.filterBtnActive]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text style={[styles.filterBtnText, selectedFilter === f && styles.filterBtnTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {filteredEvents.map((event, idx) => {
          const cfg = eventTypeConfig[event.type];
          const isLast = idx === filteredEvents.length - 1;

          return (
            <View key={event.id} style={styles.timelineItem}>
              <View style={styles.timelineSide}>
                <View style={[styles.dotOuter, { borderColor: cfg.color + '40' }]}>
                  <View style={[styles.dotInner, { backgroundColor: cfg.color }]}>
                    <Ionicons name={cfg.icon} size={14} color={Colors.white} />
                  </View>
                </View>
                {!isLast && <View style={[styles.timelineLine, { backgroundColor: cfg.color + '30' }]} />}
              </View>

              <View style={[styles.eventCard, { borderLeftColor: cfg.color }]}>
                <View style={styles.eventHeader}>
                  <View style={[styles.eventBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.eventBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDesc}>{event.description}</Text>

                <View style={styles.eventMeta}>
                  {event.veterinarian && (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{event.veterinarian}</Text>
                    </View>
                  )}
                  {event.clinic && (
                    <View style={styles.metaRow}>
                      <Ionicons name="business-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{event.clinic}</Text>
                    </View>
                  )}
                  {event.cost && (
                    <View style={styles.metaRow}>
                      <Ionicons name="cash-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{event.cost}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
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
    paddingBottom: 16,
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
    marginBottom: 12,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
  },
  filterBtnText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: Colors.white,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineSide: {
    width: 32,
    alignItems: 'center',
    marginRight: 10,
  },
  dotOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  dotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eventBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 16,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textBody,
  },
});
