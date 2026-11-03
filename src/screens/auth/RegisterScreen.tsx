import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../routes/AuthRoutes';

type RegisterScreenNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavProp;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const { register } = useAuth();
  const { colors, isDark } = useTheme();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha o e-mail e a senha.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha Fraca', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas Divergentes', 'As senhas informadas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), password.trim());
      Alert.alert('Conta Criada!', 'Bem-vindo ao PawCare! Sua conta foi criada com sucesso.');
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error?.message === 'EMAIL_EXISTS'
          ? 'Este e-mail já está em uso por outro usuário.'
          : 'Falha ao criar conta. Verifique sua conexão e tente novamente.';
      Alert.alert('Erro no Cadastro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={[styles.container, { backgroundColor: isDark ? colors.background : colors.darkBlue }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <TouchableOpacity
            style={[
              styles.backBtn,
              { backgroundColor: isDark ? colors.cardBg : 'rgba(255, 255, 255, 0.15)' },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={[styles.subtitle, { color: isDark ? colors.textLight : '#94A3B8' }]}>
              Junte-se ao PawCare e cuide melhor do seu pet
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
            <CustomInput
              label="E-mail *"
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              value={email}
              onChangeText={setEmail}
            />

            <CustomInput
              ref={passwordInputRef}
              label="Senha *"
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              blurOnSubmit={false}
              value={password}
              onChangeText={setPassword}
            />

            <CustomInput
              ref={confirmPasswordInputRef}
              label="Confirme sua Senha *"
              placeholder="Repita a senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleRegister}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <CustomButton
              title="Finalizar Cadastro"
              loading={loading}
              onPress={handleRegister}
              style={styles.submitBtn}
            />

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textLight }]}>Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 36 : 50,
    paddingBottom: 48,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 10,
  },
  submitBtn: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
