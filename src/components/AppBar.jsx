import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";
import Text from "./Text";
import theme from "../theme";
import { Link } from "react-router-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 5,
    backgroundColor: theme.colors.primary
  },
  link: {
    padding: 5,
    margin: 10
  },
  linkText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  }
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>Repositories</Text>
        </Link>
        <Link to="/signin" style={styles.link}>
          <Text style={styles.linkText}>Sign in</Text>
        </Link>
      </ScrollView>
    </View>
  );
};

export default AppBar;