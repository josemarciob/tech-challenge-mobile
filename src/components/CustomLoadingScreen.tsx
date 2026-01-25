import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  StatusBar,
  Dimensions,
  ImageBackground 
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH * 0.7;
const TOTAL_LOADING_TIME = 15000;

interface CustomLoadingProps {
  onReady?: () => void;
}

export default function CustomLoadingScreen({ onReady }: CustomLoadingProps) {
  // ... (Mantenha todas as variáveis de estado e Refs iguais)
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [remainingTime, setRemainingTime] = useState(15); 

  const loadingSteps = [
    { text: 'Inicializando sistema...', percent: 10 },
    // ... mantenha seus steps
    { text: 'Finalizando...', percent: 100 },
  ];

  const tips = [
    '💡 Dica: Estude em blocos de 50 minutos...',
    // ... mantenha suas dicas
  ];

  // ... (Mantenha todo o seu useEffect igualzinho)
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    Animated.timing(fadeValue, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

    Animated.timing(progressValue, { toValue: 1, duration: TOTAL_LOADING_TIME, easing: Easing.linear, useNativeDriver: true }).start();

    // ... Seus intervalos (copie do código anterior)
    const timeInterval = setInterval(() => setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1)), 1000);
    const stepInterval = setInterval(() => setLoadingStep(prev => (prev + 1 >= loadingSteps.length ? prev : prev + 1)), TOTAL_LOADING_TIME / loadingSteps.length);
    const tipInterval = setInterval(() => setCurrentTip(prev => (prev + 1) % tips.length), 4000);

    return () => { clearInterval(timeInterval); clearInterval(stepInterval); clearInterval(tipInterval); };
  }, []);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressScale = progressValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const currentStep = loadingSteps[loadingStep];

  // AQUI VEM A MUDANÇA PRINCIPAL NO RENDER:
  return (
    <Animated.View style={{ flex: 1, opacity: fadeValue }} onLayout={onReady}>
      <ImageBackground 
        source={require('../../assets/TelaInicial.png')} // O caminho da sua imagem
        style={styles.backgroundImage}
        resizeMode="cover" // Garante que ocupe a tela inteira
      >
        {/* Camada escura opcional para dar leitura ao texto sobre a imagem */}
        <View style={styles.overlay}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Animated.View style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>📚</Text>
              </View>
            </Animated.View>
            <Text style={styles.appName}>Ambiente Acadêmico</Text>
            <Text style={styles.appSubtitle}>Sua plataforma de estudos inteligente</Text>
          </View>

          {/* Carregamento */}
          <View style={styles.loadingArea}>
            <Text style={styles.stepText}>{currentStep.text}</Text>
            
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
                <Text style={styles.percentageText}>{currentStep.percent}%</Text>
                <Text style={styles.timeText}>{remainingTime}s restantes</Text>
              </View>
            </View>
            
            {/* Dots */}
            <View style={styles.stepsContainer}>
               {/* ... lógica dos dots igual */}
               {loadingSteps.map((_, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={[styles.stepDot, index <= loadingStep ? styles.stepDotActive : styles.stepDotInactive]} />
                  </View>
               ))}
            </View>
          </View>

          {/* Dicas */}
          <View style={styles.tipsArea}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>Dica para seus estudos</Text>
            </View>
            <Text style={styles.tipText}>{tips[currentTip]}</Text>
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.version}>Versão 1.5.1</Text>
            <Text style={styles.copyright}>© 2026 Ambiente Acadêmico</Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Mudamos o container principal
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Adicionei um overlay para garantir que o texto branco apareça 
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 110, 255, 0.85)', // Um filtro azul transparente sobre a imagem
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between'
  },
  header: { alignItems: 'center', marginTop: 40 },
  logoContainer: { marginBottom: 16 },
  logoCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logoIcon: { fontSize: 56 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 4 },
  appSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center' },
  loadingArea: { alignItems: 'center' },
  stepText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 25, minHeight: 25 },
  progressContainer: { alignItems: 'center', marginBottom: 20 },
  progressBar: { height: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', width: '100%', backgroundColor: '#FFFFFF', borderRadius: 5 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', width: PROGRESS_BAR_WIDTH },
  percentageText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  timeText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  stepsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  stepItem: { alignItems: 'center' },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepDotActive: { backgroundColor: '#FFFFFF' },
  stepDotInactive: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  tipsArea: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 20, marginBottom: 20 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipIcon: { fontSize: 20, marginRight: 10 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  tipText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 20 },
  footer: { alignItems: 'center', marginBottom: 10 },
  version: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 4 },
  copyright: { fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' },
});