import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { 
  Coins, Lightning, Medal, UserCircle, 
  Fire, Star, Clock, CheckCircle, ShieldStar 
} from "phosphor-react-native";

import { useAuth } from "../../context/AuthContext";
import { styles } from "./styles";

// ==========================================
// CONFIGURAÇÃO DOS ITENS
// ==========================================
const ACADEMIC_ITEMS = [
  { id: 'v1', category: 'boost', name: 'Escudo', desc: 'Protege sua Sequência se você faltar 1 dia.', price: 1500, icon: Fire, color: '#EF4444' },
  { id: 'v2', category: 'boost', name: 'Foco Estendido', desc: 'Garante +5 minutos em testes cronometrados.', price: 2500, icon: Clock, color: '#3B82F6' },
  { id: 'v3', category: 'boost', name: 'Meio a Meio', desc: 'Elimina a metade de alternativas incorretas em um quiz.', price: 3000, icon: Lightning, color: '#8B5CF6' },
  
  { id: 'a1', category: 'avatar', name: 'Pequeno Gafanhoto', desc: 'Avatar exclusivo para alunos dedicados.', price: 500, icon: UserCircle, color: '#10B981' },
  { id: 'a2', category: 'avatar', name: 'Mestre Gafanhoto', desc: 'Mostre que você esta dominando os estudos.', price: 10000, icon: UserCircle, color: '#6366F1' },
  
  { id: 't1', category: 'title', name: 'Título: "Aprendiz"', desc: 'Fica visível abaixo do seu nome no perfil.', price: 800, icon: Medal, color: '#F59E0B' },
  { id: 't2', category: 'title', name: 'Título: "Grão-Mestre"', desc: 'O título mais cobiçado da academia.', price: 20000, icon: Star, color: '#F43F5E' },
];

export default function Loja() {
  const { user, updateUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<'boost' | 'avatar' | 'title'>('boost');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handleBuy = (item: any) => {
    if (!user) return;

    if (purchasedItems.includes(item.id)) {
      Alert.alert("Já adquirido", "Você já possui este item!");
      return;
    }

    if (user.coins < item.price) { 
      Alert.alert("Saldo Insuficiente", "Conclua mais quizzes para ganhar moedas!");
      return;
    }

    Alert.alert(
      "Confirmar Compra",
      `Adquirir "${item.name}" por ${item.price} moedas?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Comprar", 
          onPress: () => {
            updateUser({ coins: user.coins - item.price });
            setPurchasedItems(prev => [...prev, item.id]);
            Alert.alert("🎉 Sucesso!", `Você adquiriu: ${item.name}`);
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: typeof ACADEMIC_ITEMS[0], index: number }) => {
    const isPurchased = purchasedItems.includes(item.id);
    const IconComponent = item.icon;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 50 }}
      >
        <TouchableOpacity 
          style={[styles.card, isPurchased && styles.cardPurchased]}
          onPress={() => handleBuy(item)}
          disabled={isPurchased}
        >
          <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
            <IconComponent size={32} color={item.color} weight="duotone" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
          </View>

          {isPurchased ? (
            <View style={styles.purchasedBadge}>
              <CheckCircle size={18} color="#10B981" weight="fill" />
              <Text style={styles.purchasedText}>Feito</Text>
            </View>
          ) : (
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{item.price}</Text>
              <Coins size={18} color="#F59E0B" weight="fill" />
            </View>
          )}
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Bazar</Text>
          <Text style={styles.subtitle}>Evolua seu perfil acadêmico</Text>
        </View>
        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.balancePill} start={{x:0, y:0}} end={{x:1, y:1}}>
          <Coins size={22} color="#FFF" weight="fill" />
          <Text style={styles.balanceText}>{user?.coins?.toLocaleString() || 0}</Text>
        </LinearGradient>
      </View>

      <View style={styles.categoryContainer}>
        <CategoryTab 
          label="Vantagens" icon={Lightning} 
          active={category === 'boost'} onPress={() => setCategory('boost')} 
        />
        <CategoryTab 
          label="Avatares" icon={UserCircle} 
          active={category === 'avatar'} onPress={() => setCategory('avatar')} 
        />
        <CategoryTab 
          label="Títulos" icon={ShieldStar} 
          active={category === 'title'} onPress={() => setCategory('title')} 
        />
      </View>

      <FlatList
        data={ACADEMIC_ITEMS.filter(i => i.category === category)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const CategoryTab = ({ label, icon: Icon, active, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.tab, active && styles.tabActive]} 
    onPress={onPress}
  >
    <Icon size={18} color={active ? '#FFF' : '#64748B'} weight={active ? "fill" : "bold"} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);