import { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import CustomLoadingScreen from "./src/components/CustomLoadingScreen";

// ⛔ Impede que a splash screen nativa suma sozinha
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomLoading, setShowCustomLoading] = useState(false);
  const [hasMinimumTimePassed, setHasMinimumTimePassed] = useState(false);

  // ESTA FUNÇÃO É A CHAVE: Esconde a splash nativa apenas quando
  // a tela de loading customizada avisa que já está montada e visível.
  const onCustomLoadingMounted = useCallback(async () => {
    try {
      console.log("🔄 CustomLoadingScreen montada, removendo splash nativa...");
      await SplashScreen.hideAsync();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const MINIMUM_LOADING_TIME = 15000; // 15 segundos total
    const SPLASH_SCREEN_TIME = 2000;    // Tempo de exibição da logo estática

    async function prepare() {
      try {
        // FASE 1: Aguarda 2s com a Splash Nativa travada
        await new Promise(resolve => setTimeout(resolve, SPLASH_SCREEN_TIME));
        
        if (isMounted) {
          setShowCustomLoading(true);
          
          // FASE 2: Carregar recursos (API, Banco, etc)
          await loadAppResources();
          
          if (isMounted) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = MINIMUM_LOADING_TIME - elapsedTime;
            
            if (remainingTime > 0) {
              await new Promise(resolve => setTimeout(resolve, remainingTime));
            }
            
            setHasMinimumTimePassed(true);
          }
        }
      } catch (e) {
        console.warn("Erro na inicialização:", e);
        setHasMinimumTimePassed(true);
      } finally {
        if (isMounted) {
          setAppIsReady(true);
        }
      }
    }

    prepare();
    
    return () => { isMounted = false; };
  }, []);

  const loadAppResources = async () => {
    try {
      // Simulação de carregamento (conforme seu original)
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log("✅ Recursos carregados");
    } catch (error) {
      console.warn(error);
    }
  };

  // 1. ESTADO DE CARREGAMENTO (Splash ou Custom Loading)
  if (!appIsReady || !hasMinimumTimePassed) {
    return (
      // A View abaixo garante o fundo azul MESMO ANTES do componente montar
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#006eff" />
        {showCustomLoading && (
          <CustomLoadingScreen onReady={onCustomLoadingMounted} />
        )}
      </View>
    );
  }

  // 2. APP PRINCIPAL
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container de loading com a MESMA cor da splash nativa
  loadingContainer: {
    flex: 1,
    backgroundColor: "#006eff", 
  },
  // Container do app principal
  container: {
    flex: 1,
    backgroundColor: "#ffffff", 
  },
});