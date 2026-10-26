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
import { getEducation, Education } from '@/services/back4app';

export default function EducationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEducation = useCallback(async () => {
    try {
      const data = await getEducation();
      setEducation(data);
    } catch (error) {
      console.error('Error loading education:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEducation();
  }, [loadEducation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEducation();
  }, [loadEducation]);

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
            <ThemedText style={styles.headerTitle}>🎓 Formação Acadêmica</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Meu percurso educacional e qualificações
            </ThemedText>
          </View>

          <SectionTitle title="Educação" icon="📚" />

          {education.length === 0 ? (
            <Card style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>
                Nenhuma formação acadêmica cadastrada ainda.
              </ThemedText>
            </Card>
          ) : (
            <View style={styles.timeline}>
              {education.map((edu, index) => (
                <Animatable.View
                  key={edu.objectId || index}
                  animation="fadeInUp"
                  delay={index * 150}
                  duration={600}
                >
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                    {index < education.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                    )}

                    <Card style={styles.educationCard}>
                      <View style={styles.periodBadge}>
                        <ThemedText style={[styles.periodText, { color: colors.primary }]}>
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </ThemedText>
                      </View>

                      <ThemedText style={styles.degree}>{edu.degree}</ThemedText>
                      <ThemedText style={styles.field}>{edu.field}</ThemedText>
                      <ThemedText style={[styles.institution, { color: colors.primary }]}>
                        📍 {edu.institution}
                      </ThemedText>

                      {edu.gpa && (
                        <View style={[styles.gpaContainer, { backgroundColor: colors.success }]}>
                          <ThemedText style={styles.gpaText}>Nota / GPA: {edu.gpa}</ThemedText>
                        </View>
                      )}

                      {edu.description && (
                        <ThemedText style={styles.description}>{edu.description}</ThemedText>
                      )}
                    </Card>
                  </View>
                </Animatable.View>
              ))}
            </View>
          )}

          <SectionTitle title="Conquistas" icon="🏆" />

          <Card style={styles.achievementsCard}>
            <View style={styles.achievementItem}>
              <ThemedText style={styles.achievementIcon}>🎯</ThemedText>
              <ThemedText style={styles.achievementText}>
                Foco em desenvolvimento de aplicações mobile multiplataforma de alta performance
              </ThemedText>
            </View>
            <View style={styles.achievementItem}>
              <ThemedText style={styles.achievementIcon}>💡</ThemedText>
              <ThemedText style={styles.achievementText}>
                Constante aprendizado e atualização em novas tecnologias e arquiteturas
              </ThemedText>
            </View>
            <View style={styles.achievementItem}>
              <ThemedText style={styles.achievementIcon}>🚀</ThemedText>
              <ThemedText style={styles.achievementText}>
                Experiência em projetos práticos, código limpo e desenvolvimento ágil
              </ThemedText>
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
  educationCard: {
    marginLeft: 8,
  },
  periodBadge: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  degree: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  field: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.85,
  },
  institution: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  gpaContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  gpaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
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
  achievementsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
