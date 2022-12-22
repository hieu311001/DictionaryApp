import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dictionary from '../screens/dictionary';
import History from '../screens/history';
import Favorite from '../screens/favorite';
import Translate from '../screens/translate';

const Tab = createBottomTabNavigator();

function Application() {
  // changeScreen () {
  // 
  //}
  return (
    <Tab.Navigator screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000',
        },
      }}>
      <Tab.Screen 
        name="Dictionary" 
        component={Dictionary} 
        options={{ 
            title:"Từ điển", 
            tabBarIcon: ({ color, size }) => {
                return <Icon name="book" color={color} size={size} />
            }
        }}
        //onPress(name) {
        // this.changeScreen()
        //}
        />
      <Tab.Screen 
        name="History" 
        component={History} 
        options={{ title:"Lịch sử", tabBarIcon: ({ color, size }) => {
            return <Icon name="history" color={color} size={size} />
        }}}/>
      <Tab.Screen 
        name="Favorite" 
        component={Favorite} 
        options={{ title:"Yêu thích", tabBarIcon: ({ color, size }) => {
            return <Icon name="star" color={color} size={size} />
        }}}/>
      <Tab.Screen 
        name="Translate" 
        component={Translate} 
        options={{ title:"Dịch", tabBarIcon: ({ color, size }) => {
            return <Icon name="language" color={color} size={size} />
        }}}/>
    </Tab.Navigator>
  );
}

export default Application;