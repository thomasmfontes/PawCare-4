import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { careCards, CareCard } from '../../constants/MockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function FrequencyBadge({ frequency }: { frequency: string }) {
  const color = frequency === 'Diário' ? Colors.primary : '#F59E0B';
  return (
    <View style={[styles.frequencyBadge, { backgroundColor: color + '15' }]}>
      <Ionicons name="refresh-outline" size={10} color={color} />
      <Text style={[styles.frequencyText, { color }]}>{frequency}</Text>
    </View>
  );
}

function CareCardComponent({ card }: { card: CareCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.careCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      {/* Card Header */}
      <View style={[styles.careCardHeader, { backgroundColor: card.color }]}>
        <View style={styles.careCardHeaderLeft}>
          <View style={styles.careIconContainer}>
            <Ionicons name={card.icon as IoniconsName} size={26} color={Colors.white} />
          </View>
          <View style={styles.careCardHeaderInfo}>
            <Text style={styles.careCardTitle}>{card.title}</Text>
            <Text style={styles.careCardCategory}>{card.category}</Text>
          </View>
        </View>
        <View style={styles.careCardHeaderRight}>
          <FrequencyBadge frequency={card.frequency} />
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.white}
            style={styles.expandIcon}
          />
        </View>
      </View>

      {/* Tips Preview (always shown) */}
      <View style={styles.careCardBody}>
        <View style={styles.tipPreview}>
          <View style={[styles.tipBullet, { backgroundColor: card.color }]} />
          <Text style={styles.tipPreviewText} numberOfLines={2}>
            {card.tips[0]}
          </Text>
        </View>

        {expanded && (
          <View style={styles.tipsExpanded}>
            {card.tips.slice(1).map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: card.color }]} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={[styles.expandHint, { color: card.color }]}>
            {expanded
              ? 'Toque para recolher'
              : `Ver mais ${card.tips.length - 1} dica${card.tips.length - 1 !== 1 ? 's' : ''}`}
          </Text>
          <Ionicons
            name={expanded ? 'remove-circle-outline' : 'add-circle-outline'}
            size={16}
            color={card.color}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CuidadosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cuidados</Text>
          <Text style={styles.headerSubtitle}>Dicas de saúde e bem-estar para a Luna</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="heart" size={28} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Banner */}
        <View style={styles.introBanner}>
          <Ionicons name="paw" size={32} color={Colors.primary} />
          <View style={styles.introText}>
            <Text style={styles.introTitle}>Guia de Cuidados — Luna</Text>
            <Text style={styles.introSubtitle}>
              Golden Retriever · 3 anos · Fêmea
            </Text>
          </View>
        </View>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{careCards.length}</Text>
            <Text style={styles.summaryLabel}>Categorias</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {careCards.reduce((acc, c) => acc + c.tips.length, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Dicas no Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {careCards.filter((c) => c.frequency === 'Diário').length}
            </Text>
            <Text style={styles.summaryLabel}>Tarefas Diárias</Text>
          </View>
        </View>

        {/* Care Cards */}
        <Text style={styles.sectionTitle}>Áreas de Cuidado</Text>
        <View style={styles.cardsList}>
          {careCards.map((card) => (
            <CareCardComponent key={card.id} card={card} />
          ))}
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Ionicons name="heart-circle" size={20} color={Colors.danger} />
          <Text style={styles.footerNoteText}>
            As dicas acima são recomendações gerais para Golden Retrievers. Sempre consulte seu veterinário para orientações personalizadas para a Luna.
          </Text>
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
  introBanner: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  introSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  summaryRow: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  cardsList: {
    gap: 14,
    marginBottom: 20,
  },
  careCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  careCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  careCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  careIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  careCardHeaderInfo: {
    gap: 2,
  },
  careCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  careCardCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  careCardHeaderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  expandIcon: {
    marginTop: 2,
  },
  careCardBody: {
    padding: 14,
  },
  tipPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    flexShrink: 0,
  },
  tipPreviewText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
    lineHeight: 19,
  },
  tipsExpanded: {
    gap: 10,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  expandHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
    marginBottom: 8,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 19,
  },
  bottomSpacer: {
    height: 20,
  },
});
