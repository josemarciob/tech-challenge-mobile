import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 50 },
  
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: 24,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  
  backBtn: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 5 },
  headerTitles: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "900", color: "#1E293B", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 4, fontWeight: '500' },
  
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: "800", 
    color: "#64748B", 
    textTransform: 'uppercase', 
    marginBottom: 12, 
    marginTop: 5, 
    letterSpacing: 0.5 
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0"
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#FEF2F2" },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: "#1E293B", fontWeight: '500' },
  
  radioGroup: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  radioCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 16, 
    paddingRight: 10 
  },
  radioCardActive: { borderColor: '#006eff', backgroundColor: '#EFF6FF' },
  radioText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  radioTextActive: { color: '#006eff' },
  
  primaryButton: { height: 60, borderRadius: 16, overflow: 'hidden', marginTop: 10, elevation: 4 },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: "#fff", fontWeight: "900", fontSize: 18, letterSpacing: 0.5 },
});