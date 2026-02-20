import React, { memo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Coins, Package, Minus, Plus } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { styles, COLORS } from '../styles';
import { getGameAsset } from '../assets';

export const ShopItemCard = memo(({ 
  item, isLockedLevel, isLockedActivity, requiredActivities, 
  isDisabled, disableReason, userCoins, maxAllowed, onBuy 
}: any) => {
  const [quantity, setQuantity] = useState(1);
  const img = getGameAsset(item.icon, item.name);

  // Reseta a quantidade para 1 se o item for bloqueado ou recarregado
  useEffect(() => {
    setQuantity(1);
  }, [item.id, isDisabled]);

  const totalPrice = item.price * quantity;
  const canAfford = userCoins >= totalPrice;

  const handleIncrease = () => {
    if (quantity < maxAllowed) setQuantity(q => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };
  
  return (
    <MotiView 
      from={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      style={[styles.shopCard, isDisabled && { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <View style={{ backgroundColor: isLockedLevel ? '#E2E8F0' : '#EFF6FF', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ fontSize: 9, fontWeight: '900', color: isLockedLevel ? '#94A3B8' : COLORS.accent.blue }}>
            Lvl {item.unlockLevel}
          </Text>
        </View>

        {requiredActivities > 0 && (
          <View style={{ backgroundColor: isLockedActivity ? '#E2E8F0' : '#ECFDF5', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: '900', color: isLockedActivity ? '#94A3B8' : COLORS.accent.green }}>
              ✓ {requiredActivities} Ativ.
            </Text>
          </View>
        )}
      </View>

      <View style={{ width: 60, height: 60, alignSelf: 'center', marginBottom: 12 }}>
        {img ? (
          <Image source={img} style={{ width: '100%', height: '100%', opacity: isDisabled ? 0.4 : 1 }} resizeMode="contain" />
        ) : (
          <Package size={32} color="#CBD5E1" />
        )}
      </View>

      <Text numberOfLines={1} style={[styles.shopBtnText, { color: COLORS.text.main, textAlign: 'center', marginBottom: 8, fontWeight: '800' }]}>
        {item.name}
      </Text>
      
      {!isDisabled ? (
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {/* Valor Multiplicado */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <Coins size={14} color={COLORS.accent.gold} weight="fill" />
            <Text style={{ fontSize: 15, fontWeight: '900', color: canAfford ? COLORS.accent.gold : COLORS.accent.red }}>
              {totalPrice}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 4, paddingVertical: 2 }}>
            <TouchableOpacity onPress={handleDecrease} style={{ padding: 4, opacity: quantity <= 1 ? 0.3 : 1 }} disabled={quantity <= 1}>
              <Minus size={12} color={COLORS.text.main} weight="bold" />
            </TouchableOpacity>
            
            <Text style={{ marginHorizontal: 8, fontSize: 12, fontWeight: '800', color: COLORS.text.main, width: 20, textAlign: 'center' }}>
              {quantity}
            </Text>
            
            <TouchableOpacity onPress={handleIncrease} style={{ padding: 4, opacity: quantity >= maxAllowed ? 0.3 : 1 }} disabled={quantity >= maxAllowed}>
              <Plus size={12} color={COLORS.text.main} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ height: 50, justifyContent: 'center', marginBottom: 2 }}>
           <Text style={{ fontSize: 9, color: COLORS.accent.red, fontWeight: '900', textAlign: 'center' }}>
             {disableReason}
           </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.shopBtn, { backgroundColor: isDisabled || !canAfford ? '#F1F5F9' : COLORS.accent.blue }]} 
        onPress={() => onBuy(quantity)} 
        activeOpacity={0.7}
        disabled={isDisabled || !canAfford}
      >
        <Text style={[styles.shopBtnText, (isDisabled || !canAfford) && { color: '#94A3B8' }]}>
          {(isLockedLevel || isLockedActivity) ? "BLOQUEADO" : isDisabled ? "INDISPONÍVEL" : canAfford ? "COMPRAR" : "SEM SALDO"}
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
});