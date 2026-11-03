import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

import HomeScreen from '../screens/app/HomeScreen';
import PetsScreen from '../screens/app/PetsScreen';
import VaccinesScreen from '../screens/app/VaccinesScreen';
import HistoryScreen from '../screens/app/HistoryScreen';
import SpecialistsScreen from '../screens/app/SpecialistsScreen';
import CareScreen from '../screens/app/CareScreen';
import AboutScreen from '../screens/app/AboutScreen';

export type AppTabParamList = {
  Home: undefined;
  Pets: undefined;
  Vaccines: undefined;
  History: undefined;
  Specialists: undefined;
  Care: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  About: undefined;
};

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: keyof AppTabParamList;
  title: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
  component: React.ComponentType<any>;
}

// 6 Abas operacionais principais na Navbar inferior
const TABS: TabConfig[] = [
  { name: 'Home', title: 'Início', icon: 'home', iconOutline: 'home-outline', component: HomeScreen },
  { name: 'Pets', title: 'Pets', icon: 'paw', iconOutline: 'paw-outline', component: PetsScreen },
  { name: 'Vaccines', title: 'Vacinas', icon: 'medical', iconOutline: 'medical-outline', component: VaccinesScreen },
  { name: 'History', title: 'Histórico', icon: 'time', iconOutline: 'time-outline', component: HistoryScreen },
  { name: 'Specialists', title: 'Vets', icon: 'people', iconOutline: 'people-outline', component: SpecialistsScreen },
  { name: 'Care', title: 'Cuidados', icon: 'heart', iconOutline: 'heart-outline', component: CareScreen },
];

function TabIcon({
  iconName,
  color,
  focused,
  activeBgColor,
}: {
  iconName: IoniconsName;
  color: string;
  focused: boolean;
  activeBgColor: string;
}) {
  return (
    <View style={[styles.iconWrapper, focused && { backgroundColor: activeBgColor }]}>
      <Ionicons name={iconName} size={20} color={color} />
    </View>
  );
}

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createStackNavigator<AppStackParamList>();

function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 12 : 8);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.tabBarBg,
            height: 54 + bottomInset,
            paddingBottom: bottomInset,
            borderTopColor: colors.border,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {TABS.map(({ name, title, icon, iconOutline, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? icon : iconOutline}
                color={color}
                focused={focused}
                activeBgColor={colors.primaryLight}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 6,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  tabBarItem: {
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: -2,
  },
  iconWrapper: {
    width: 36,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
});
