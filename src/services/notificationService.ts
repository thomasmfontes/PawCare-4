import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura o comportamento das notificações com o app em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Solicita permissões de notificação e cria canal no Android
  requestPermissions: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('pawcare-alerts', {
            name: 'PawCare - Alertas e Vacinas',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#2F6BFF',
            sound: 'default',
          });
        } catch {
          // No Expo Go Android a criação manual de canal pode não estar disponível nativamente
        }
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch {
      return false;
    }
  },

  // Disparo imediato de notificação local para eventos reais (ex: confirmação de agendamento ou vacina)
  sendImmediateNotification: async (
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<string | null> => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) return null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // null dispara imediatamente
      });
      return id;
    } catch (error) {
      console.warn('Erro ao disparar notificação imediata:', error);
      return null;
    }
  },

  // Agendamento de notificação local para vacinas ou cuidados
  scheduleReminderNotification: async (
    title: string,
    body: string,
    secondsFromNow: number = 5,
    data?: Record<string, any>
  ): Promise<string | null> => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) return null;

      const triggerSeconds = Math.max(2, secondsFromNow);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
        },
      });
      return id;
    } catch (error) {
      console.warn('Erro ao agendar notificação:', error);
      return null;
    }
  },

  // Cancela todas as notificações pendentes
  cancelAllNotifications: async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('Erro ao cancelar notificações:', error);
    }
  },
};

export default notificationService;
