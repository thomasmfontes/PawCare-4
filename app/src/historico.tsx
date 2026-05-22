import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
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
  consulta: { label: 'Consulta', color: Colors.primary, bg: Colors.primaryLight, icon: 'medical-outline' },
  vacina: { label: 'Vacina', color: Colors.success, bg: Colors.successLight, icon: 'shield-checkmark-outline' },
  exame: { label: 'Exame', color: Colors.purple, bg: Colors.purpleLight, icon: 'flask-outline' },
  cirurgia: { label: 'Cirurgia', color: Colors.danger, bg: Colors.dangerLight, icon: 'cut-outline' },
  banho: { label: 'Banho & Tosa', color: Colors.teal, bg: Colors.tealLight, icon: 'water-outline' },
  outros: { label: 'Outros', color: Colors.textLight, bg: Colors.borderLight, icon: 'ellipsis-horizontal-outline' },
};

function TimelineEvent({ event, isLast }: { event: HistoryEvent; isLast: boolean }) {
  const cfg = eventTypeConfig[event.type];
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineSide}>
        <View style={[styles.dotOuter, { borderColor: cfg.color + '30' }]}>
          <View style={[styles.dotInner, { backgroundColor: cfg.color }]}>
            <Ionicons name={cfg.icon} size={13} color={Colors.white} />
          </View>
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: cfg.color + '25' }]} />}
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

        {(event.veterinarian || event.clinic || event.cost) && (
          <View style={styles.eventMeta}>
            {event.veterinarian && (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.veterinarian}</Text>
              </View>
            )}
            {event.clinic && (
              <View style={styles.metaRow}>
                <Ionicons name="business-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.clinic}</Text>
              </View>
            )}
            {event.cost && (
              <View style={styles.metaRow}>
                <Ionicons name="cash-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.metaText}>{event.cost}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export default function HistoricoScreen() {
  const sorted = [...historyEvents].sort((a, b) => {
    const parse = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    };
    return parse(b.date) - parse(a.date);
  });

  const counts = historyEvents.reduce((acc, ev) => {
    acc[ev.type] = (acc[ev.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCost = historyEvents.reduce((sum, ev) => {
    if (ev.cost) {
      return sum + parseFloat(ev.cost.replace('R$ ', '').replace(',', '.'));
    }
    return sum;
  }, 0);

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Histórico</Text>
          <Text style={styles.headerSub}>Todos os eventos de saúde da Luna</Text>
        </View>
        <View style={styles.headerIconBg}>
          <Ionicons name="time" size={26} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          {[
            { val: String(historyEvents.length), lbl: 'Eventos', color: Colors.primary },
            { val: String(counts['consulta'] || 0), lbl: 'Consultas', color: Colors.primary },
            { val: String(counts['exame'] || 0), lbl: 'Exames', color: Colors.purple },
            { val: `R$${totalCost.toFixed(0)}`, lbl: 'Investido', color: Colors.success },
          ].map((s, i, arr) => (
            <React.Fragment key={s.lbl}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.summaryLbl}>{s.lbl}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.summaryDiv} />}
            </React.Fragment>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.legendScroll}
          contentContainerStyle={styles.legendContent}
        >
          {(Object.keys(eventTypeConfig) as HistoryEvent['type'][]).map((type) => {
            const cfg = eventTypeConfig[type];
            const count = counts[type] || 0;
            if (!count) return null;
            return (
              <View key={type} style={[styles.legendChip, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={11} color={cfg.color} />
                <Text style={[styles.legendText, { color: cfg.color }]}>
                  {cfg.label} ({count})
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>LINHA DO TEMPO</Text>
        <View style={styles.timeline}>
          {sorted.map((ev, i) => (
            <TimelineEvent key={ev.id} event={ev} isLast={i === sorted.length - 1} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: Colors.darkBlue,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
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
  headerIconBg: {
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
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  summaryLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  summaryDiv: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  legendScroll: {
    marginBottom: 20,
  },
  legendContent: {
    gap: 8,
    paddingRight: 4,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineSide: {
    alignItems: 'center',
    marginRight: 14,
    width: 38,
  },
  dotOuter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    zIndex: 1,
  },
  dotInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  eventBadgeText: {
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
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 19,
    marginBottom: 8,
  },
  eventMeta: {
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
});