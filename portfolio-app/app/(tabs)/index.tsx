import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Card from '@/components/Card';
import LoadingScreen from '@/components/LoadingScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { getProfile, Profile, isConfigured } from '@/services/back4app';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile();
  }, [loadProfile]);

  const openLink = async (url?: string) => {
    if (!url) return;
    try {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')
        ? url
        : `https://${url}`;
      await Linking.openURL(formattedUrl);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'NA';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'NA';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <View style={[styles.avatar, { borderColor: colors.primary, backgroundColor: colors.card }]}>
            <ThemedText style={[styles.avatarText, { color: colors.primary }]}>
              {getInitials(profile?.name)}
            </ThemedText>
          </View>
          <ThemedText style={styles.name}> Nerisso valdomiro da Silva </ThemedText>
          <ThemedText style={[styles.title, { color: colors.primary }]}>
            {profile?.title || 'Desenvolvedor'}
          </ThemedText>
          <ThemedText style={styles.location}>📍 Pernambuco </ThemedText>
        </Animatable.View>

        {!isConfigured() && (
          <Animatable.View animation="fadeIn" duration={800}>
            <Card style={[styles.demoCard, { borderColor: colors.accent }]}>
              <ThemedText style={styles.demoCardTitle}>💡 Modo Demonstração Ativo</ThemedText>
              <ThemedText style={styles.demoCardText}>
                Exibindo dados locais com suporte a cache offline. Para sincronizar com a nuvem, configure suas credenciais do Back4App no arquivo .env.
              </ThemedText>
            </Card>
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" duration={1000} delay={300}>
          <Card style={styles.card}>
            <ThemedText style={styles.sectionTitle}>💬 Sobre Mim</ThemedText>
            <ThemedText style={styles.bio}>
              {profile?.bio || 'Bio não disponível'}
            </ThemedText>
          </Card>

          <Card style={styles.card}>
            <ThemedText style={styles.sectionTitle}>📞 Contato</ThemedText>
            {profile?.email && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openLink(`mailto:${profile.email}`)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.contactLabel}>Email:</ThemedText>
                <ThemedText style={[styles.contactValue, { color: colors.primary }]}>
                  {profile.email}
                </ThemedText>
              </TouchableOpacity>
            )}
            {profile?.phone && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openLink(`tel:${profile.phone.replace(/[^0-9+]/g, '')}`)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.contactLabel}>Telefone:</ThemedText>
                <ThemedText style={styles.contactValue}>{profile.phone}</ThemedText>
              </TouchableOpacity>
            )}
          </Card>

          <Card style={styles.card}>
            <ThemedText style={styles.sectionTitle}>🔗 Links</ThemedText>
            <View style={styles.linksContainer}>
              {profile?.github && (
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: colors.primary }]}
                  onPress={() => openLink(profile.github)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.linkButtonText}>GitHub</ThemedText>
                </TouchableOpacity>
              )}
              {profile?.linkedin && (
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: colors.secondary }]}
                  onPress={() => openLink(profile.linkedin)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.linkButtonText}>LinkedIn</ThemedText>
                </TouchableOpacity>
              )}
              {profile?.portfolio && (
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: colors.accent }]}
                  onPress={() => openLink(profile.portfolio)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.linkButtonText}>Portfolio</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </Animatable.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    opacity: 0.75,
  },
  demoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  demoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  demoCardText: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
  card: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.85,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontWeight: '600',
    marginRight: 8,
    width: 75,
  },
  contactValue: {
    flex: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
