import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Text from "./Text";
import theme from "../theme";

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flexDirection: "column",
    flexShrink: 1
  },
  icon: {
    width: 60,
    height: 60,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 5
  },
  languagePill: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
    color: "#fff",
    padding: 3,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  statisticRow: {
    padding: 20,
    paddingBottom: 0,
    justifyContent: "space-between"
  },
  statistic: {
    textAlign: "center"
  },
  description: {
    marginTop: 5,
    marginBottom: 5
  }
});

const Statistic = ({ title, value }) => {
  const parsedValue = value >= 1000 ? (value * 0.001).toFixed(1) + "k" : value;
  return (
    <View style={style.col}>
      <Text fontWeight="bold" color="primary" style={style.statistic}>{parsedValue}</Text>
      <Text color="textSecondary" style={style.statistic}>{title}</Text>
    </View>
  );
};

const RepositoryItem = ({ item }) => {
  return (
    <View style={style.container}>
      <View style={style.row}>
        <Image style={style.icon} source={{ uri: item.ownerAvatarUrl }} />
        <View style={style.col}>
          <Text color="textPrimary" fontWeight="bold" fontSize="subheading">{item.fullName}</Text>
          <Text style={style.description} color="textSecondary">{item.description}</Text>
          <Text style={style.languagePill}>{item.language}</Text>
        </View>
      </View>
      <View style={[style.statisticRow, style.row]}>
        <Statistic title="Stars" value={item.stargazersCount} />
        <Statistic title="Forks" value={item.forksCount} />
        <Statistic title="Reviews" value={item.reviewCount} />
        <Statistic title="Rating" value={item.ratingAverage} />
      </View>
    </View>
  );
};

export default RepositoryItem;