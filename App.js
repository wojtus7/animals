import { without } from 'lodash';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AsyncStorage, Dimensions, Image } from 'react-native';
import Expo, { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import Scene from './Scene'
import Shop from './Shop'

const screen = {
  height: Math.round(Dimensions.get('window').height),
  width: Math.round(Dimensions.get('window').width)
};

export default function App() {
  let [hunger, setHunger] = useState(0);
  let [lastFood, setlastFood] = useState(Date.now());
  let [isDead, setIsDead] = useState(false);
  let [delay, setDelay] = useState(1000);
  let [furnitures, setFurnitures] = useState([]);

  let [isRoomVisible, setIsRoomVisible] = useState(true);
  let [isShopVisible, setIsShopVisible] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const lastFoodSaved = await AsyncStorage.getItem('@lastFoodTimestamp');
        if (lastFoodSaved) {
          setlastFood(lastFoodSaved);
          hunger = Math.floor((Date.now() - lastFoodSaved) / 1000);
          checkHunged(hunger);
        }
      } catch (e) {

      }
    }, 0);
    return;
  }, []);

  useInterval(() => {
    hunger = Math.floor((Date.now() - lastFood) / 1000);
    checkHunged(hunger);

  }, delay);

  const checkHunged = (hunger) => {
    if (hunger > 100) {
      setHunger(100);
      setIsDead(true);
    } else {
      setHunger(hunger);
    }
  }

  const sendNotification = async (msToNotification) => {
    Notifications.cancelAllScheduledNotificationsAsync();
    const { status } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS,
    );
    if (status === 'granted') {
      const lol = await Notifications.scheduleLocalNotificationAsync(
        { title: "Animal", body: "Your pet is hungry. 😢" },
        { time: new Date().getTime() + msToNotification }
      );
    }
  }

  const saveLastFood = async () => {
    try {
      const nowDateString = String(Date.now());
      await AsyncStorage.setItem('@lastFoodTimestamp', nowDateString);
    } catch (e) {
    }
  }

  const respawn = () => {
    sendNotification(80000);
    setIsDead(false);
    setlastFood(Date.now());
    setHunger(0);
    saveLastFood();
    resetFurnitures([]);
  }

  const giveFood = async () => {
    sendNotification(80000);
    setlastFood(Date.now());
    setHunger(0);
    saveLastFood();
  }

  const resetFurnitures = async (furniture) => {
    setIsRoomVisible(false);
    setFurnitures([]);
    setTimeout(() => {
      setIsRoomVisible(true);
    }, 20);
  }

  const addFurniture = async (furniture) => {
    setIsRoomVisible(false);
    setFurnitures(furnitures => [...furnitures, furniture]);
    setTimeout(() => {
      setIsRoomVisible(true);
    }, 20);
  }

  const removeFurnitures = async (furniture) => {
    setIsRoomVisible(false);
    setFurnitures(without(furnitures, furniture));
    setTimeout(() => {
      setIsRoomVisible(true);
    }, 20);
  }

  const closeShop = () => {
    setIsShopVisible(false);
  }

  const openShop = () => {
    setIsShopVisible(true);
  }

  return (
    <View>
      <View style={{ height: screen.height, width: screen.width, position: 'absolute', opacity: 1 }}>
        {isRoomVisible ? <Scene furnitures={furnitures} /> : null}
      </View>
      <View style={{ height: 40, paddingTop: 120 }}>
        <Text style={{ height: 30 }}>Hunger: {100 - hunger}</Text>
        <TouchableOpacity
          style={{ height: 30 }}
          onPress={giveFood}
        >
          <Text style={{ height: 30 }}>Give food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30 }}
          onPress={openShop}
        >
          <Text style={{ height: 30 }}>Open shop</Text>
        </TouchableOpacity>
      </View>
      {isDead ?
        <TouchableOpacity
          style={{ height: 80, width: 80, position: "absolute", top: screen.height / 2 + 50, left: screen.width / 2 - 40, textAlign: 'center' }}
          onPress={respawn}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 25 }}
          >
            PET IS DEAD
        </Text>
        </TouchableOpacity>
        :
        <Image
          style={{ height: 80, width: 80, position: "absolute", top: screen.height / 2 + 50, left: screen.width / 2 - 40 }}
          source={require('./assets/penguin.png')}
        />
      }
      {isShopVisible ?
        <View style={{ height: screen.height, width: screen.width, position: 'absolute', opacity: 1 }}>
          <Shop addFurniture={addFurniture} closeShop={closeShop} furnitures={furnitures} removeFurnitures={removeFurnitures} />
        </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: screen.height,
  }
});

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}