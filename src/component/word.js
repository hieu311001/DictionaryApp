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
    ScrollView,
    Modal,
} from 'react-native';


function Word (prop) {
  const [data, setData] = useState("null");
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const IP = global.IP;

  const speech = (word) => {
    let language;
    if (prop.version == 1) {
      language = "en";
    } else if (prop.version == 2) {
      language = "vn";
    }

    var thingsToSay = word;
    Speech.speak(thingsToSay, {
      language: language,
    });
  }

  const handleDelete = (id) => {
    if (prop.status == 1) {
      axios.delete(`http://${IP}:5000/v1/words/${id}`)
      .then(function (response) {
        console.log("thành công");
        prop.parentCallback();
      })
      .catch(function (error) {
        console.log(error);
      });
    } else if (prop.status == 3) {
      axios.delete(`http://${IP}:5000/v1/favorite/${id}`)
      .then(function (response) {
        console.log("thành công");
        prop.parentCallback();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  const saveFavorite = (idx) => {
    axios.post(`http://${IP}:5000/v1/favorite/${idx}`)
      .then(function (response) {
        console.log("thành công")
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const formatWord = (word) => {
    let len = word.length;
    let newWord = word.slice(15, len-20);
    let ArrayDetail = newWord.split("<br />");

    console.log(ArrayDetail);
    return ArrayDetail;
  }

  const renderWord = () => {
    var payments = [];

    let word = formatWord(data[0].detail);

    payments.push(
      <View key = {0}>
        <Text style={{fontWeight: 600}}>Phiên âm:</Text>
        <Text>{word[0]}</Text>
        <Text style={{fontWeight: 600}}>Nghĩa:</Text>
      </View>
    )

    for(let i = 1; i < word.length; i++){
  
      payments.push(
        <View key = {i}>
          <Text>{word[i]}</Text>
        </View>
      )
    }

    return payments;
  }

  useEffect(() => {
    if (prop.version == 1) {
      axios.get(`http://${IP}:5000/v1/words/${prop.id}`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    } else if (prop.version == 2) {
      axios.get(`http://${IP}:5000/v2/words/${prop.id}`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

  }, [messages])

  return (
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator style={styles.activityIndicator} color={"#000"} size="small" />}
      {!loading && 
        <View>
          <View style={styles.header}>
            {prop.status != 3 && prop.version == 1 &&
              <Pressable
                style={[styles.buttons]}
                onPress={() => {
                  saveFavorite(data[0].idx);
                  setModalSuccess(!modalSuccess);
                }}
              >
                  <View >
                    <Icon name="star-o" color="blue" size={20} />
                  </View>
              </Pressable>
            }
            <Pressable
              style={[styles.buttons]}
              onPress={() => {
                speech(data[0].word);
              }}
            >
                <View >
                  <Icon name="volume-up" color="blue" size={20}/>
                </View>
            </Pressable>
            {prop.status != 2 && prop.version == 1 &&  
              <Pressable
                style={[styles.buttons]}
                onPress={() => {
                  setModalDelete(!modalDelete);
                }}
              >
                  <View >
                    <Icon name="trash" color="blue" size={20}/>
                  </View>
              </Pressable>
            }
          </View>
          <Text style={[styles.textStyle, styles.title]}>Từ: </Text>
          <Text 
            style={styles.textStyle}
          >
            {data[0].word}
          </Text>
          <Text style={[styles.textStyle, styles.title]}>Nghĩa của từ: </Text>
              {prop.version == 1 && renderWord()}
              {prop.version == 2 && 
                <Text>{data[0].detail}</Text>
              }
      </View>
      }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDelete}
        onRequestClose={() => {
          setModalDelete(!modalDelete);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{margin: 20}}>
              <Text>Bạn có chắc chắn muốn xóa từ này khỏi danh sách hiện tại không?</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Pressable
                  onPress={() => setModalDelete(!modalDelete)}
                  style={[styles.button, styles.buttonClose]}
                >
                  <Text style={styles.textStyles}>Đóng</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(prop.id)}
                  style={[styles.button, styles.buttonClose]}
                >
                  <Text style={styles.textStyles}>Xóa</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
                <Text>Thêm từ yêu thích thành công</Text>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() =>{ 
                      setModalSuccess(!modalSuccess);
                    }}
                >
                    <Text style={styles.textStyles}>Đóng</Text>
                </Pressable>
            </View>
          </View>
        </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
   //justifyContent: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  buttons: {
    padding: 10,
    textAlign: 'end',
  },
  textStyle: {
    paddingBottom: 10,
    minWidth: 200
  },
  title: {
    fontWeight: 600,
    fontSize: 18
  },
  header: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginBottom: 10
  },
  meaning: {
    borderWidth: 1,
    borderRadius: 4,
  },
  activityIndicator: {
    height: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
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
    overflow: 'auto',
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
  button: {
    margin: 12,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 20,
    minWidth: 60
  },
  textStyles: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Word;