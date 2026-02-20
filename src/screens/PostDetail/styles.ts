import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#fff' },
  heroBackground: { paddingBottom: 20 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconButton: { padding: 10, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  actions: { flexDirection: 'row', gap: 10 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 180 },
  
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: '#EFF6FF', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  categoryText: { color: '#006eff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', lineHeight: 36, marginBottom: 20, letterSpacing: -0.5 },
  
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  authorName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  postDate: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  timeText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 24 },
  body: { fontSize: 17, lineHeight: 30, color: '#334155', fontWeight: '400' },
  
  footer: { padding: 24, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderColor: '#F1F5F9' },
  btnStart: { borderRadius: 18, overflow: 'hidden', elevation: 8, shadowColor: "#006eff", shadowOpacity: 0.3, shadowRadius: 12 },
  gradientBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 12 },
  btnStartText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  btnSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  
  lockedContainer: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  lockedHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 10 },
  lockedTitle: { fontWeight: '900', fontSize: 16, color: '#1E293B' },
  lockedFooterRow: { flexDirection:'row', justifyContent:'space-between', alignItems: 'center' },
  lockedSub: { fontSize: 14, color: '#64748B', fontWeight: '700' },
  lockBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  lockText: { fontSize: 11, fontWeight: '800', color: '#64748B' },

  // Quiz Progresso
  quizContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  quizHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 15 },
  progressBar: { flex: 1, height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#006eff' },
  progressText: { fontSize: 14, fontWeight: '900', color: '#64748B' },
  
  questionBox: { paddingHorizontal: 24 },
  questionText: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginBottom: 40, lineHeight: 32 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 22, borderRadius: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.03 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#006eff' },
  optionText: { fontSize: 16, color: '#1E293B', fontWeight: '700', flex: 1 },

  // Resultados do Quiz
  resultBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  resultTitle: { fontSize: 32, fontWeight: '900', marginTop: 20, marginBottom: 10, color: '#0F172A' },
  resultSub: { fontSize: 16, color: '#64748B', marginBottom: 40, textAlign: 'center', fontWeight: '500' },
  rewardBox: { backgroundColor: '#ECFDF5', padding: 24, borderRadius: 28, alignItems: 'center', marginBottom: 40, width: '100%', borderWidth: 2, borderColor: '#10B981' },
  rewardLabel: { fontSize: 12, fontWeight: '900', color: '#059669', letterSpacing: 1.5, marginBottom: 15 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  rewardValue: { fontSize: 26, fontWeight: '900', color: '#047857' },
  levelUpBadge: { marginTop: 20, backgroundColor: '#FFFBEB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: '#FCD34D' },
  levelUpText: { fontSize: 15, fontWeight: '900', color: '#D97706' },
  btnResultPrimary: { width: '100%', backgroundColor: '#0F172A', padding: 20, borderRadius: 18, alignItems: 'center' },
  retryBtn: { marginTop: 25, flexDirection: 'row', alignItems: 'center', gap: 8 },
  retryText: { color: '#006eff', fontWeight: '800', fontSize: 15 }
});