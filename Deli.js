import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ giveFood }) {

  const renderThingInShop = (calories, displayName) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => giveFood(calories)}
    >
      <Text
        style={{ color: 'black' }}
      >{displayName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderThingInShop(5, 'Apple')}
      {renderThingInShop(20, 'Sandwitch')}
      {renderThingInShop(40, 'Small Lunch')}
      {renderThingInShop(60, 'Lunch')}
      {renderThingInShop(100, 'Fiesta')}
    </View>
  );
}