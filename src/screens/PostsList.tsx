import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../services/api';

type Post = { id: string; title: string; author: string; description: string };

export default function PostsList({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.get('/posts').then(res => setPosts(res.data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.id })}>
            <View style={styles.card}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text>{item.author}</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, borderRadius: 6 },
  postTitle: { fontWeight: 'bold' },
});
