import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

type Post = { 
    id: string; 
    title: string; 
    authorName: string; 
    content: string 
};

export default function PostsList({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // recarrega sempre que a tela volta ao foco
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>

      {/* Botão para criar novo post */}
      <Button title="Novo Post" onPress={() => navigation.navigate('CriarAtividade')} />


      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetalhesAtividade', { id: item.id })}>
              <View style={styles.card}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text>{item.authorName}</Text>
                <Text>{item.content}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, borderRadius: 6 },
  postTitle: { fontWeight: 'bold' },
});
