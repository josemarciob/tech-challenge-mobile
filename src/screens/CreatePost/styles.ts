import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94A3B8', marginTop: 12, fontSize: 14, fontWeight: '600' },
  
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { padding: 10, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#0F172A", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: "#64748B", fontWeight: '600' },
  iconHeader: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },

  filterSection: { 
    backgroundColor: '#fff', 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24, 
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  
  filterChip: { 
    flexDirection:'row', 
    alignItems:'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: '#F1F5F9', 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  filterChipActiveGrade: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterChipActivePeriod: { backgroundColor: '#006eff', borderColor: '#006eff' },
  filterChipActiveSubject: { backgroundColor: '#10B981', borderColor: '#10B981' },
  filterText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  filterTextActive: { color: '#fff' },

  listContent: { padding: 20, paddingBottom: 50 },

  card: { 
    backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, 
    borderWidth: 1, borderColor: '#E2E8F0',
    elevation: 3, shadowColor: "#0F172A", shadowOpacity: 0.05, shadowRadius: 12
  },
  cardDisabled: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9', opacity: 0.7 },
  
  topicBadge: { 
    alignSelf:'flex-start', 
    backgroundColor:'#EFF6FF', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8, 
    marginBottom: 12 
  },
  topicText: { color: '#006eff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  badgeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#F0F9FF', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#006eff', textTransform: 'uppercase' },
  bnccCode: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#64748B', 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },

  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 8, lineHeight: 24 },
  cardPreview: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 20 },

  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  
  publishBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 16 
  },
  activeBtn: { backgroundColor: '#006eff' },
  postedBtn: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' }, 

  publishText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  postedText: { color: '#10B981', fontWeight: '900', fontSize: 14 },

  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: '#94A3B8', marginTop: 16, fontSize: 16, textAlign: 'center', fontWeight: '600', lineHeight: 24 }
});