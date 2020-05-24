import { without } from 'lodash';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AsyncStorage, Dimensions, Image, LayoutAnimation } from 'react-native';
import Expo, { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import Scene from './Scene';
import Shop from './Shop';
import Deli from './Deli';
import WorkList from './WorkList';

const screen = {
  height: Math.round(Dimensions.get('window').height),
  width: Math.round(Dimensions.get('window').width)
};

const maxHungerPoints = 500;

export default function App() {
  let [hunger, setHunger] = useState(0);
  let [lastFood, setlastFood] = useState(Date.now());
  let [isDead, setIsDead] = useState(false);
  let [delay, setDelay] = useState(1000);
  let [furnitures, setFurnitures] = useState([]);
  let [money, setMoney] = useState(100);
  let [isAtWork, setIsAtWork] = useState(false);
  let [lastWork, setlastWork] = useState(false);
  let [experience, setExperience] = useState(0);

  let [isRoomVisible, setIsRoomVisible] = useState(true);
  let [isShopVisible, setIsShopVisible] = useState(false);
  let [isDeliVisible, setIsDeliVisible] = useState(false);
  let [isWorkListVisible, setIsWorkListVisible] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      try {
        let lastWorkSaved = await AsyncStorage.getItem('@lastWork');
        lastWorkSaved = JSON.parse(lastWorkSaved);
        if (lastWorkSaved) {
          if (lastWorkSaved.endTimestamp > Date.now()) {
            setIsAtWork(true);
            setlastWork(lastWorkSaved);
          } else {
            const newMoney = money + Number(lastWorkSaved.profit);
            giveExperience();
            setMoney(newMoney);
            setIsAtWork(false);
            resetWork();
            setlastWork(false);
          }
        }

        let experience = await AsyncStorage.getItem('@experience');
        if(experience) {
          setExperience(Number(experience));
        }

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

    if (lastWork) {
      if (lastWork.endTimestamp > Date.now()) {
        setIsAtWork(true);
        setlastWork(lastWork);
      } else {
        const newMoney = money + Number(lastWork.profit);
        giveExperience();
        setMoney(newMoney);
        setIsAtWork(false);
        resetWork();
        setlastWork(false);
      }
    }
  }, delay);

  const checkHunged = (hunger) => {
    if (hunger > maxHungerPoints) {
      setHunger(maxHungerPoints);
      setIsDead(true);
    } else {
      setHunger(hunger);
    }
  }

  const sendNotification = async (secToNotification) => {
    if (secToNotification > 0) {
      Notifications.cancelAllScheduledNotificationsAsync();
      const { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
      );
      if (status === 'granted') {
        const lol = await Notifications.scheduleLocalNotificationAsync(
          { title: "Animal", body: "Your pet is hungry. 😢" },
          { time: new Date().getTime() + (secToNotification * 1000) }
        );
      }
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
    sendNotification(maxHungerPoints - Math.floor(maxHungerPoints * 0.2));
    setIsDead(false);
    setlastFood(Date.now());
    setHunger(0);
    saveLastFood();
    resetFurnitures([]);
    resetExperience();
    resetWork();
    setMoney(100);
    setlastWork(false);
    setExperience(0);
  }

  const giveFood = async (foodCalories, cost) => {
    let newMoney = money - cost;
    if (newMoney >= 0) {
      setMoney(newMoney);
      let newHunger = hunger - foodCalories;
      if (newHunger < 0) {
        newHunger = 0;
      }
      setlastFood(Date.now() - (newHunger * 1000));
      setHunger(newHunger);
      saveLastFood();
      sendNotification(((maxHungerPoints - Math.floor(maxHungerPoints * 0.2)) - newHunger));
    }
  }

  const resetFurnitures = async () => {
    setIsRoomVisible(false);
    setFurnitures([]);
    setTimeout(() => {
      setIsRoomVisible(true);
    }, 20);
  }

  const addFurniture = async (furniture, cost) => {
    let newMoney = money - cost;
    if (newMoney >= 0) {
      setMoney(newMoney);
      setIsRoomVisible(false);
      setFurnitures(furnitures => [...furnitures, furniture]);
      setTimeout(() => {
        setIsRoomVisible(true);
      }, 20);
    }
  }

  const removeFurnitures = async (furniture, cost) => {
    let newMoney = money + (cost / 2);
    setMoney(newMoney);
    setIsRoomVisible(false);
    setFurnitures(without(furnitures, furniture));
    setTimeout(() => {
      setIsRoomVisible(true);
    }, 20);
  }

  const startWork = async (name, time, profit) => {
    setIsAtWork(true);
    try {
      const workInfo = {
        name,
        time,
        profit,
        endTimestamp: Date.now() + (time * 1000)
      };
      await AsyncStorage.setItem('@lastWork', JSON.stringify(workInfo));
      closeWorkList();
      setlastWork(workInfo);
    } catch (e) {
    }
  }

  const resetWork = async () => {
    try {
      await AsyncStorage.removeItem('@lastWork');
    } catch (e) {
    }
  }

  const giveExperience = async () => {
    console.log('asdasdasd')
    try {
      console.log('asdasdasd')
      const newExperience = experience + 1;
      setExperience(newExperience);
      await AsyncStorage.setItem('@experience', String(newExperience));
    } catch (e) {
    }
  }

  const resetExperience = async () => {
    try {
      await AsyncStorage.removeItem('@experience');
    } catch (e) {
    }
  }

  const closeShop = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShopVisible(false);
  }

  const openShop = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWorkListVisible(false);
    setIsDeliVisible(false);
    setIsShopVisible(true);
  }

  const closeDeli = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDeliVisible(false);
  }

  const openDeli = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWorkListVisible(false);
    setIsShopVisible(false);
    setIsDeliVisible(true);
  }

  const closeWorkList = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWorkListVisible(false);
  }

  const openWorkList = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWorkListVisible(true);
  }

  return (
    <View style={{ height: screen.height, width: screen.width }}>
      <View style={{ height: screen.height, width: screen.width, position: 'absolute', opacity: 1 }}>
        {isRoomVisible ? <Scene furnitures={furnitures} /> : null}
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
        isAtWork ?
          <View
            style={{ textAlign: 'center', height: 80, width: screen.width, position: "absolute", top: screen.height / 2 + 50, textAlign: 'center' }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 25 }}
            >
              PET IS AT WORK
            </Text>
            <Text
              style={{ textAlign: 'center', fontSize: 25 }}
            >
              WILL BE BACK IN - {Math.floor((lastWork.endTimestamp - Date.now())/1000)}SEC
            </Text>
          </View>
          :
          <Image
            style={{ height: 90, width: 90, position: "absolute", top: screen.height / 2 + 50, left: screen.width / 2 - 40 }}
            resizeMode={'contain'}
            source={require('./assets/penguin.png')}
          />
      }

      <View style={{ height: screen.height, width: screen.width, position: 'absolute', right: isShopVisible ? 0 : screen.width, }}>
        <Shop addFurniture={addFurniture} closeShop={closeShop} furnitures={furnitures} removeFurnitures={removeFurnitures} money={money} />
      </View>

      <View style={{ height: screen.height, width: screen.width, position: 'absolute', left: isDeliVisible ? 0 : screen.width, }}>
        <Deli giveFood={giveFood} money={money} />
      </View>

      <View style={{ height: screen.height, width: screen.width, position: 'absolute', opacity: 1, top: isWorkListVisible ? 0 : screen.height, }}>
        <WorkList startWork={startWork} isAtWork={isAtWork} experience={experience} />
      </View>

      <View style={{ height: 40, paddingTop: 120 }}>
        <Text style={{ height: 30 }}>Hunger: {Math.round(((maxHungerPoints - hunger) / maxHungerPoints) * 100)}%</Text>
        <Text style={{ height: 30 }}>Money: ${money}</Text>
        <Text style={{ height: 30 }}>Experience: {experience}</Text>
      </View>

      <View style={{ height: 100, width: screen.width, position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ height: 100, flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)' }}
          onPress={isShopVisible ? closeShop : openShop}
        >
          <Text style={{ height: 30 }}>{isShopVisible ? 'Close' : 'Open'} Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 100, flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)' }}
          onPress={isWorkListVisible ? closeWorkList : openWorkList}
        >
          <Text style={{ height: 30 }}>{isWorkListVisible ? 'Close' : 'Open'} Work List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 100, flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)' }}
          onPress={isDeliVisible ? closeDeli : openDeli}
        >
          <Text style={{ height: 30 }}>{isDeliVisible ? 'Close' : 'Open'} Deli</Text>
        </TouchableOpacity>
      </View>
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