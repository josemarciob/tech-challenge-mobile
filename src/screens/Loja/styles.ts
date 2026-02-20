import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  
  // Header
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, marginBottom: 25 
  },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748B', fontWeight: '600', marginTop: 2 },
  balancePill: { 
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    elevation: 6, shadowColor: '#D97706', shadowOpacity: 0.3, shadowRadius: 10
  },
  balanceText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  // Categorias
  categoryContainer: { 
    flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 
  },
  tab: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 16, 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' 
  },
  tabActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  tabLabel: { fontSize: 13, fontWeight: '800', color: '#64748B' },
  tabLabelActive: { color: '#FFF' },

  // Lista
  listContent: { paddingHorizontal: 20, paddingTop: 5 },
  card: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 26, padding: 16, marginBottom: 16, 
    borderWidth: 1, borderColor: '#F1F5F9',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12
  },
  cardPurchased: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', opacity: 0.8 },
  
  iconBox: { 
    width: 64, height: 64, borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', marginRight: 16 
  },
  
  cardContent: { flex: 1, paddingRight: 8 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  itemDesc: { fontSize: 12, color: '#64748B', lineHeight: 18, fontWeight: '500' },

  priceTag: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 8, 
    borderRadius: 14, borderWidth: 1, borderColor: '#FDE68A'
  },
  priceText: { fontSize: 15, fontWeight: '900', color: '#D97706' },

  purchasedBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 8, 
    borderRadius: 14, borderWidth: 1, borderColor: '#A7F3D0'
  },
  purchasedText: { fontSize: 12, fontWeight: '900', color: '#15803D' },
});