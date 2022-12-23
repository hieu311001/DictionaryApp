import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import Word from '../component/word';
import AddWord from '../component/addWord';
import '../global';
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
    Pressable, 
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';


function Dictionary ({navigation}) {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [showBars, setShowBars] = useState(false);

  const IP = global.IP;

  const callbackFunction = () => {
    setMessages(!messages)
    setModalAdd(false);
    setModalVisible(false);
  };

  const saveHistory = (idx) => {
    axios.post(`http://${IP}:5000/v1/history/${idx}`)
      .then(function (response) {
        console.log("thành công")
      })
      .catch(function (error) {
        console.log(error);
      });
  }
 
  const handleSearch = (text) => {
    axios.get(`http://${IP}:5000/v1/search?keyword=${text}`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    axios.get(`http://${IP}:5000/v1/search?keyword=${text}`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [messages])

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
          saveHistory(item.idx);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
      <View style={styles.container}>
          <View style={styles.search}>
            <View style={[styles.btn, styles.btnBars]}>
              <Icon name="bars" color="#000000" size={30} 
                onPress={() => {
                setShowBars(!showBars);
              }}
              />
            </View>
            <View style={{flex: 8}}>
              <TextInput 
                style={styles.textInput}
                onChangeText={text => {
                  setTimeout(() => {
                    setText(text.toLowerCase());
                  }, 1);
                }}
                placeholder="Search..."
                keyboardType="default"
              />
            </View>
            <View 
              style={styles.btn}
              
            >
              <View >
                <Icon name="search" color="#000000" size={30} 
                  onPress={() => {
                  handleSearch(text);
                  setLoading(true);
                }}
                />
              </View>
            </View>
          </View>
          
          {showBars && 
            <View style={styles.optionBars}>
              <Pressable style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => setModalAdd(!modalAdd)}>
                <Icon name="calendar-plus-o" color="#000000" size="30" style={{padding: 8}}/>
                <Text style={{ paddingLeft: 8}}>Thêm từ mới</Text>
              </Pressable>
            </View>
          }

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
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Word id={selectedId} style={{overflow: 'auto'}} parentCallback={callbackFunction} status={1}/>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Đóng</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAdd}
            onRequestClose={() => {
              setModalAdd(!modalAdd);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{position: "absolute", top: 8, right: 8}}>
                  <Pressable
                    onPress={() => setModalAdd(!modalAdd)}
                  >
                    <Icon name="close" color="#bbbbbb" size={30} />
                  </Pressable>
                </View>
                <AddWord parentCallback={callbackFunction}/>
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
  search: {
    flexDirection: 'row'
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
    margin: 10,
    width: 300,
    minHeight: 400,
    height: '60%',
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
    marginTop: 12,
    borderRadius: 5,
    padding: 10,
    elevation: 2
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
    padding: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  activityIndicator: {
    paddingTop: 10,
    paddingBottom: 10
  },
  btn: {
    flex: 1, 
    width:40, 
    margin:4, 
    alignItems: "center", 
    justifyContent: "center",
  },
  btnBars: {
    margin: 0,
    marginLeft: 8
  },
  optionBars: {
    padding: 12,
    marginBottom: 8,
    border: 1,
    backgroundColor: "#ccffff",
    borderColor: "#000",
  }
});

export default Dictionary;