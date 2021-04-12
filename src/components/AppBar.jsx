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

// const SignInLink = () => {
//   return (
//     <Link to="/signin" style={styles.link}>
//       <Text style={styles.linkText}>Sign in</Text>
//     </Link>
//   );
// };

const SignOut = ({ onSignOut }) => {
  return (
    <Pressable style={styles.link} onPress={onSignOut}>
      <Text style={styles.linkText}>Sign out</Text>
    </Pressable>
  );
};

// const ReviewLink = () => {
//   return (
//     <Link to="/review" style={styles.link}>
//       <Text style={styles.linkText}>Create review</Text>
//     </Link>
//   );
// }

// const SignUpLink = () => {
//   return (
//     <Link to="/signup" style={styles.link}>
//       <Text style={styles.linkText}>Sign up</Text>
//     </Link>
//   );
// }

// const UserReviewsLink = () => {
//   return (
//     <Link>
//     </Link>
//   );
// }

const NavLink = ({ to, text }) => {
  return (
    <Link to={to} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
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
        <NavLink to="/" text="Repositories" />
        { loggedIn && <NavLink to="/review" text="Create review"/>}
        { loggedIn && <NavLink to="/user-reviews" text="My reviews"/>}
        { loggedIn && <SignOut onSignOut={handleSignOut} />}
        { !loggedIn && <NavLink to="/signin" text="Sign in" />}
        { !loggedIn && <NavLink to="/signup" text="Sign up"/>}
      </ScrollView>
    </View>
  );
};

export default AppBar;