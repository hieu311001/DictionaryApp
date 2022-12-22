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
    ScrollView
} from 'react-native';


function Word (prop) {
  const [data, setData] = useState("null");
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  const IP = global.IP;

  const speech = (word) => {
    var thingsToSay = word;
    Speech.speak(thingsToSay);
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
      axios.get(`http://${IP}:5000/v1/words/${prop.id}`)
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [messages])

  return (
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator style={styles.activityIndicator} color={"#000"} size="small" />}
      {!loading && 
        <View>
          <View style={styles.header}>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                saveFavorite(data[0].idx);
              }}
            >
                <View >
                  <Icon name="star-o" color="blue" size={20} />
                </View>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                speech(data[0].word);
              }}
            >
                <View >
                  <Icon name="volume-up" color="blue" size={20}/>
                </View>
            </Pressable>
          </View>
          <Text style={[styles.textStyle, styles.title]}>Từ: </Text>
          <Text 
            style={styles.textStyle}
          >
            {data[0].word}
          </Text>
          <Text style={[styles.textStyle, styles.title]}>Nghĩa của từ: </Text>
              {renderWord()}
      </View>
      }
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
  button: {
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
  }
});

export default Word;