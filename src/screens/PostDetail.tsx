import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

type Post = {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
};

export default function PostDetail({ route }: any) {
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Nenhuma Atividade Encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Por {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  author: { fontSize: 16, marginBottom: 16, color: '#555' },
  content: { fontSize: 16, lineHeight: 22 },
});
