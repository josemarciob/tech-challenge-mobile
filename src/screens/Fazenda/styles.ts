import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const COLORS = {
  bg: '#F4F6F8',
  cardBg: '#FFFFFF',
  text: { 
    main: '#0F172A', 
    muted: '#64748B',
    white: '#FFFFFF' 
  },
  accent: { 
    blue: '#006EFF', 
    green: '#10B981', 
    gold: '#F59E0B', 
    red: '#EF4444' 
  },
};

export const styles = StyleSheet.create({
  // ==========================================
  // LAYOUT BASE
  // ==========================================
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  body: { paddingHorizontal: 20 },

  // ==========================================
  // HEADER & PROFILE
  // ==========================================
  headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 25 },
  profileCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#0F172A', 
    shadowOpacity: 0.06, 
    shadowRadius: 15, 
    elevation: 5, 
    marginBottom: 20 
  },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.accent.blue, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  welcomeText: { fontSize: 10, fontWeight: '800', color: COLORS.text.muted, letterSpacing: 0.5 },
  userName: { fontSize: 18, fontWeight: '800', color: COLORS.text.main, maxWidth: 150 },
  
  coinPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#FFFBEB', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#FEF3C7' 
  },
  coinText: { fontSize: 15, fontWeight: '900', color: '#D97706' },

  // --- LEVEL & XP ---
  levelXpRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadgeWrapper: { position: 'relative', alignSelf: 'center' },
  levelBox: { 
    width: 55, 
    height: 55, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#FDE047', 
    elevation: 4 
  },
  levelBoxLabel: { fontSize: 8, fontWeight: '900', color: '#FFF' },
  levelBoxNum: { fontSize: 22, fontWeight: '900', color: '#FFF', marginTop: -2 },
  levelSparkleDeco: { position: 'absolute', top: -6, right: -6, zIndex: 2 },
  
  xpSection: { flex: 1 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpLabel: { fontSize: 10, fontWeight: '800', color: COLORS.text.muted },
  xpValue: { fontSize: 12, fontWeight: '800', color: COLORS.text.main },
  xpBarBg: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: COLORS.accent.green },

  // ==========================================
  // QUICK NAV 
  // ==========================================
  quickNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    zIndex: 10, 
    elevation: 10, 
    backgroundColor: 'transparent', 
    marginTop: 5, 
  },
  navItem: { alignItems: 'center', width: '22%', zIndex: 11 },
  navIconBox: { 
    width: 64, 
    height: 64, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 2, 
    marginBottom: 8 
  },
  pixelIconSmall: { width: '60%', height: '60%' },
  navLabel: { fontSize: 11, fontWeight: '700', color: COLORS.text.muted },
  navBadge: { 
    position: 'absolute', top: -5, right: -5, 
    backgroundColor: COLORS.accent.red, 
    paddingHorizontal: 6, paddingVertical: 2, 
    borderRadius: 10, borderWidth: 2, borderColor: '#FFF' 
  },

  // ==========================================
  // GRID DE TERRAS (PlantSlot)
  // ==========================================
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.main },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  gridSlotWrapper: { width: '31%', aspectRatio: 0.85 },
  gridSlot: { flex: 1, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  slotEmpty: { backgroundColor: '#F1F5F9', borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  slotOccupied: { backgroundColor: '#FFF', elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  plantArtLarge: { width: '70%', height: '60%' },
  
  // --- Estados do Slot ---
  slotCollectBtn: { backgroundColor: COLORS.accent.green, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8, marginTop: 8 },
  slotCollectText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  slotTimerPill: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#F8FAFC', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  slotTimerText: { fontSize: 10, color: COLORS.text.muted, fontWeight: '700' },

  // ==========================================
  // MODAIS REUTILIZÁVEIS
  // ==========================================
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text.main },

  // ==========================================
  // MERCADO (ShopItem)
  // ==========================================
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 4, marginBottom: 20 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabItemActive: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '700', color: COLORS.text.muted },
  
  shopCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    elevation: 2, 
    marginBottom: 15 
  },
  shopBtn: { width: '100%', paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  shopBtnText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  // --- Badges e Controles do Mercado ---
  shopBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  shopBadgeLevel: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  shopBadgeActivity: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  shopBadgeText: { fontSize: 9, fontWeight: '900' },
  
  shopPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 },
  shopPriceText: { fontSize: 15, fontWeight: '900' },
  
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 4, paddingVertical: 2 },
  quantityBtn: { padding: 4 },
  quantityText: { marginHorizontal: 8, fontSize: 12, fontWeight: '800', color: COLORS.text.main, width: 20, textAlign: 'center' },

  // ==========================================
  // ARMAZÉM & INVENTÁRIO
  // ==========================================
  inventoryGridCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    elevation: 2, 
    marginBottom: 15 
  },
  inventoryQtyBadge: { fontSize: 10, fontWeight: '800', color: COLORS.accent.blue, backgroundColor: '#EFF6FF', alignSelf: 'flex-end', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
  
  // ==========================================
  // GALINHEIRO (CoopCard)
  // ==========================================
  productionCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 24, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    shadowColor: '#0F172A', 
    shadowOpacity: 0.05, 
    shadowRadius: 15, 
    shadowOffset: {width: 0, height: 8}, 
    elevation: 3, 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  eggVisualizerRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  eggIconWrapper: { width: 32, height: 40 },
  eggIconImg: { width: '100%', height: '100%' },
  eggIconDimmed: { opacity: 0.15, tintColor: '#94A3B8' }, 
  productionStatusText: { fontSize: 16, fontWeight: '900', color: COLORS.text.main, textAlign: 'center', marginBottom: 16 },
  
  timerPillLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFBEB', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 20, gap: 8 },
  timerPillText: { fontSize: 13, color: '#D97706', fontWeight: '600' },
  timerPillTime: { fontWeight: '900', color: '#B45309' },
  
  fullBasketAlert: { backgroundColor: '#FEFCE8', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', marginBottom: 16 },
  fullBasketText: { color: '#D97706', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  
  btnCollectLarge: { backgroundColor: COLORS.accent.green, width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  btnCollectLargeText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },

  // ==========================================
  // EMPTY STATES
  // ==========================================
  emptyStateCard: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 24, 
    padding: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E2E8F0', 
    borderStyle: 'dashed', 
    marginBottom: 20 
  },
  emptyStateText: { marginTop: 16, fontSize: 15, color: COLORS.text.main, fontWeight: '800', textAlign: 'center' },
  emptyStateSub: { marginTop: 4, fontSize: 13, color: COLORS.text.muted, fontWeight: '500', textAlign: 'center', marginBottom: 24 },
});