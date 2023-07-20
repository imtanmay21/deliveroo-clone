import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "../../features/restaurantSlice";
import {
  removeFromBasket,
  selectBasketItems,
  selectBasketTotal,
} from "../../features/basketSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { XCircleIcon } from "react-native-heroicons/solid";
import { urlFor } from "../../sanity";

const BasketScreen = () => {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const items = useSelector(selectBasketItems);
  const basketTotal = useSelector(selectBasketTotal);

  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);

  const dispatch = useDispatch();

  useMemo(() => {
    const groupedItems = items.reduce((grouped, currentItem) => {
      const existingItem = grouped.find((item) => item.id === currentItem.id);

      if (existingItem) {
        existingItem.count += 1; // Increment the count property of existingItem
      } else {
        grouped.push({ ...currentItem, count: 1 });
      }
      return grouped;
    }, []);

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="p-5 border-b border-[#00CCBB] bg-white shadow-xs">
          <View>
            <Text className="text-center font-bold text-lg">Basket</Text>
            <Text className="text-center text-gray-400">
              {restaurant.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigation.goBack}
            className="bg-gray-100 absolute top-3 right-5"
          >
            <XCircleIcon color="#00CCBB" height={50} width={50} />
          </TouchableOpacity>
        </View>
        <View className="px-4 py-3 flex-row items-center space-x-4 bg-white my-5">
          <Image
            source={{ uri: "https://links.papareact.com/wru" }}
            className="h-7 w-7 bg-gray-300 p-4 rounded-full"
          />
          <Text className="flex-1">Deliver in 50-75 min</Text>
          <TouchableOpacity>
            <Text className="text-[#00CCBB]">Change</Text>
          </TouchableOpacity>
        </View>

        {/* Items */}
        <ScrollView className="divide-y divide-gray-200">
          {groupedItemsInBasket.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center py-2 px-5 space-x-3 bg-white"
            >
              <Text>{item.count} x</Text>
              <Image
                source={{ uri: urlFor(item.image).url() }}
                className="h-12 w-12 rounded-full"
              />
              <Text className="flex-1">{item.name}</Text>
              <Text>Rs. {item.price}</Text>
              <TouchableOpacity
                onPress={() => dispatch(removeFromBasket({ id: item.id }))}
              >
                <Text className="text-[#00CCBB]">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View className="p-5 bg-white mt-5 space-y-4">
          <View className=" flex-row justify-between">
            <Text className="text-gray-400">SubTotal</Text>
            <Text className="text-gray-400">Rs. {basketTotal}</Text>
          </View>
          <View className=" flex-row justify-between">
            <Text className="text-gray-400">Delivery Fee</Text>
            <Text className="text-gray-400">Rs. 55</Text>
          </View>
          <View className=" flex-row justify-between">
            <Text>Order Total</Text>
            <Text className="font-extrabold">Rs. {basketTotal + 55}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PreparingOrder")}
            className="rounded-lg bg-[#00CCBB] p-4"
          >
            <Text className="text-center text-white text-lg font-bold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BasketScreen;
