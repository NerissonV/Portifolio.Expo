import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={typeof color === 'string' ? color : colors.tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarLabel: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={typeof color === 'string' ? color : colors.tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Educação',
          tabBarLabel: 'Educação',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={typeof color === 'string' ? color : colors.tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="experience"
        options={{
          title: 'Experiência',
          tabBarLabel: 'Experiência',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={typeof color === 'string' ? color : colors.tint} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projetos',
          tabBarLabel: 'Projetos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code-slash" size={size} color={typeof color === 'string' ? color : colors.tint} />
          ),
        }}
      />
    </Tabs>
  );
}
