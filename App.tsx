// App.tsx
import { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import CustomLoadingScreen from "./src/components/Loading";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false); // 🔥 Novo estado

  const onCustomLoadingMounted = useCallback(async () => {
    try {
      await SplashScreen.hideAsync(); // Esconde a splash nativa do Android/iOS
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleLoadingFinished = useCallback(() => {
    setLoadingFinished(true); // 🔥 Avisa que a animação de 3s da barra acabou
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Pré-carregamento de fontes ou dados se necessário aqui
        await new Promise(resolve => setTimeout(resolve, 500)); 
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // Só sai da tela de loading quando o app estiver pronto E a animação de 100% acabar
  if (!appIsReady || !loadingFinished) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#006eff" />
        <CustomLoadingScreen 
          onReady={() => {
            onCustomLoadingMounted(); // Esconde a splash preta/branca nativa
            handleLoadingFinished();  // Libera a entrada no app após a barra de %
          }} 
        />
      </View>
    );
  }

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
  loadingContainer: { 
    flex: 1, 
    backgroundColor: "#006eff" 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#ffffff" 
  },
});