import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/Colors';

import HomeScreen from '../screens/app/HomeScreen';
import PetsScreen from '../screens/app/PetsScreen';
import VaccinesScreen from '../screens/app/VaccinesScreen';
import HistoryScreen from '../screens/app/HistoryScreen';
import SpecialistsScreen from '../screens/app/SpecialistsScreen';
import CareScreen from '../screens/app/CareScreen';

export type AppTabParamList = {
  Home: undefined;
  Pets: undefined;
  Vaccines: undefined;
  History: undefined;
  Specialists: undefined;
  Care: undefined;
};

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: keyof AppTabParamList;
  title: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
  component: React.ComponentType<any>;
}

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
}: {
  iconName: IoniconsName;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={iconName} size={20} color={color} />
    </View>
  );
}

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
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
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: 68,
    paddingTop: 6,
    paddingBottom: 10,
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
    width: 38,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryLight,
  },
});
