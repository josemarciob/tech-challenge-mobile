import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 2; 

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  // Header 
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 10 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: '#64748B', fontWeight: '600', marginBottom: 20 },
  
  // Hero Card
  heroCard: { 
    borderRadius: 24, padding: 24, overflow: 'hidden', elevation: 8,
    shadowColor: '#6D28D9', shadowOpacity: 0.3, shadowRadius: 15,
  },
  heroBgIcon: { position: 'absolute', right: -15, bottom: -20, transform: [{ rotate: '-15deg' }] },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  heroScore: { color: '#FFF', fontSize: 34, fontWeight: '900' },
  heroScoreMuted: { fontSize: 20, color: 'rgba(255,255,255,0.6)' },
  percentCircle: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' 
  },
  percentText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  // Grid
  listContent: { paddingHorizontal: 20, paddingTop: 5 },
  row: { justifyContent: 'space-between', marginBottom: 15 },

  // Card Conquista
  badgeCard: { 
    backgroundColor: '#FFF', width: COLUMN_WIDTH, borderRadius: 28, padding: 16, 
    alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  badgeLocked: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', elevation: 0, opacity: 0.8 },
  cardHeader: { width: '100%', alignItems: 'flex-end', height: 15 },
  
  iconContainer: { 
    width: 64, height: 64, borderRadius: 22, justifyContent: 'center', 
    alignItems: 'center', marginBottom: 12 
  },
  badgeTitle: { fontSize: 13, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  badgeDesc: { fontSize: 11, color: '#64748B', textAlign: 'center', fontWeight: '600', marginBottom: 15, height: 32 },

  // Progresso
  progressSection: { width: '100%', marginTop: 'auto' },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase' },
  progressValues: { fontSize: 10, fontWeight: '900', color: '#64748B' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  // Badge Concluído
  completedBadge: { width: '100%', paddingVertical: 8, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  completedText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});