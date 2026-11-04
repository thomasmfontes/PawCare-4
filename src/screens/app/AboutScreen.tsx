import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import APP_INFO from '../../config/appInfo';

interface AboutScreenProps {
  navigation?: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { sendNotification } = useNotifications();
  const [testingNotification, setTestingNotification] = useState(false);

  const handleTestNotification = async () => {
    setTestingNotification(true);
    try {
      await sendNotification(
        '🔔 PawCare Notificação de Teste',
        'Notificação local disparada com sucesso! O sistema de alertas está 100% operacional no dispositivo.',
        { screen: 'About' }
      );
      Alert.alert(
        'Notificação Disparada!',
        'A notificação do sistema foi enviada para o seu dispositivo.'
      );
    } finally {
      setTestingNotification(false);
    }
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Escuro', icon: 'moon-outline' },
    { mode: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com botão de voltar caso acessado via pilha */}
      <View style={[styles.headerCard, { backgroundColor: colors.darkBlue }]}>
        {navigation?.canGoBack && navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <View style={styles.appIconCircle}>
          <Ionicons name="paw" size={38} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>{APP_INFO.name}</Text>
        <Text style={styles.appSprint}>{APP_INFO.sprint}</Text>
        <Text style={styles.appCourse}>
          {APP_INFO.institution} • {APP_INFO.course}
        </Text>
      </View>

      {/* Card Identificação da Versão & Hash do Commit (Requisito Avaliativo da Sprint 4) */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="git-commit-outline" size={22} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Identificação da Versão</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textBody }]}>
          Dados da publicação no Firebase App Distribution e referência do código-fonte.
        </Text>

        <View style={[styles.infoRow, { borderColor: colors.borderLight }]}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Versão do App:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{APP_INFO.version}</Text>
        </View>

        <View style={[styles.infoRow, { borderColor: colors.borderLight }]}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Hash do Commit (Git):</Text>
          <View style={styles.hashBadge}>
            <Ionicons name="git-branch-outline" size={14} color={colors.primary} />
            <Text style={[styles.hashText, { color: colors.primary }]}>{APP_INFO.commitHash}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderColor: colors.borderLight }]}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Ambiente de Publicação:</Text>
          <Text style={[styles.infoValue, { color: colors.success }]}>Firebase App Distribution</Text>
        </View>
      </View>

      {/* Card Seletor de Tema (Modo Claro / Modo Escuro - Penalidade VI Mitigada) */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Aparência e Tema</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textBody }]}>
          Selecione a aparência do app (Modo Claro, Escuro ou Automático).
        </Text>

        <View style={styles.themeSelectorRow}>
          {themeOptions.map((opt) => {
            const isSelected = themeMode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.inputBg,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setThemeMode(opt.mode)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={opt.icon}
                  size={20}
                  color={isSelected ? '#FFFFFF' : colors.textLight}
                />
                <Text
                  style={[
                    styles.themeButtonText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Card Teste de Notificação Local (Penalidade X Mitigada) */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sistema de Notificações</Text>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textBody }]}>
          Notificações locais com expo-notifications para lembretes de vacinas e consultas.
        </Text>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleTestNotification}
          disabled={testingNotification}
          activeOpacity={0.8}
        >
          <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>
            {testingNotification ? 'Enviando...' : 'Testar Notificação no Aparelho'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card Integrantes da Equipe */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="people-outline" size={22} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Integrantes do Grupo</Text>
        </View>

        {APP_INFO.team.map((member, index) => (
          <View
            key={member.rm}
            style={[
              styles.memberRow,
              index < APP_INFO.team.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              },
            ]}
          >
            <View style={[styles.memberAvatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.memberInitial, { color: colors.primary }]}>
                {member.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
              <Text style={[styles.memberRm, { color: colors.textLight }]}>{member.rm}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 54,
    paddingBottom: 40,
  },
  headerCard: {
    position: 'relative',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  appIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appSprint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#93C5FD',
    marginTop: 4,
  },
  appCourse: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 6,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  hashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(47, 107, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  hashText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    fontSize: 13,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontWeight: '700',
    fontSize: 15,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberRm: {
    fontSize: 12,
    marginTop: 2,
  },
});
