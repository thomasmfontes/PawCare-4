import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { careCards, CareCard } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function FrequencyBadge({ frequency, color }: { frequency: string; color: string }) {
  return (
    <View style={[styles.freqBadge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
      <Ionicons name="refresh-outline" size={9} color={Colors.white} />
      <Text style={styles.freqText}>{frequency}</Text>
    </View>
  );
}

function CareCardComponent({ card }: { card: CareCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.careCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.88}
    >
      <View style={[styles.careHeader, { backgroundColor: card.color }]}>
        <View style={styles.careHeaderLeft}>
          <View style={styles.careIconBg}>
            <Ionicons name={card.icon as IoniconsName} size={24} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.careTitle}>{card.title}</Text>
            <Text style={styles.careCategory}>{card.category}</Text>
          </View>
        </View>
        <View style={styles.careHeaderRight}>
          <FrequencyBadge frequency={card.frequency} color={card.color} />
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="rgba(255,255,255,0.8)"
          />
        </View>
      </View>

      <View style={styles.careBody}>
        <View style={styles.tipRow}>
          <View style={[styles.tipNum, { backgroundColor: card.color }]}>
            <Text style={styles.tipNumText}>1</Text>
          </View>
          <Text style={styles.tipText} numberOfLines={expanded ? undefined : 2}>
            {card.tips[0]}
          </Text>
        </View>

        {expanded && card.tips.slice(1).map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={[styles.tipNum, { backgroundColor: card.color }]}>
              <Text style={styles.tipNumText}>{i + 2}</Text>
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        <View style={styles.careFooter}>
          <Text style={[styles.expandHint, { color: card.color }]}>
            {expanded
              ? 'Recolher'
              : `+ ${card.tips.length - 1} dica${card.tips.length - 1 !== 1 ? 's' : ''}`}
          </Text>
          <Ionicons
            name={expanded ? 'remove-circle-outline' : 'add-circle-outline'}
            size={15}
            color={card.color}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CuidadosScreen() {
  const totalTips = careCards.reduce((acc, c) => acc + c.tips.length, 0);
  const dailyCount = careCards.filter((c) => c.frequency === 'Diário').length;

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cuidados</Text>
          <Text style={styles.headerSub}>Saúde e bem-estar da Luna</Text>
        </View>
        <View style={styles.headerIconBg}>
          <Ionicons name="heart" size={26} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBanner}>
          <View style={styles.introIconBg}>
            <Ionicons name="paw" size={26} color={Colors.primary} />
          </View>
          <View style={styles.introBody}>
            <Text style={styles.introTitle}>Guia de Cuidados — Luna</Text>
            <Text style={styles.introSub}>Golden Retriever · 5 anos · Fêmea</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { val: String(careCards.length), lbl: 'Categorias', color: Colors.primary },
            { val: String(totalTips), lbl: 'Dicas no Total', color: Colors.purple },
            { val: String(dailyCount), lbl: 'Tarefas Diárias', color: Colors.success },
          ].map((s, i, arr) => (
            <React.Fragment key={s.lbl}>
              <View style={styles.statItem}>
                <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.statLbl}>{s.lbl}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionLabel}>ÁREAS DE CUIDADO</Text>
        <View style={styles.cardsList}>
          {careCards.map((card) => (
            <CareCardComponent key={card.id} card={card} />
          ))}
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="heart-circle" size={18} color={Colors.danger} />
          <Text style={styles.footerNoteText}>
            Recomendações gerais para Golden Retrievers. Consulte sempre seu veterinário para orientações personalizadas.
          </Text>
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
  shadowRadius: 14,
  elevation: 5,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.darkBlue, paddingTop: Constants.statusBarHeight },

  header: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingTop: 16,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
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
  content: { paddingHorizontal: 20, paddingTop: 20 },

  introBanner: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  introIconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBody: { flex: 1 },
  introTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  introSub: { fontSize: 13, color: Colors.textLight, marginTop: 2 },

  statsRow: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  statLbl: { fontSize: 10, color: Colors.textMuted, marginTop: 3, textAlign: 'center' },
  statDiv: { width: 1, height: 32, backgroundColor: Colors.border },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  cardsList: { gap: 14, marginBottom: 20 },
  careCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  careHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  careIconBg: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  careTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, letterSpacing: -0.2 },
  careCategory: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 1 },
  careHeaderRight: { alignItems: 'flex-end', gap: 6 },
  freqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  freqText: { fontSize: 10, fontWeight: '700', color: Colors.white },

  careBody: { padding: 14 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  tipNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  tipNumText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  tipText: { fontSize: 13, color: Colors.textBody, flex: 1, lineHeight: 19 },
  careFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 2,
  },
  expandHint: { fontSize: 12, fontWeight: '700' },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.danger + '25',
    marginBottom: 8,
  },
  footerNoteText: { flex: 1, fontSize: 13, color: '#7F1D1D', lineHeight: 19 },
});
