import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const technologies = [
    { name: 'React Native', icon: '⚛️', category: 'Framework' },
    { name: 'Expo', icon: '📱', category: 'Platform' },
    { name: 'Expo Router', icon: '🧭', category: 'Navigation' },
    { name: 'TypeScript', icon: '📘', category: 'Language' },
    { name: 'Back4App', icon: '☁️', category: 'Backend' },
    { name: 'Axios', icon: '🌐', category: 'HTTP Client' },
    { name: 'React Native Animatable', icon: '✨', category: 'Animation' },
    { name: 'AsyncStorage', icon: '💾', category: 'Storage' },
  ];

  const features = [
    {
      title: 'Animações Suaves',
      description: 'Implementação de animações com React Native Animatable para melhor experiência do usuário',
      icon: '✨',
    },
    {
      title: 'Tema Dark/Light',
      description: 'Suporte completo para tema claro e escuro, adaptando-se às preferências do sistema',
      icon: '🌓',
    },
    {
      title: 'Backend Robusto',
      description: 'Integração com Back4App para gerenciamento de dados em tempo real',
      icon: '🚀',
    },
    {
      title: 'Cache Local',
      description: 'Sistema de cache com AsyncStorage para melhor performance e experiência offline',
      icon: '⚡',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animatable.View animation="fadeIn" duration={1000}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Sobre o App</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Aplicativo de Portfólio desenvolvido com as melhores tecnologias
            </ThemedText>
          </View>

          <SectionTitle title="Tecnologias Utilizadas" icon="🛠️" />
          
          <View style={styles.techGrid}>
            {technologies.map((tech, index) => (
              <Animatable.View
                key={tech.name}
                animation="zoomIn"
                delay={index * 100}
                duration={500}
              >
                <Card style={styles.techCard}>
                  <ThemedText style={styles.techIcon}>{tech.icon}</ThemedText>
                  <ThemedText style={styles.techName}>{tech.name}</ThemedText>
                  <ThemedText style={[styles.techCategory, { color: colors.primary }]}>
                    {tech.category}
                  </ThemedText>
                </Card>
              </Animatable.View>
            ))}
          </View>

          <SectionTitle title="Funcionalidades Extras" icon="⭐" />

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <Animatable.View
                key={feature.title}
                animation="fadeInUp"
                delay={index * 150}
                duration={600}
              >
                <Card style={styles.featureCard}>
                  <View style={styles.featureHeader}>
                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary }]}>
                      <ThemedText style={styles.featureIcon}>{feature.icon}</ThemedText>
                    </View>
                    <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                  </View>
                  <ThemedText style={styles.featureDescription}>
                    {feature.description}
                  </ThemedText>
                </Card>
              </Animatable.View>
            ))}
          </View>

          <SectionTitle title="Arquitetura" icon="🏗️" />

          <Card style={styles.architectureCard}>
            <ThemedText style={styles.architectureTitle}>Estrutura do Projeto</ThemedText>
            <ThemedText style={styles.architectureText}>
              • <ThemedText style={{ fontWeight: 'bold' }}>Frontend:</ThemedText> React Native com Expo e TypeScript{'\n'}
              • <ThemedText style={{ fontWeight: 'bold' }}>Navegação:</ThemedText> Expo Router (File-based routing){'\n'}
              • <ThemedText style={{ fontWeight: 'bold' }}>Backend:</ThemedText> Back4App (Parse Server){'\n'}
              • <ThemedText style={{ fontWeight: 'bold' }}>Estilização:</ThemedText> StyleSheet com suporte a temas{'\n'}
              • <ThemedText style={{ fontWeight: 'bold' }}>Animações:</ThemedText> React Native Animatable{'\n'}
              • <ThemedText style={{ fontWeight: 'bold' }}>Cache:</ThemedText> AsyncStorage para dados locais
            </ThemedText>
          </Card>

          <Card style={[styles.versionCard, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.versionText}>Versão 1.0.0</ThemedText>
            <ThemedText style={styles.versionSubtext}>
              Desenvolvido com ❤️ usando React Native + Expo
            </ThemedText>
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
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  techCard: {
    width: 160,
    margin: 8,
    alignItems: 'center',
    paddingVertical: 20,
  },
  techIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  techName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  techCategory: {
    fontSize: 12,
    opacity: 0.7,
  },
  featuresContainer: {
    paddingHorizontal: 16,
  },
  featureCard: {
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  architectureCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  architectureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  architectureText: {
    fontSize: 14,
    lineHeight: 24,
    opacity: 0.8,
  },
  versionCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
});
