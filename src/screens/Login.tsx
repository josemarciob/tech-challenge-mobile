import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen({ navigation }: any) {
  const { control, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
  console.log("Tentando login com:", data);
  try {
    await login(data.email, data.password);
    console.log("Login OK, indo para Atividades...");
    navigation.replace('Atividades');
  } catch (err) {
    console.error("Erro no login:", err);
    alert('Error ao fazer login. Verifique suas credenciais.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={{ height: 12 }} />
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Senha é obrigatória' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            value={value}
            onChangeText={onChange}
          />
        )}
      />


      <Button title="Entrar" onPress={handleSubmit(onSubmit)} />
      <View style={{ height: 16 }} />
      <Button title="Cadastrar" onPress={handleSubmit(onSubmit)} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize:28, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
});
