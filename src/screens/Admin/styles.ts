import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: { marginTop: 20, marginBottom: 20, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "900", color: "#0F172A", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 4, fontWeight: '500' },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 55, 
    marginBottom: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B', fontWeight: '500' },

  listContent: { paddingHorizontal: 20, paddingTop: 5 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginBottom: 12, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardClickableArea: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16 },
  
  avatar: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: "900" },
  
  info: { flex: 1, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 2 },
  email: { fontSize: 13, color: "#64748B", marginBottom: 8, fontWeight: '400' },
  
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10, 
    gap: 5 
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800", textTransform: 'uppercase', letterSpacing: 0.5 },
  
  cardActions: { flexDirection: 'row', alignItems: 'center', paddingRight: 16, gap: 8 },
  deleteBtn: { padding: 8, backgroundColor: '#FFF5F5', borderRadius: 12 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 15, fontSize: 16, fontWeight: '600' },
});