import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { specialists, Specialist } from '../../constants/MockData';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

function SpecialistCard({ specialist }: { specialist: Specialist }) {
  return (
    <View style={styles.specialistCard}>
      <View style={styles.cardTop}>
        <Image
          source={{ uri: specialist.photo }}
          style={styles.specialistPhoto}
          resizeMode="cover"
        />
        <View style={styles.specialistMainInfo}>
          <Text style={styles.specialistName}>{specialist.name}</Text>
          <View style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>{specialist.specialty}</Text>
          </View>
          <View style={styles.ratingRow}>
            <StarRating rating={specialist.rating} />
            <Text style={styles.ratingValue}>{specialist.rating}</Text>
            <Text style={styles.reviewCount}>({specialist.reviews} avaliações)</Text>
          </View>
        </View>
        <View style={[
          styles.availabilityDot,
          { backgroundColor: specialist.available ? Colors.success : Colors.danger }
        ]}>
          <Text style={styles.availabilityText}>
            {specialist.available ? 'Disponível' : 'Ocupado'}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="briefcase-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{specialist.experience} de experiência</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="business-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{specialist.clinic}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{specialist.address}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{specialist.phone}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonOutline]}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={16} color={Colors.primary} />
          <Text style={styles.actionButtonOutlineText}>Ligar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.actionButtonFilled,
            !specialist.available && styles.actionButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={!specialist.available}
        >
          <Ionicons name="calendar-outline" size={16} color={Colors.white} />
          <Text style={styles.actionButtonFilledText}>
            {specialist.available ? 'Agendar' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function EspecialistasScreen() {
  const [filterAvailable, setFilterAvailable] = useState(false);

  const displayed = filterAvailable
    ? specialists.filter((s) => s.available)
    : specialists;

  const availableCount = specialists.filter((s) => s.available).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Especialistas</Text>
          <Text style={styles.headerSubtitle}>{availableCount} disponíveis agora</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="people" size={28} color={Colors.white} />
        </View>
      </View>

      <View style={styles.container}>
        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterToggle, filterAvailable && styles.filterToggleActive]}
            onPress={() => setFilterAvailable(!filterAvailable)}
          >
            <View style={[
              styles.filterDot,
              { backgroundColor: filterAvailable ? Colors.success : Colors.textMuted }
            ]} />
            <Text style={[styles.filterToggleText, filterAvailable && styles.filterToggleTextActive]}>
              Apenas disponíveis
            </Text>
          </TouchableOpacity>
          <Text style={styles.filterCount}>
            {displayed.length} especialista{displayed.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Specialists List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayed.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.disclaimerText}>
              Dados fictícios para fins de demonstração do app PawCare.
            </Text>
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  filterToggleActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
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
  filterToggleTextActive: {
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
  specialistCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  specialistPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.border,
    marginRight: 12,
  },
  specialistMainInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
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
  ratingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  availabilityDot: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  cardDetails: {
    gap: 7,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  actionButtonFilled: {
    backgroundColor: Colors.primary,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  actionButtonOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionButtonFilledText: {
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
  bottomSpacer: {
    height: 10,
  },
});
