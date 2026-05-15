import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { vaccines as mockVaccines } from '../../constants/MockData';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VaccineEntry {
  id: string;
  name: string;
  date: string;      // data de aplicação DD/MM/AAAA (pode ser vazia)
  nextDate: string;  // próxima dose DD/MM/AAAA
  status: 'done' | 'pending' | 'overdue';
  observacao: string;
}

type FilterType = 'all' | 'done' | 'pending' | 'overdue';

interface FormState {
  nome: string;
  dataAplicacao: string;
  proximaDose: string;
  observacao: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = '@pawcare:vaccines';

const EMPTY_FORM: FormState = {
  nome: '',
  dataAplicacao: '',
  proximaDose: '',
  observacao: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBRDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function calcStatus(date: string, nextDate: string): VaccineEntry['status'] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = parseBRDate(nextDate);
  if (date.trim().length === 10) {
    return next >= today ? 'done' : 'overdue';
  }
  return next >= today ? 'pending' : 'overdue';
}

function isValidDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split('/').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  return !isNaN(new Date(year, month - 1, day).getTime());
}

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function mockToEntry(m: typeof mockVaccines[0]): VaccineEntry {
  return {
    id: `mock_${m.id}`,
    name: m.name,
    date: m.date ?? '',
    nextDate: m.nextDate,
    status: m.status,
    observacao: m.notes ?? '',
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VaccineEntry['status'] }) {
  const config = {
    done: { label: 'Realizada', color: Colors.success, bg: Colors.success + '18', icon: 'checkmark-circle' as const },
    pending: { label: 'Pendente', color: Colors.warning, bg: Colors.warning + '18', icon: 'time' as const },
    overdue: { label: 'Atrasada', color: Colors.danger, bg: Colors.danger + '18', icon: 'alert-circle' as const },
  };
  const c = config[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon} size={12} color={c.color} />
      <Text style={[styles.statusBadgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

interface VaccineCardProps {
  item: VaccineEntry;
  onDelete: (id: string) => void;
}

function VaccineCard({ item, onDelete }: VaccineCardProps) {
  const [expanded, setExpanded] = useState(false);

  const borderColor =
    item.status === 'done' ? Colors.success :
    item.status === 'overdue' ? Colors.danger :
    Colors.warning;

  function confirmDelete() {
    Alert.alert(
      'Remover vacina',
      `Deseja remover "${item.name}" da carteira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete(item.id) },
      ]
    );
  }

  return (
    <TouchableOpacity
      style={[styles.vaccineCard, { borderLeftColor: borderColor }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardMainInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </View>

      <View style={styles.cardDates}>
        {item.date ? (
          <View style={styles.dateRow}>
            <Ionicons name="checkmark-circle-outline" size={13} color={Colors.success} />
            <Text style={styles.dateLabel}>Aplicada em:</Text>
            <Text style={styles.dateValue}>{item.date}</Text>
          </View>
        ) : null}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={Colors.primary} />
          <Text style={styles.dateLabel}>Próxima dose:</Text>
          <Text style={styles.dateValue}>{item.nextDate}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.cardExpanded}>
          <View style={styles.divider} />
          {item.observacao ? (
            <View style={styles.obsRow}>
              <Ionicons name="document-text-outline" size={14} color={Colors.textLight} />
              <Text style={styles.obsText}>{item.observacao}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={14} color={Colors.danger} />
            <Text style={styles.deleteBtnText}>Remover</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Form component ──────────────────────────────────────────────────────────

interface AddFormProps {
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

function AddForm({ form, onChange, onAdd, onCancel }: AddFormProps) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Nova Vacina</Text>

      <Text style={styles.fieldLabel}>Nome da vacina *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Antirrábica, V10..."
        placeholderTextColor={Colors.textMuted}
        value={form.nome}
        onChangeText={(v) => onChange('nome', v)}
        returnKeyType="next"
      />

      <Text style={styles.fieldLabel}>Data de aplicação</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        placeholderTextColor={Colors.textMuted}
        value={form.dataAplicacao}
        onChangeText={(v) => onChange('dataAplicacao', maskDate(v))}
        keyboardType="numeric"
        maxLength={10}
        returnKeyType="next"
      />

      <Text style={styles.fieldLabel}>Próxima dose *</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        placeholderTextColor={Colors.textMuted}
        value={form.proximaDose}
        onChangeText={(v) => onChange('proximaDose', maskDate(v))}
        keyboardType="numeric"
        maxLength={10}
        returnKeyType="next"
      />

      <Text style={styles.fieldLabel}>Observação</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Ex: Reforço anual, reação leve..."
        placeholderTextColor={Colors.textMuted}
        value={form.observacao}
        onChangeText={(v) => onChange('observacao', v)}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        returnKeyType="done"
      />

      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={Colors.white} />
          <Text style={styles.addBtnText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function VacinasScreen() {
  const [vaccines, setVaccines] = useState<VaccineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load from AsyncStorage on mount
  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVaccines(JSON.parse(raw));
      } else {
        // First launch: seed with mock data
        const seed = mockVaccines.map(mockToEntry);
        setVaccines(seed);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      // Fallback to mock data if storage fails
      setVaccines(mockVaccines.map(mockToEntry));
    } finally {
      setLoading(false);
    }
  }, []);

  async function persistVaccines(data: VaccineEntry[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  }

  function handleFieldChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAdd() {
    const nome = form.nome.trim();
    const dataAplicacao = form.dataAplicacao.trim();
    const proximaDose = form.proximaDose.trim();

    if (!nome) {
      Alert.alert('Campo obrigatório', 'Informe o nome da vacina.');
      return;
    }
    if (!proximaDose) {
      Alert.alert('Campo obrigatório', 'Informe a data da próxima dose.');
      return;
    }
    if (!isValidDate(proximaDose)) {
      Alert.alert('Data inválida', 'Próxima dose deve estar no formato DD/MM/AAAA.');
      return;
    }
    if (dataAplicacao && !isValidDate(dataAplicacao)) {
      Alert.alert('Data inválida', 'Data de aplicação deve estar no formato DD/MM/AAAA.');
      return;
    }

    const entry: VaccineEntry = {
      id: `custom_${Date.now()}`,
      name: nome,
      date: dataAplicacao,
      nextDate: proximaDose,
      status: calcStatus(dataAplicacao, proximaDose),
      observacao: form.observacao.trim(),
    };

    const updated = [entry, ...vaccines];
    setVaccines(updated);
    persistVaccines(updated);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    const updated = vaccines.filter((v) => v.id !== id);
    setVaccines(updated);
    persistVaccines(updated);
  }

  // Computed values
  const filtered = vaccines.filter((v) => filter === 'all' || v.status === filter);

  const counts = {
    all: vaccines.length,
    done: vaccines.filter((v) => v.status === 'done').length,
    pending: vaccines.filter((v) => v.status === 'pending').length,
    overdue: vaccines.filter((v) => v.status === 'overdue').length,
  };

  const filterOptions: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: `Todas (${counts.all})`, color: Colors.primary },
    { key: 'done', label: `Realizadas (${counts.done})`, color: Colors.success },
    { key: 'pending', label: `Pendentes (${counts.pending})`, color: Colors.warning },
    { key: 'overdue', label: `Atrasadas (${counts.overdue})`, color: Colors.danger },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vacinas</Text>
          <Text style={styles.headerSubtitle}>Carteira de vacinação da Luna</Text>
        </View>
        <TouchableOpacity
          style={[styles.headerBtn, showForm && styles.headerBtnActive]}
          onPress={() => {
            setShowForm(!showForm);
            setForm(EMPTY_FORM);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name={showForm ? 'close' : 'add'} size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Carregando vacinas...</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Form */}
              {showForm && (
                <AddForm
                  form={form}
                  onChange={handleFieldChange}
                  onAdd={handleAdd}
                  onCancel={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                />
              )}

              {/* Summary */}
              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { backgroundColor: '#E6FBF4' }]}>
                  <Text style={[styles.summaryValue, { color: Colors.success }]}>{counts.done}</Text>
                  <Text style={styles.summaryLabel}>Realizadas</Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: '#FFF8E7' }]}>
                  <Text style={[styles.summaryValue, { color: Colors.warning }]}>{counts.pending}</Text>
                  <Text style={styles.summaryLabel}>Pendentes</Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: '#FFF0F0' }]}>
                  <Text style={[styles.summaryValue, { color: Colors.danger }]}>{counts.overdue}</Text>
                  <Text style={styles.summaryLabel}>Atrasadas</Text>
                </View>
              </View>

              {/* Filters */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
                style={styles.filtersScroll}
              >
                {filterOptions.map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      styles.filterChip,
                      filter === f.key && { backgroundColor: f.color, borderColor: f.color },
                    ]}
                    onPress={() => setFilter(f.key)}
                  >
                    <Text style={[styles.filterChipText, filter === f.key && { color: Colors.white }]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Vaccine list */}
              {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-done-circle-outline" size={60} color={Colors.border} />
                  <Text style={styles.emptyTitle}>Nenhuma vacina aqui</Text>
                  <Text style={styles.emptySubtitle}>
                    {filter === 'all'
                      ? 'Toque em + para adicionar a primeira vacina.'
                      : 'Nenhuma vacina nesta categoria.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.list}>
                  {filtered.map((item) => (
                    <VaccineCard key={item.id} item={item} onDelete={handleDelete} />
                  ))}
                </View>
              )}

              <View style={styles.hint}>
                <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.hintText}>Toque em uma vacina para detalhes ou remover</Text>
              </View>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
  },

  // Header
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
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnActive: {
    backgroundColor: Colors.danger + 'CC',
  },

  // Container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 20,
  },

  // Loading
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 80,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textLight,
  },

  // Form card
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.primary + '25',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 6,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 4,
  },
  inputMultiline: {
    height: 80,
    paddingTop: 11,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  addBtn: {
    flex: 2,
    borderRadius: 10,
    paddingVertical: 13,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },

  // Filters
  filtersScroll: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
  },

  // Vaccine list
  list: {
    paddingHorizontal: 20,
    gap: 10,
  },
  vaccineCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardMainInfo: {
    flex: 1,
    gap: 6,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDates: {
    gap: 5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  cardExpanded: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  obsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  obsText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
    lineHeight: 18,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.danger + '12',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.danger,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Hint
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bottomSpacer: { height: 20 },
});
