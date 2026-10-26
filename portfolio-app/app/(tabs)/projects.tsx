import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Linking, Image, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Card from '@/components/Card';
import LoadingScreen from '@/components/LoadingScreen';
import SectionTitle from '@/components/SectionTitle';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { getProjects, Project } from '@/services/back4app';

export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, [loadProjects]);

  const openLink = async (url?: string) => {
    if (!url) return;
    try {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
      await Linking.openURL(formattedUrl);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

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
        <Animatable.View animation="fadeIn" duration={800}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>🚀 Projetos</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Meus principais projetos e realizações
            </ThemedText>
          </View>

          {featuredProjects.length > 0 && (
            <>
              <SectionTitle title="Projetos em Destaque" icon="⭐" />
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.objectId || `featured-${index}`}
                  project={project}
                  index={index}
                  colors={colors}
                  onOpenLink={openLink}
                />
              ))}
            </>
          )}

          <SectionTitle
            title={featuredProjects.length > 0 ? "Outros Projetos" : "Todos os Projetos"}
            icon="📁"
          />

          {(featuredProjects.length > 0 ? otherProjects : projects).length === 0 ? (
            <Card style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>
                Nenhum projeto adicional cadastrado ainda.
              </ThemedText>
            </Card>
          ) : (
            (featuredProjects.length > 0 ? otherProjects : projects).map((project, index) => (
              <ProjectCard
                key={project.objectId || `project-${index}`}
                project={project}
                index={index}
                colors={colors}
                onOpenLink={openLink}
              />
            ))
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openLink('https://github.com')}
          >
            <Card style={[styles.githubCard, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.githubTitle}>💻 Mais Projetos no GitHub</ThemedText>
              <ThemedText style={styles.githubText}>
                Toque aqui para explorar repositórios e contribuições de código aberto
              </ThemedText>
            </Card>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </ThemedView>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  colors: any;
  onOpenLink: (url?: string) => void;
}

function ProjectCard({ project, index, colors, onOpenLink }: ProjectCardProps) {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 120}
      duration={500}
    >
      <Card style={styles.projectCard}>
        {project.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.warning }]}>
            <ThemedText style={styles.featuredBadgeText}>⭐ Destaque</ThemedText>
          </View>
        )}

        {project.imageUrl ? (
          <Image
            source={{ uri: project.imageUrl }}
            style={styles.projectImage}
            resizeMode="cover"
          />
        ) : null}

        <ThemedText style={styles.projectName}>{project.name}</ThemedText>
        <ThemedText style={styles.projectDescription}>{project.description}</ThemedText>

        {project.technologies && project.technologies.length > 0 && (
          <View style={styles.techContainer}>
            <View style={styles.techTags}>
              {project.technologies.map((tech, idx) => (
                <View
                  key={idx}
                  style={[styles.techTag, { backgroundColor: colors.accent }]}
                >
                  <ThemedText style={styles.techTagText}>{tech}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.linkContainer}>
          {project.githubUrl && (
            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: colors.primary }]}
              onPress={() => onOpenLink(project.githubUrl)}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.linkButtonText}>GitHub</ThemedText>
            </TouchableOpacity>
          )}
          {project.liveUrl && (
            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: colors.success }]}
              onPress={() => onOpenLink(project.liveUrl)}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.linkButtonText}>Ver Projeto</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </Animatable.View>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.75,
    textAlign: 'center',
  },
  projectCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featuredBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  projectImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 14,
  },
  projectName: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: 12,
  },
  techContainer: {
    marginBottom: 14,
  },
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  techTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  linkButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyCard: {
    marginHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  githubCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 18,
  },
  githubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  githubText: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});
