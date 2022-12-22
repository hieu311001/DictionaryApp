import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    TextInput, 
    Modal,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';


function AddWord (prop) {
  const [ID, setID] = useState(null);
  const [newWord, setNewWord] = useState(null);
  const [spell, setSpell] = useState(null);
  const [detail, setDetail] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalSuccess, setModalSuccess] = useState(false);

  const IP = global.IP;

  const formatData = (spell, detail) => {
    let data = [spell, detail];

    let result = data.join('<br />');
    result = '<C><F><I><N><Q>' + result + '</Q></N></I></F></C>';
    console.log(result);
    return result;
  }

  const addWord = () => {
    const data = {
        idx: ID+1,
        word: newWord,
        detail: formatData(spell, detail),
    }

    axios.post(`http://${IP}:5000/v1/words`, data)
      .then(function (response) {
        console.log("thành công")
        setModalSuccess(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
      axios.get(`http://${IP}:5000/v1/max-code`)
      .then(function (response) {
        setID(response.data[0].ID);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [messages])

  return (
    //<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      {loading && <ActivityIndicator style={styles.activityIndicator} color={"#000"} size="small" />}
      {!loading && 
        <View>
            <View>
                <Text style={styles.title}>ID: </Text>
                <View style={styles.border}>
                    <Text>{ID+1}</Text>
                </View>
                <Text style={styles.title}>Từ mới:</Text>
                <View style={styles.border}>
                    <TextInput 
                    multiline
                    numberOfLines={2}
                    onChangeText={(value) => setNewWord(value)}
                    />
                </View>
                <Text style={styles.title}>Phiên âm:</Text>
                <View style={styles.border}>
                    <TextInput 
                    multiline
                    numberOfLines={2}
                    onChangeText={(value) => setSpell(value)}
                    />
                </View>
                <Text style={styles.title}>Nghĩa của từ:</Text>
                <View style={styles.border}>
                    <TextInput 
                    multiline
                    numberOfLines={4}
                    onChangeText={(value) => setDetail(value)}
                    />
                </View>
            </View>
            <View style={{maxWidth: 80, marginLeft: 70, marginBottom: 20}}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => addWord()}
                >
                    <Text style={styles.textStyle}>Thêm</Text>
                </Pressable>
            </View>
        </View>
      }

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSuccess}
          onRequestClose={() => {
            setModalSuccess(!modalSuccess);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text>Thêm từ mới thành công</Text>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalSuccess(!modalSuccess)}
                >
                    <Text style={styles.textStyle}>Đóng</Text>
                </Pressable>
            </View>
          </View>
        </Modal>
    </View>
    //</TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
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
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 20
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 4
  },
  border: {
    borderWidth: 1,
    margin: 8, 
    minWidth: 200
  }, 
  title: {
    fontWeight: 600,
    margin: 8,
  }
});

export default AddWord;