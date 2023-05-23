import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('alunos.db');

export default function App() {
  
  const CadastroAluno = () => {
    const [nome, setNome] = useState('');
    const [ra, setRA] = useState('');
    const [siglaCurso, setSiglaCurso] = useState('');
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, ra TEXT, siglaCurso TEXT);'
        );
      }, null, console.log('Tabela criada ou verificada com sucesso'));

      carregarAlunos();
    }, []);

    const carregarAlunos = async () => {
      try {
        const value = await AsyncStorage.getItem('alunos');
        if (value !== null) {
          setAlunos(JSON.parse(value));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const salvarAlunos = async (alunos) => {
      try {
        await AsyncStorage.setItem('alunos', JSON.stringify(alunos));
      } catch (error) {
        console.error(error);
      }
    };

    const handleSalvarAluno = () => {
      if (nome && ra && siglaCurso) {
        const novoAluno = {
          id: Date.now(),
          nome,
          ra,
          siglaCurso,
        };
        setAlunos([...alunos, novoAluno]);
        salvarAlunos([...alunos, novoAluno]);
        setNome('');
        setRA('');
        setSiglaCurso('');
      }
    };

    const handleExcluirAluno = (id) => {
      const novosAlunos = alunos.filter(aluno => aluno.id !== id);
      setAlunos(novosAlunos);
      salvarAlunos(novosAlunos);
    };

    const renderItem = ({ item }) => (
      <ItemAluno
        nome={item.nome}
        ra={item.ra}
        siglaCurso={item.siglaCurso}
        onPressExcluir={() => handleExcluirAluno(item.id)}
      />
    );

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do aluno"
          onChangeText={setNome}
          value={nome}
        />
        <Text style={styles.label}>RA</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o RA do aluno"
          onChangeText={setRA}
          value={ra}
        />
        <Text style={styles.label}>Sigla do curso da graduação</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a sigla do curso da graduação do aluno"
          onChangeText={setSiglaCurso}
          value={siglaCurso}
        />
        <Button title="Salvar" onPress={handleSalvarAluno} />
        <Text style={styles.listaAlunos}>Alunos cadastrados</Text>
        <FlatList
          data={alunos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };

  const ItemAluno = ({ nome, ra, siglaCurso, onPressExcluir }) => (
    <View style={styles.item}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{nome}</Text>
        <Text style={styles.itemText}>{ra}</Text>
        <Text style={styles.itemText}>{siglaCurso}</Text>
      </View>
      <Button title="Excluir" onPress={onPressExcluir} />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      fontSize: 16,
      padding: 8,
      marginBottom: 16,
    },
      listaAlunos: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemTextContainer: {
      flex: 1,
    },
    itemText: {
      fontSize: 18,
    },
  });

  return <CadastroAluno />
};