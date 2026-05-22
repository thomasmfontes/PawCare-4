import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { specialists, Specialist } from '../../constants/MockData';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-outline'}
          size={13}
          color={Colors.warning}
        />
      ))}
    </View>
  );
}

function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const available = specialist.available;

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: available ? Colors.primary : Colors.textMuted }]} />

      <View style={styles.cardInner}>
        <View style={styles.cardTop}>
          <View style={styles.photoWrapper}>
            <Image source={{ uri: specialist.photo }} style={styles.photo} resizeMode="cover" />
            <View style={[styles.statusDot, { backgroundColor: available ? Colors.success : Colors.danger }]} />
          </View>

          <View style={styles.mainInfo}>
            <Text style={styles.name}>{specialist.name}</Text>
            <View style={styles.specialtyPill}>
              <Text style={styles.specialtyText}>{specialist.specialty}</Text>
            </View>
            <View style={styles.ratingRow}>
              <StarRating rating={specialist.rating} />
              <Text style={styles.ratingVal}>{specialist.rating}</Text>
              <Text style={styles.reviewCount}>({specialist.reviews})</Text>
            </View>
          </View>

          <View style={[styles.availBadge, { backgroundColor: available ? Colors.successLight : Colors.dangerLight }]}>
            <Text style={[styles.availText, { color: available ? Colors.success : Colors.danger }]}>
              {available ? 'Disponível' : 'Ocupado'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          {[
            { icon: 'briefcase-outline' as const, val: `${specialist.experience} de experiência` },
            { icon: 'business-outline' as const, val: specialist.clinic },
            { icon: 'location-outline' as const, val: specialist.address },
            { icon: 'call-outline' as const, val: specialist.phone },
          ].map((d) => (
            <View key={d.icon} style={styles.detailRow}>
              <Ionicons name={d.icon} size={13} color={Colors.textMuted} />
              <Text style={styles.detailText} numberOfLines={1}>{d.val}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnOutline} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={15} color={Colors.primary} />
            <Text style={styles.btnOutlineText}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnFilled, !available && styles.btnDisabled]}
            activeOpacity={0.8}
            disabled={!available}
          >
            <Ionicons name="calendar-outline" size={15} color={Colors.white} />
            <Text style={styles.btnFilledText}>
              {available ? 'Agendar' : 'Indisponível'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function EspecialistasScreen() {
  const [filterAvailable, setFilterAvailable] = useState(false);

  const displayed = filterAvailable ? specialists.filter((s) => s.available) : specialists;
  const availableCount = specialists.filter((s) => s.available).length;

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Veterinários</Text>
          <Text style={styles.headerSub}>{availableCount} disponíveis agora</Text>
        </View>
        <View style={styles.headerIconBg}>
          <Ionicons name="people" size={26} color={Colors.white} />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterToggle, filterAvailable && styles.filterToggleOn]}
            onPress={() => setFilterAvailable(!filterAvailable)}
            activeOpacity={0.8}
          >
            <View style={[styles.filterDot, { backgroundColor: filterAvailable ? Colors.success : Colors.textMuted }]} />
            <Text style={[styles.filterToggleText, filterAvailable && styles.filterToggleTextOn]}>
              Apenas disponíveis
            </Text>
          </TouchableOpacity>
          <Text style={styles.filterCount}>
            {displayed.length} especialista{displayed.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayed.map((s) => (
            <SpecialistCard key={s.id} specialist={s} />
          ))}

          <View style={{ height: 16 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: Colors.darkBlue,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
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
    paddingTop: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 7,
    ...CARD_SHADOW,
    shadowOpacity: 0.04,
    elevation: 2,
  },
  filterToggleOn: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
  },
  filterToggleTextOn: {
    color: Colors.success,
  },
  filterCount: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...CARD_SHADOW,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  cardInner: {
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  specialtyPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  availBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availText: {
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 12,
  },
  details: {
    gap: 7,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  btnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  btnFilled: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
    backgroundColor: Colors.primary,
  },
  btnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  btnFilledText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 17,
  },
});