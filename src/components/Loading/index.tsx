import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StatusBar, ImageBackground } from 'react-native';
import { BookOpen, Lightbulb } from 'phosphor-react-native';

import { styles } from './styles';
import { LOADING_STEPS, TIPS, TOTAL_LOADING_TIME, APP_VERSION } from './constants';

interface LoadingProps {
  onReady?: () => void;
}

export default function CustomLoadingScreen({ onReady }: LoadingProps) {
  const [percent, setPercent] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  const progressValue = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const stepRef = useRef(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    Animated.parallel([
      Animated.timing(fadeValue, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(progressValue, { 
        toValue: 1, 
        duration: TOTAL_LOADING_TIME, 
        easing: Easing.linear, 
        useNativeDriver: false 
      }),
    ]).start(() => {
      // Agora este callback será chamado quando a barra chegar a 100%!
      console.log("Loading completo!");
      onReady?.();
    });

    const listenerId = progressValue.addListener(({ value }) => {
      setPercent(Math.floor(value * 100));
      const newStepIndex = LOADING_STEPS.reduce((acc, step, index) => (value >= step.threshold ? index : acc), 0);
      
      if (newStepIndex !== stepRef.current) {
        stepRef.current = newStepIndex;
        setLoadingStep(newStepIndex);
      }
    });

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 2500);

    return () => {
      progressValue.removeListener(listenerId);
      clearInterval(tipInterval);
    };
  }, []);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressWidth = progressValue.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <ImageBackground 
        source={require('../../../assets/TelaInicial.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          
          <View style={styles.header}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <View style={styles.logoCircle}>
                <BookOpen size={48} color="#FFF" weight="duotone" />
              </View>
            </Animated.View>
            <Text style={styles.appName}>Ambiente Acadêmico</Text>
            <Text style={styles.appSubtitle}>Aprendizado Gamificado e Inteligente</Text>
          </View>

          <View style={styles.loadingArea}>
            <Text style={styles.stepText}>{LOADING_STEPS[loadingStep].text}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.percentageText}>{percent}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsArea}>
            <View style={styles.tipTitleRow}>
              <Lightbulb size={20} color="#FFF" weight="fill" />
              <Text style={styles.tipTitle}>Dica de Estudo</Text>
            </View>
            <Text style={styles.tipText}>{TIPS[currentTip]}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>{APP_VERSION}</Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}