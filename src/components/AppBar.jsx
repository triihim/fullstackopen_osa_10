import React from "react";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";
import Text from "./Text";
import theme from "../theme";
import { Link, useHistory } from "react-router-native";
import { useQuery } from "@apollo/client";
import { GET_AUTHORIZED_USER } from "../graphql/queries";
import useAuthStorage from "../hooks/useAuthStorage";
import { useApolloClient } from "@apollo/client";
import SignUp from "./SignUp";

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

const SignInLink = () => {
  return (
    <Link to="/signin" style={styles.link}>
      <Text style={styles.linkText}>Sign in</Text>
    </Link>
  );
};

const SignOut = ({ onSignOut }) => {
  return (
    <Pressable style={styles.link} onPress={onSignOut}>
      <Text style={styles.linkText}>Sign out</Text>
    </Pressable>
  );
};

const ReviewLink = () => {
  return (
    <Link to="/review" style={styles.link}>
      <Text style={styles.linkText}>Create review</Text>
    </Link>
  );
}

const SignUpLink = () => {
  return (
    <Link to="/signup" style={styles.link}>
      <Text style={styles.linkText}>Sign up</Text>
    </Link>
  );
}

const AppBar = () => {
  const { data } = useQuery(GET_AUTHORIZED_USER);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const history = useHistory();

  const loggedIn = data && data.authorizedUser;

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
    history.push("/");
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>Repositories</Text>
        </Link>
        { loggedIn && <ReviewLink /> }
        { loggedIn ? <SignOut onSignOut={handleSignOut} /> : <SignInLink /> }
        { !loggedIn && <SignUpLink /> }
      </ScrollView>
    </View>
  );
};

export default AppBar;