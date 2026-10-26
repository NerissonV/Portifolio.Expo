import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Card from '@/components/Card';
import LoadingScreen from '@/components/LoadingScreen';
import SectionTitle from '@/components/SectionTitle';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { getExperience, Experience } from '@/services/back4app';

export default function ExperienceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadExperience = useCallback(async () => {
    try {
      const data = await getExperience();
      setExperience(data);
    } catch (error) {
      console.error('Error loading experience:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadExperience();
  }, [loadExperience]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadExperience();
  }, [loadExperience]);

  const formatDate = (date: string) => {
    if (!date) return '';
    const parts = date.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parts[2] ? parseInt(parts[2], 10) : 1;
      const d = new Date(year, month, day);
      return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    }
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
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
        <Animatable.View animation="fadeIn" duration={800}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>💼 Experiência Profissional</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Minha trajetória e realizações no mercado
            </ThemedText>
          </View>

          <SectionTitle title="Experiências" icon="🚀" />

          {experience.length === 0 ? (
            <Card style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>
                Nenhuma experiência profissional cadastrada ainda.
              </ThemedText>
            </Card>
          ) : (
            <View style={styles.timeline}>
              {experience.map((exp, index) => (
                <Animatable.View
                  key={exp.objectId || index}
                  animation="fadeInUp"
                  delay={index * 150}
                  duration={600}
                >
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: exp.current ? colors.success : colors.primary }]} />
                    {index < experience.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                    )}

                    <Card style={styles.experienceCard}>
                      <View style={styles.cardTopRow}>
                        <View style={styles.periodBadge}>
                          <ThemedText style={[styles.periodText, { color: colors.primary }]}>
                            {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}
                          </ThemedText>
                        </View>
                        {exp.current && (
                          <View style={[styles.currentBadge, { backgroundColor: colors.success }]}>
                            <ThemedText style={styles.currentBadgeText}>Atual</ThemedText>
                          </View>
                        )}
                      </View>

                      <ThemedText style={styles.position}>{exp.position}</ThemedText>
                      <ThemedText style={[styles.company, { color: colors.primary }]}>
                        🏢 {exp.company}
                      </ThemedText>

                      <ThemedText style={styles.description}>{exp.description}</ThemedText>

                      {exp.technologies && exp.technologies.length > 0 && (
                        <View style={styles.techContainer}>
                          <ThemedText style={styles.techLabel}>Tecnologias:</ThemedText>
                          <View style={styles.techTags}>
                            {exp.technologies.map((tech, idx) => (
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
                    </Card>
                  </View>
                </Animatable.View>
              ))}
            </View>
          )}

          <SectionTitle title="Habilidades" icon="⚡" />

          <Card style={styles.skillsCard}>
            <View style={styles.skillCategory}>
              <ThemedText style={styles.skillCategoryTitle}>💻 Desenvolvimento</ThemedText>
              <View style={styles.skillTags}>
                <SkillTag text="React Native" color={colors.primary} />
                <SkillTag text="Expo" color={colors.primary} />
                <SkillTag text="TypeScript" color={colors.primary} />
                <SkillTag text="JavaScript" color={colors.primary} />
                <SkillTag text="Node.js" color={colors.primary} />
              </View>
            </View>

            <View style={styles.skillCategory}>
              <ThemedText style={styles.skillCategoryTitle}>🎨 Frontend & Mobile</ThemedText>
              <View style={styles.skillTags}>
                <SkillTag text="React" color={colors.secondary} />
                <SkillTag text="Expo Router" color={colors.secondary} />
                <SkillTag text="Design Responsivo" color={colors.secondary} />
                <SkillTag text="AsyncStorage" color={colors.secondary} />
              </View>
            </View>

            <View style={styles.skillCategory}>
              <ThemedText style={styles.skillCategoryTitle}>🔧 Ferramentas & Backend</ThemedText>
              <View style={styles.skillTags}>
                <SkillTag text="Git & GitHub" color={colors.accent} />
                <SkillTag text="Back4App / Parse" color={colors.accent} />
                <SkillTag text="REST APIs" color={colors.accent} />
                <SkillTag text="VS Code" color={colors.accent} />
              </View>
            </View>
          </Card>
        </Animatable.View>
      </ScrollView>
    </ThemedView>
  );
}

function SkillTag({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.skillTag, { borderColor: color }]}>
      <ThemedText style={[styles.skillTagText, { color }]}>{text}</ThemedText>
    </View>
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
  timeline: {
    paddingHorizontal: 16,
    paddingLeft: 32,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 16,
  },
  timelineDot: {
    position: 'absolute',
    left: -24,
    top: 24,
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: -17,
    top: 40,
    width: 2,
    height: '100%',
    zIndex: 1,
  },
  experienceCard: {
    marginLeft: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  periodBadge: {
    alignSelf: 'flex-start',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  position: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 12,
  },
  techContainer: {
    marginTop: 4,
  },
  techLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.7,
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
  skillsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  skillCategory: {
    marginBottom: 18,
  },
  skillCategoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
