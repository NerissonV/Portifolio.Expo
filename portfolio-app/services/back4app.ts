import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure suas credenciais do Back4App aqui ou via arquivo .env (com prefixo EXPO_PUBLIC_)
const BACK4APP_APP_ID =
  process.env.EXPO_PUBLIC_BACK4APP_APP_ID ||
  process.env.BACK4APP_APP_ID ||
  'YOUR_APP_ID';

const BACK4APP_REST_API_KEY =
  process.env.EXPO_PUBLIC_BACK4APP_REST_API_KEY ||
  process.env.BACK4APP_REST_API_KEY ||
  'YOUR_REST_API_KEY';

const BACK4APP_URL =
  process.env.EXPO_PUBLIC_BACK4APP_URL ||
  process.env.BACK4APP_URL ||
  'https://parseapi.back4app.com';

export const isConfigured = (): boolean => {
  return (
    Boolean(BACK4APP_APP_ID) &&
    Boolean(BACK4APP_REST_API_KEY) &&
    BACK4APP_APP_ID !== 'YOUR_APP_ID' &&
    BACK4APP_REST_API_KEY !== 'YOUR_REST_API_KEY'
  );
};

const api = axios.create({
  baseURL: BACK4APP_URL,
  timeout: 8000,
  headers: {
    'X-Parse-Application-Id': BACK4APP_APP_ID,
    'X-Parse-REST-API-Key': BACK4APP_REST_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface Profile {
  objectId?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Education {
  objectId?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  gpa?: string;
}

export interface Experience {
  objectId?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies?: string[];
}

export interface Project {
  objectId?: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

// Chaves do AsyncStorage para cache local
const CACHE_KEYS = {
  PROFILE: '@portfolio:profile',
  EDUCATION: '@portfolio:education',
  EXPERIENCE: '@portfolio:experience',
  PROJECTS: '@portfolio:projects',
};

// Dados padrão (fallback) quando a API não estiver configurada ou sem conexão
export const defaultProfile: Profile = {
  name: 'Seu Nome Completo',
  title: 'Desenvolvedor Full Stack & Mobile',
  email: 'seuemail@example.com',
  phone: '+55 (11) 99999-9999',
  location: 'São Paulo, Brasil',
  bio: 'Desenvolvedor apaixonado por criar experiências móveis incríveis. Especializado em React Native, TypeScript e desenvolvimento de aplicações multiplataforma de alta performance.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  portfolio: 'https://portfolio.dev',
};

export const defaultEducation: Education[] = [
  {
    institution: 'Universidade Federal do Estado',
    degree: 'Bacharelado',
    field: 'Ciência da Computação',
    startDate: '2019-02-01',
    endDate: '2023-12-01',
    description: 'Formação sólida em algoritmos, engenharia de software e arquitetura de sistemas distribuídos.',
    gpa: '8.5',
  },
  {
    institution: 'Escola Técnica Estadual',
    degree: 'Técnico',
    field: 'Informática e Desenvolvimento de Sistemas',
    startDate: '2016-02-01',
    endDate: '2018-12-01',
    description: 'Fundamentos de programação, banco de dados relacionais e manutenção de sistemas.',
  },
];

export const defaultExperience: Experience[] = [
  {
    company: 'Tech Solutions Inc.',
    position: 'Desenvolvedor Mobile Sênior',
    startDate: '2023-03-01',
    endDate: '2025-01-01',
    current: true,
    description: 'Desenvolvimento e arquitetura de aplicações móveis usando React Native e Expo. Liderança técnica e mentoria de desenvolvedores.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Redux', 'Jest'],
  },
  {
    company: 'Startup Inovadora',
    position: 'Desenvolvedor Full Stack Júnior',
    startDate: '2021-06-01',
    endDate: '2023-02-28',
    current: false,
    description: 'Desenvolvimento de aplicações web e mobile, APIs RESTful e integração com serviços em nuvem.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express', 'React Native'],
  },
];

export const defaultProjects: Project[] = [
  {
    name: 'Portfolio App',
    description: 'Aplicativo de portfólio pessoal desenvolvido com React Native e Expo Router, com temas claro/escuro, cache local AsyncStorage e integração com Back4App.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Back4App', 'AsyncStorage'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://expo.dev',
    featured: true,
  },
  {
    name: 'E-commerce Mobile',
    description: 'Aplicativo de e-commerce completo com catálogo, carrinho de compras, pagamentos integrados e avaliações.',
    technologies: ['React Native', 'TypeScript', 'Redux', 'Stripe'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://expo.dev',
    featured: true,
  },
  {
    name: 'Task & Habit Manager',
    description: 'Gerenciador de tarefas e hábitos com sincronização em tempo real e suporte offline completo.',
    technologies: ['React Native', 'AsyncStorage', 'SQLite'],
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    name: 'Weather Radar App',
    description: 'Aplicativo de previsão do tempo com dados em tempo real, geolocalização e interface intuitiva.',
    technologies: ['React Native', 'OpenWeather API', 'Expo Location'],
    githubUrl: 'https://github.com',
    featured: false,
  },
];

// Profile API
export const getProfile = async (): Promise<Profile | null> => {
  try {
    if (isConfigured()) {
      const response = await api.get('/classes/Profile');
      if (response.data.results && response.data.results.length > 0) {
        const profile = response.data.results[0];
        await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify(profile));
        return profile;
      }
    }
  } catch (error) {
    console.warn('Could not fetch profile from Back4App, checking cache...', error);
  }

  // Tenta carregar do cache local
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn('Error reading profile cache:', cacheError);
  }

  // Fallback padrão se não houver dados no banco nem no cache
  return defaultProfile;
};

export const createProfile = async (profile: Profile): Promise<Profile> => {
  try {
    const response = await api.post('/classes/Profile', profile);
    const created = { ...profile, objectId: response.data.objectId };
    await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify(created));
    return created;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const updateProfile = async (objectId: string, profile: Partial<Profile>): Promise<void> => {
  try {
    await api.put(`/classes/Profile/${objectId}`, profile);
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PROFILE);
    if (cached) {
      const current = JSON.parse(cached);
      await AsyncStorage.setItem(CACHE_KEYS.PROFILE, JSON.stringify({ ...current, ...profile }));
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Education API
export const getEducation = async (): Promise<Education[]> => {
  try {
    if (isConfigured()) {
      const response = await api.get('/classes/Education', {
        params: {
          order: '-startDate',
        },
      });
      if (response.data.results && response.data.results.length > 0) {
        const list = response.data.results;
        await AsyncStorage.setItem(CACHE_KEYS.EDUCATION, JSON.stringify(list));
        return list;
      }
    }
  } catch (error) {
    console.warn('Could not fetch education from Back4App, checking cache...', error);
  }

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.EDUCATION);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn('Error reading education cache:', cacheError);
  }

  return defaultEducation;
};

export const createEducation = async (education: Education): Promise<Education> => {
  try {
    const response = await api.post('/classes/Education', education);
    return { ...education, objectId: response.data.objectId };
  } catch (error) {
    console.error('Error creating education:', error);
    throw error;
  }
};

// Experience API
export const getExperience = async (): Promise<Experience[]> => {
  try {
    if (isConfigured()) {
      const response = await api.get('/classes/Experience', {
        params: {
          order: '-startDate',
        },
      });
      if (response.data.results && response.data.results.length > 0) {
        const list = response.data.results;
        await AsyncStorage.setItem(CACHE_KEYS.EXPERIENCE, JSON.stringify(list));
        return list;
      }
    }
  } catch (error) {
    console.warn('Could not fetch experience from Back4App, checking cache...', error);
  }

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.EXPERIENCE);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn('Error reading experience cache:', cacheError);
  }

  return defaultExperience;
};

export const createExperience = async (experience: Experience): Promise<Experience> => {
  try {
    const response = await api.post('/classes/Experience', experience);
    return { ...experience, objectId: response.data.objectId };
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  try {
    if (isConfigured()) {
      const response = await api.get('/classes/Project', {
        params: {
          order: '-featured,-createdAt',
        },
      });
      if (response.data.results && response.data.results.length > 0) {
        const list = response.data.results;
        await AsyncStorage.setItem(CACHE_KEYS.PROJECTS, JSON.stringify(list));
        return list;
      }
    }
  } catch (error) {
    console.warn('Could not fetch projects from Back4App, checking cache...', error);
  }

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PROJECTS);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn('Error reading projects cache:', cacheError);
  }

  return defaultProjects;
};

export const createProject = async (project: Project): Promise<Project> => {
  try {
    const response = await api.post('/classes/Project', project);
    return { ...project, objectId: response.data.objectId };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export default api;
