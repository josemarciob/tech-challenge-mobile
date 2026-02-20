import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  headerGradient: {
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    marginBottom: 40 
  },
  topNav: { width: '100%', paddingHorizontal: 20, marginBottom: 10 },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, alignSelf: 'flex-start' },

  profileHeader: { alignItems: 'center', marginBottom: 25 },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15
  },
  avatarText: { fontSize: 42, fontWeight: '900', color: '#FFF' },
  levelBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#FDE047', width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#0055D4'
  },
  levelBadgeText: { fontSize: 13, fontWeight: '900', color: '#1E293B' },
  
  name: { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20
  },
  roleText: { color: '#FFF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  statsCard: {
    position: 'absolute', bottom: -45,
    width: '90%', flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 15, elevation: 10
  },
  statBox: { flex: 1, alignItems: 'center' },
  statIconBg: { marginBottom: 8, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 12 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  statLabel: { fontSize: 10, color: '#64748B', fontWeight: '800', textTransform: 'uppercase' },
  vertDivider: { width: 1, height: '70%', backgroundColor: '#E2E8F0', alignSelf: 'center' },

  content: { padding: 24, paddingTop: 30 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#94A3B8', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  
  menuGroup: {
    backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20,
    marginBottom: 30, elevation: 2, shadowColor: "#000", shadowOpacity: 0.02
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  menuIconContainer: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  menuValue: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F8FAFC', width: '100%' },
});