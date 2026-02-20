// src/navigation/types.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  Perfil: { userId?: number } | undefined; 
  AdminScreen: undefined;
  PostsList: undefined;
  CreatePost: undefined;
  EditPost: { id: number }; 
  PostDetail: { id: number }; 
  UserDetail: { id: number }; 
};