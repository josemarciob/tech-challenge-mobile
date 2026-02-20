import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 25 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 50 },
  
  // Header
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  logoTitle: { fontSize: 32, fontWeight: '900', color: '#FFF', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Card
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 25 },
  
  // Inputs
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0"
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#FEF2F2" },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: "#1E293B", fontWeight: '500' },
  
  forgotPass: { alignSelf: 'flex-end', marginBottom: 25, paddingRight: 4 },
  forgotPassText: { color: "#006eff", fontSize: 14, fontWeight: '700' },

  // Botões
  primaryButton: { height: 60, borderRadius: 18, overflow: 'hidden' },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  primaryButtonText: { color: "#fff", fontWeight: "900", fontSize: 18, letterSpacing: 0.5 },

  // Footer
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30, 
    alignItems: 'center' 
  },
  footerText: { color: '#64748B', fontSize: 15, fontWeight: '500' },
  linkText: { color: '#006eff', fontWeight: '800', fontSize: 15 },
  
  copyright: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 40,
    fontWeight: '600'
  }
});