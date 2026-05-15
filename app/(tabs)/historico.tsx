import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { historyEvents, HistoryEvent } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface EventTypeConfig {
  label: string;
  color: string;
  bg: string;
  icon: IoniconsName;
}

const eventTypeConfig: Record<HistoryEvent['type'], EventTypeConfig> = {
  consulta: {
    label: 'Consulta',
    color: Colors.primary,
    bg: Colors.primary + '15',
    icon: 'medical-outline',
  },
  vacina: {
    label: 'Vacina',
    color: Colors.success,
    bg: Colors.success + '15',
    icon: 'shield-checkmark-outline',
  },
  exame: {
    label: 'Exame',
    color: '#8B5CF6',
    bg: '#8B5CF615',
    icon: 'flask-outline',
  },
  cirurgia: {
    label: 'Cirurgia',
    color: Colors.danger,
    bg: Colors.danger + '15',
    icon: 'cut-outline',
  },
  banho: {
    label: 'Banho & Tosa',
    color: '#4ECDC4',
    bg: '#4ECDC415',
    icon: 'water-outline',
  },
  outros: {
    label: 'Outros',
    color: Colors.textLight,
    bg: Colors.border,
    icon: 'ellipsis-horizontal-outline',
  },
};

function TimelineEvent({ event, isLast }: { event: HistoryEvent; isLast: boolean }) {
  const config = eventTypeConfig[event.type];
  return (
    <View style={styles.timelineItem}>
      {/* Timeline line */}
      <View style={styles.timelineSide}>
        <View style={[styles.timelineDot, { backgroundColor: config.color }]}>
          <Ionicons name={config.icon} size={14} color={Colors.white} />
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: config.color + '40' }]} />}
      </View>

      {/* Event Card */}
      <View style={[styles.eventCard, { borderTopColor: config.color }]}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventTypeBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.eventTypeText, { color: config.color }]}>{config.label}</Text>
          </View>
          <Text style={styles.eventDate}>{event.date}</Text>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        {(event.veterinarian || event.clinic || event.cost) && (
          <View style={styles.eventMeta}>
            {event.veterinarian ? (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.veterinarian}</Text>
              </View>
            ) : null}
            {event.clinic ? (
              <View style={styles.metaRow}>
                <Ionicons name="business-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.clinic}</Text>
              </View>
            ) : null}
            {event.cost ? (
              <View style={styles.metaRow}>
                <Ionicons name="cash-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.cost}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

export default function HistoricoScreen() {
  // Sort events by date (most recent first)
  const sorted = [...historyEvents].sort((a, b) => {
    const parseDate = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  // Count by type
  const counts = historyEvents.reduce(
    (acc, ev) => {
      acc[ev.type] = (acc[ev.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Total cost
  const totalCost = historyEvents.reduce((sum, ev) => {
    if (ev.cost) {
      const value = parseFloat(ev.cost.replace('R$ ', '').replace(',', '.'));
      return sum + value;
    }
    return sum;
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Histórico</Text>
          <Text style={styles.headerSubtitle}>Todos os eventos de saúde da Luna</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="time" size={28} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{historyEvents.length}</Text>
            <Text style={styles.summaryLabel}>Eventos</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{counts['consulta'] || 0}</Text>
            <Text style={styles.summaryLabel}>Consultas</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{counts['exame'] || 0}</Text>
            <Text style={styles.summaryLabel}>Exames</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              R$ {totalCost.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>Total Gasto</Text>
          </View>
        </View>

        {/* Type Legend */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.legendScroll}
          contentContainerStyle={styles.legendContent}
        >
          {(Object.keys(eventTypeConfig) as HistoryEvent['type'][]).map((type) => {
            const config = eventTypeConfig[type];
            const count = counts[type] || 0;
            if (count === 0) return null;
            return (
              <View key={type} style={[styles.legendChip, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={12} color={config.color} />
                <Text style={[styles.legendChipText, { color: config.color }]}>
                  {config.label} ({count})
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Linha do Tempo</Text>
        <View style={styles.timeline}>
          {sorted.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={index === sorted.length - 1}
            />
          ))}
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
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    paddingTop: 20,
  },
  summaryCard: {
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
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  legendScroll: {
    marginBottom: 20,
  },
  legendContent: {
    gap: 8,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  legendChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineSide: {
    alignItems: 'center',
    marginRight: 14,
    width: 36,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },
  eventCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  eventTypeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 19,
    marginBottom: 8,
  },
  eventMeta: {
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bottomSpacer: {
    height: 20,
  },
});
