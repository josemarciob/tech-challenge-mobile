import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, StyleSheet, Animated, Easing, 
  StatusBar, Dimensions, ImageBackground 
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH * 0.7;
const TOTAL_LOADING_TIME = 15000;

const loadingSteps = [
  { text: 'Inicializando sistema...', threshold: 0.1 },
  { text: 'Conectando ao banco de dados...', threshold: 0.4 },
  { text: 'Carregando módulos acadêmicos...', threshold: 0.7 },
  { text: 'Finalizando...', threshold: 0.9 },
];

const tips = [
  ' Estude em blocos de 50 minutos...',
  ' Mantenha-se hidratado durante os estudos.',
  ' Revise o conteúdo em 24 horas.',
];

export default function CustomLoadingScreen({ onReady }: { onReady?: () => void }) {
  const [percent, setPercent] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  // Refs de Animação
  const progressValue = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Iniciar animações visuais
    Animated.parallel([
      Animated.timing(fadeValue, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(progressValue, { 
        toValue: 1, 
        duration: TOTAL_LOADING_TIME, 
        easing: Easing.linear, 
        useNativeDriver: true 
      }),
      Animated.loop(
        Animated.timing(spinValue, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
      )
    ]).start();

    // LISTENER DE PROGRESSO
    const listenerId = progressValue.addListener(({ value }) => {
      // Atualiza Porcentagem
      const currentPercent = Math.floor(value * 100);
      setPercent(currentPercent);

      // Atualiza os Steps
      const stepIndex = loadingSteps.findLastIndex(s => value >= s.threshold);
      if (stepIndex !== -1) setLoadingStep(stepIndex);
    });

    // Troca de dicas
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 4500);

    return () => {
      progressValue.removeListener(listenerId);
      clearInterval(tipInterval);
    };
  }, []);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressScale = progressValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]} onLayout={onReady}>
      <ImageBackground 
        source={require('../../assets/TelaInicial.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          
          <View style={styles.header}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <View style={styles.logoCircle}><Text style={styles.logoIcon}>📚</Text></View>
            </Animated.View>
            <Text style={styles.appName}>Ambiente Acadêmico</Text>
            <Text style={styles.appSubtitle}>Sua plataforma de estudos inteligente</Text>
          </View>

          <View style={styles.loadingArea}>
            <Text style={styles.stepText}>{loadingSteps[loadingStep].text}</Text>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: PROGRESS_BAR_WIDTH }]}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { transform: [{ scaleX: progressScale }], transformOrigin: 'left' }
                  ]} 
                />
              </View>
              
              <View style={styles.progressInfo}>
                <Text style={styles.percentageText}>{percent}%</Text>
                <Text style={styles.timeText}>{Math.max(0, 15 - Math.floor((percent * 15)/100))}s restantes</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsArea}>
            <Text style={styles.tipTitle}>💡 Dica para seus estudos</Text>
            <Text style={styles.tipText}>{tips[currentTip]}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Versão 2.1.0</Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: {
    flex: 1, 
    backgroundColor: 'rgba(0, 110, 255, 0.85)', 
    padding: 20, 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: { alignItems: 'center', marginTop: 60 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  logoIcon: { fontSize: 50 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginTop: 15 },
  appSubtitle: { fontSize: 14, color: '#EEE' },
  loadingArea: { width: '100%', alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 16, marginBottom: 10, fontWeight: '500' },
  progressContainer: { width: PROGRESS_BAR_WIDTH },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF' },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  percentageText: { color: '#FFF', fontWeight: 'bold' },
  timeText: { color: '#EEE', fontSize: 12 },
  tipsArea: { 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    padding: 15, borderRadius: 12, width: '100%' 
  },
  tipTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 5 },
  tipText: { color: '#FFF', fontSize: 13 },
  footer: { marginBottom: 20 },
  version: { color: 'rgba(255,255,255,0.5)', fontSize: 12 }
});