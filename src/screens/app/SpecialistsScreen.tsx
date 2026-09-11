import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/Colors';

interface SpecialistItem {
  id: string;
  name: string;
  specialty: string;
  crmv: string;
  clinic: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  available: boolean;
  photo: string;
  experience: string;
}

const SPECIALISTS_DATA: SpecialistItem[] = [
  {
    id: '1',
    name: 'Dr. Gabriel Maciel',
    specialty: 'Clínica Geral & Cirurgia',
    crmv: 'CRMV-SP 45.210',
    clinic: 'Clínica VetSaúde',
    address: 'Av. Paulista, 1106 - Bela Vista',
    phone: '(11) 3288-4000',
    rating: 4.9,
    reviews: 124,
    available: true,
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=60',
    experience: '8 anos',
  },
  {
    id: '2',
    name: 'Dra. Vitória Martins',
    specialty: 'Dermatologia & Alergologia',
    crmv: 'CRMV-SP 52.880',
    clinic: 'PetClínic Center',
    address: 'Rua Augusta, 1500 - Consolação',
    phone: '(11) 3120-8899',
    rating: 4.8,
    reviews: 98,
    available: true,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=60',
    experience: '6 anos',
  },
  {
    id: '3',
    name: 'Dr. Matheus Molina',
    specialty: 'Cardiologia & Nefrologia',
    crmv: 'CRMV-SP 39.112',
    clinic: 'Hospital Veterinário 24h',
    address: 'Av. Rebouças, 2200 - Pinheiros',
    phone: '(11) 3814-1100',
    rating: 5.0,
    reviews: 160,
    available: false,
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=60',
    experience: '12 anos',
  },
];

export default function SpecialistsScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('todos');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veterinários Parceiros</Text>
        <Text style={styles.subtitle}>Especialistas qualificados para o seu pet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {SPECIALISTS_DATA.map((spec) => (
          <View key={spec.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: spec.photo }} style={styles.photo} />
              <View style={styles.mainInfo}>
                <Text style={styles.name}>{spec.name}</Text>
                <Text style={styles.specialty}>{spec.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={Colors.warning} />
                  <Text style={styles.ratingText}>{spec.rating}</Text>
                  <Text style={styles.reviewsText}>({spec.reviews} avaliações)</Text>
                </View>
              </View>
              <View
                style={[
                  styles.availBadge,
                  { backgroundColor: spec.available ? Colors.successLight : Colors.dangerLight },
                ]}
              >
                <Text style={[styles.availText, { color: spec.available ? Colors.success : Colors.danger }]}>
                  {spec.available ? 'Disponível' : 'Ocupado'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailText}>{spec.clinic}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailText}>{spec.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailText}>{spec.phone}</Text>
              </View>
            </View>
          </View>
        ))}
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
    padding: 16,
    marginBottom: 14,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  specialty: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewsText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  availBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textBody,
  },
});
