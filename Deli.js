import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ giveFood, money }) {

  const renderThingInShop = (calories, displayName, cost) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => giveFood(calories, cost)}
    >
      <Text
        style={{ color: money < cost ? 'red' : 'black' }}
      >{displayName} - ${cost}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderThingInShop(5, 'Apple', 1)}
      {renderThingInShop(20, 'Sandwitch', 5)}
      {renderThingInShop(40, 'Small Lunch', 10)}
      {renderThingInShop(60, 'Lunch', 15)}
      {renderThingInShop(100, 'Fiesta', 25)}
    </View>
  );
}