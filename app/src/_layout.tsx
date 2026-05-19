import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'index',        title: 'Início',       icon: 'home',    iconOutline: 'home-outline' },
  { name: 'perfil-pet',   title: 'Perfil',       icon: 'paw',     iconOutline: 'paw-outline' },
  { name: 'vacinas',      title: 'Vacinas',      icon: 'medical', iconOutline: 'medical-outline' },
  { name: 'historico',    title: 'Histórico',    icon: 'time',    iconOutline: 'time-outline' },
  { name: 'especialistas',title: 'Vets',         icon: 'people',  iconOutline: 'people-outline' },
  { name: 'cuidados',     title: 'Cuidados',     icon: 'heart',   iconOutline: 'heart-outline' },
];

function TabIcon({
  iconName,
  color,
  focused,
}: {
  iconName: IoniconsName;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={iconName} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {TABS.map(({ name, title, icon, iconOutline }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? icon : iconOutline}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: 72,
    paddingTop: 6,
    paddingBottom: 12,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  iconWrapper: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryLight,
  },
});
