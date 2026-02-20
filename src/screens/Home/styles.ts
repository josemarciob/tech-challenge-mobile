import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F4F6F8" },
  loadingText: { marginTop: 15, color: '#64748B', fontWeight: '600' },
  scrollContent: { padding: 24 },
  
  // Header
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },
  headerAvatar: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 4 },
  headerAvatarText: { color: '#fff', fontSize: 18, fontWeight: '900' },

  // Student Hero
  heroCard: { borderRadius: 30, padding: 26, marginBottom: 35, elevation: 12, shadowColor: '#0F172A', shadowOpacity: 0.25, shadowRadius: 20, overflow: 'hidden' },
  heroBgIcon: { position: 'absolute', right: -20, top: -20, transform: [{ rotate: '15deg' }] },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  coinPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  coinPillText: { color: '#FDE047', fontWeight: '900', fontSize: 14 },
  xpSection: { marginBottom: 25 },
  xpLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  xpTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  xpValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
  progressBarBg: { height: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 6 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  heroFooterText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Admin Stats
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  adminStatCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  adminStatValue: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  adminStatLabel: { fontSize: 12, color: '#64748B', fontWeight: '800', textTransform: 'uppercase' },

  // Ferramenta Grid
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 30 },
  toolButton: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, alignItems: 'flex-start', elevation: 3, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, borderWidth: 1, borderColor: '#F1F5F9', width: (width - 62) / 2 },
  toolButtonText: { color: '#1E293B', fontSize: 15, fontWeight: '800', marginTop: 10 },

  //professor insights
  insightCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  insightTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  insightText: { fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' },

  // Acesso Rápido 
  gridContainer: { marginBottom: 20 },
  actionCard: { padding: 22, borderRadius: 28, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  actionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  actionIconBubble: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  actionSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },

  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 10 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 18, backgroundColor: '#FEF2F2', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { color: '#EF4444', fontWeight: '800', marginLeft: 8, fontSize: 15 },
});