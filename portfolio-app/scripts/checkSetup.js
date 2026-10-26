#!/usr/bin/env node

/**
 * Script para verificar se o setup está correto
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto...\n');

let hasBlockingErrors = false;

// 1. Verificar dependências
console.log('1️⃣ Verificando dependências...');
const nodeModulesPath = path.join(__dirname, '../node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log('   ❌ ERRO: Dependências não instaladas!');
  console.log('   📝 Execute: npm install');
  hasBlockingErrors = true;
} else {
  console.log('   ✅ Dependências instaladas');
}

// 2. Verificar arquivo de serviço Back4App e credenciais
console.log('\n2️⃣ Verificando serviço Back4App e credenciais...');
const back4appPath = path.join(__dirname, '../services/back4app.ts');
const envPath = path.join(__dirname, '../.env');

let credentialsConfigured = false;

if (fs.existsSync(back4appPath)) {
  const content = fs.readFileSync(back4appPath, 'utf8');
  if (!content.includes("'YOUR_APP_ID'") && !content.includes('"YOUR_APP_ID"')) {
    credentialsConfigured = true;
  }
} else {
  console.log('   ❌ ERRO: Arquivo services/back4app.ts não encontrado!');
  hasBlockingErrors = true;
}

if (!credentialsConfigured && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (
    envContent.includes('EXPO_PUBLIC_BACK4APP_APP_ID=') &&
    !envContent.includes('seu_app_id_aqui') &&
    !envContent.includes('your_app_id_here')
  ) {
    credentialsConfigured = true;
  }
}

if (credentialsConfigured) {
  console.log('   ✅ Credenciais do Back4App configuradas!');
} else {
  console.log('   ⚠️  Credenciais do Back4App não detectadas no .env ou back4app.ts.');
  console.log('   ℹ️  O app funcionará normalmente no Modo Demonstração (com dados offline e cache local).');
  console.log('   📝 Para sincronizar com a nuvem, crie um arquivo .env com EXPO_PUBLIC_BACK4APP_APP_ID e EXPO_PUBLIC_BACK4APP_REST_API_KEY');
}

// 3. Verificar telas principais
console.log('\n3️⃣ Verificando telas do app...');
const screens = ['index.tsx', 'about.tsx', 'education.tsx', 'experience.tsx', 'projects.tsx'];
const screensPath = path.join(__dirname, '../app/(tabs)');

let allScreensExist = true;
screens.forEach(screen => {
  if (!fs.existsSync(path.join(screensPath, screen))) {
    console.log(`   ❌ Faltando: ${screen}`);
    allScreensExist = false;
    hasBlockingErrors = true;
  }
});

if (allScreensExist) {
  console.log('   ✅ Todas as 5 telas criadas');
}

// 4. Verificar componentes
console.log('\n4️⃣ Verificando componentes...');
const components = ['Card.tsx', 'LoadingScreen.tsx', 'SectionTitle.tsx', 'ThemedText.tsx', 'ThemedView.tsx'];
const componentsPath = path.join(__dirname, '../components');

let allComponentsExist = true;
components.forEach(component => {
  if (!fs.existsSync(path.join(componentsPath, component))) {
    console.log(`   ❌ Faltando: ${component}`);
    allComponentsExist = false;
    hasBlockingErrors = true;
  }
});

if (allComponentsExist) {
  console.log('   ✅ Todos os componentes criados');
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasBlockingErrors) {
  console.log('\n❌ ATENÇÃO: Foram encontrados problemas críticos!');
  console.log('📝 Corrija os erros acima antes de rodar o app.\n');
  process.exit(1);
} else {
  console.log('\n✅ Tudo pronto! O projeto está saudável e pronto para rodar.');
  console.log('\n📱 Comandos úteis:');
  console.log('   - npm start       -> Inicia o servidor Metro (Expo)');
  console.log('   - npm run web     -> Inicia no navegador');
  console.log('   - npm run android -> Inicia no emulador/dispositivo Android');
  console.log('   - npm run typecheck -> Valida tipos TypeScript\n');
}
