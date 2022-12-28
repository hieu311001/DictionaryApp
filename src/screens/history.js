import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import Word from '../component/word';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Button,
    Modal,
    Pressable
} from 'react-native';


function History ({navigation}) {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const IP = global.IP;

  
  const callbackFunction = () => {
    setMessages(!messages)
    setModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      axios.get(`http://${IP}:5000/v1/history`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    }, [messages])
  );

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.word}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.idx === selectedId ? "#2196f3" : "#ffffff";
    const color = item.idx === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setModalVisible(true);
          setSelectedId(item.idx);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <View style={styles.container}>
        {/* <View style={styles.search}>
          <TextInput 
            style={styles.textInput}
            onChangeText={text => {
              setText(text);
              setLoading(true);
            }}
            placeholder="Search..."
            keyboardType="default"
          />
        </View> */}
        {loading && <ActivityIndicator style={styles.activityIndicator} color={"#000"} size="large" />}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.idx}
          extraData={selectedId}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Word id={selectedId} status={2} parentCallback={callbackFunction} version={1}/>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    marginBottom: 1
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }, 
  iconSearch: {
    height: 40,
    width: 100,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: 300,
    height: '80%',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 4
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  activityIndicator: {
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default History;