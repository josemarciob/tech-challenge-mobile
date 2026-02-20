import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: "#006eff",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2, fontWeight: '600' },

  listContent: { padding: 20, paddingTop: 20 },
  
  card: { 
    backgroundColor: "#fff", borderRadius: 24, padding: 20, marginBottom: 16, 
    elevation: 3, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 12,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  cardCompleted: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: { 
    width: 48, height: 48, borderRadius: 16, backgroundColor: '#EFF6FF', 
    justifyContent: 'center', alignItems: 'center', marginRight: 14 
  },
  title: { fontSize: 17, fontWeight: "800", color: "#1E293B", marginBottom: 4 },
  authorBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorText: { fontSize: 12, color: "#64748B", fontWeight: "700" },
  
  statusBadge: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },

  preview: { fontSize: 14, color: "#64748B", lineHeight: 22, marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnPrimary: { 
    backgroundColor: '#006eff', paddingHorizontal: 18, paddingVertical: 10, 
    borderRadius: 12, alignSelf: 'flex-start'
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { color: '#94A3B8', fontSize: 16, marginTop: 15, fontWeight: '600', textAlign: 'center' },

  loadingFooter: { paddingVertical: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  loadingText: { color: '#006eff', fontSize: 13, fontWeight: '700' },
});