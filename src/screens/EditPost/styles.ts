import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loaderText: { marginTop: 12, color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  backBtn: { 
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: "#0F172A",
    letterSpacing: -0.5
  },
  
  scroll: { padding: 24 },
  label: { 
    fontSize: 13, 
    fontWeight: "800", 
    color: "#64748B", 
    marginBottom: 10, 
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  
  inputTitle: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#1E293B", 
    borderBottomWidth: 2, 
    borderBottomColor: "#E2E8F0", 
    paddingVertical: 12,
    backgroundColor: 'transparent'
  },
  
  inputContent: { 
    fontSize: 16, 
    color: "#334155", 
    minHeight: 250, 
    lineHeight: 26, 
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    textAlignVertical: 'top'
  },
  
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  submitButton: { 
    height: 60,
    borderRadius: 18, 
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#006eff",
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10,
  },
  submitText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "900",
    letterSpacing: 0.5
  },
});