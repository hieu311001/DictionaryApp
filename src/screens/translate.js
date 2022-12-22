import * as React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import * as Speech from 'expo-speech';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

function Translate ({navigation}) {
  const [word, setWord] = React.useState();
  const [mean, setMean] = React.useState();
  const [text, setText] = React.useState();
  const [result, setResult] = React.useState();

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${word}&tl=${mean}&dt=t&q=${text}`;

  const speech = (word) => {
    var thingsToSay = word;
    Speech.speak(thingsToSay, {
      language: mean
    });
  }

  const handleTranslate = () => {
    if (text == undefined || text === '') {
      setResult("");
    } else {
      axios.get(url)
      .then(function (response) {
        setResult(response.data[0][0][0]);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.option}>
          <View style={styles.option1}>
            <RNPickerSelect
                  placeholder={{ label: 'Dịch từ', value: "" }}
                  onValueChange={(value) => setWord(value)}
                  items={[
                      { label: 'Phát Hiện Ngôn Ngữ', value: 'auto' },
                      { label: 'Tiếng Anh', value: 'en' },
                      { label: 'Việt Nam', value: 'vi' },
                      { label: 'Trung Quốc', value: 'zh-CN' },
                      { label: 'Nga', value: 'ru' },
                      { label: 'Nhật Bản', value: 'ja' },
                  ]}
                  //pickerProps={{ style: { height: 40, overflow: 'hidden' } }}
              />
          </View>
          <Icon 
            style={{ flex: 1, textAlign: 'center' }}
            name="long-arrow-right" 
            color="#000000" 
            size={20} 
          />
          <View style={styles.option2}>
            <RNPickerSelect
                placeholder={{ label: 'Dịch sang', value: "" }}
                onValueChange={(value) => setMean(value)}
                items={[
                    { label: 'Tiếng Anh', value: 'en' },
                    { label: 'Việt Nam', value: 'vi' },
                    { label: 'Trung Quốc', value: 'zh-CN' },
                    { label: 'Nga', value: 'ru' },
                    { label: 'Nhật Bản', value: 'ja' }
                ]}
                //pickerProps={{ style: { height: 40, overflow: 'hidden' } }}
            />
          </View>
        </View>
        <View>
          <View>
            <Text style={styles.textStyle}>Văn Bản:</Text>
            <View style={styles.border}>
              <TextInput 
                onChangeText={(text) => {
                  setText(text);
                }}
                placeholder="Nhập từ cần dịch"
                keyboardType="default"
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { 
                handleTranslate();
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.translate}>Dịch</Text>
            </Pressable>
          </View>

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.textStyle}>Nghĩa:</Text>
              <Pressable
                style={{margin: 8, marginRight: 12}}
                onPress={() => {
                  speech(result);
                  Keyboard.dismiss();
                }}
              >
                  <View >
                    <Icon name="volume-up" color="blue" size={20}/>
                  </View>
              </Pressable>
            </View>
            <View style={styles.border}>
              <Text>{result}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12
  },
  option: {
    flexDirection: 'row', 
    alignItems: "center",
    justifyContent: 'space-between', 
    paddingBottom: 8
  },
  option1: {
    marginLeft: 10,
    marginRight: 10,
    flex: 4, 
  },
  option2: {
    marginLeft: 10,
    marginRight: 10,
    flex: 4
  },
  border: {
    // borderWidth: 1,
    // borderRadius: 4,
    margin: 8
  }, 
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 80,
    textAlign: 'center'
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    margin: 12
  },
  textStyle: {
    //fontWeight: 600,
    margin: 8,
    fontSize: 18
  },
  translate: {
    fontSize: 18,
    //fontWeight: 600,
    color: '#fff', 
    textAlign: 'center'
  },
  input: {
    borderColor: "gray",
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  }
})

export default Translate;