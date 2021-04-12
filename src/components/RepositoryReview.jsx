import React from "react";
import Text from "./Text";
import { View, StyleSheet } from "react-native";
import theme from "../theme";
import { format } from "date-fns";

const RepositoryReview = ({ review }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 20,
      backgroundColor: "#fff",
    },
    rating: {
      alignItems: "center",
      justifyContent: "center",
      width: 60,
      height: 60,
      borderRadius: 30,
      borderColor: theme.colors.primary,
      borderWidth: 5,
      marginRight: 10
    },
    ratingText: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: 22
    },
    mainBody: {
      flexDirection: "column",
      flexShrink: 1
    }
 
  });

  return (
    <View style={styles.container}>
      <View style={styles.rating}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.mainBody}>
        <Text fontWeight="bold">{review.title || review.user.username}</Text>
        <Text color="textSecondary">{format(new Date(review.createdAt), "dd.MM.yyyy")}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  );
};

export default RepositoryReview;