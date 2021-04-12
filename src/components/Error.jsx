import React from "react";
import { View, Text } from "react-native";

const Error = ({message}) => {
  return (
    <View style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Text style={{ color: "red" }}>{message}</Text>
    </View>
  );
};

export default Error;