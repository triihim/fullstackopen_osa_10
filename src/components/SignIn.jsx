import React from "react";
import { Text, Pressable, View } from "react-native";
import { Formik } from "formik";
import FormikTextInput from "./FormikTextInput";
import theme from "../theme";
import * as Yup from "yup";
import useSignIn from "../hooks/useSignIn";
import { useHistory } from "react-router-native";
import Error from "./Error";

export const SignInForm = ({ onSubmit, error }) => {
  const styles = {
    form: {
      padding: 30,
    },
    button: {
      padding: 15,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center"
    },
    spacer: {
      height: 15
    }
  };

  const initialValues = {
    username: "",
    password: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required")
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {( { handleSubmit }) => {
        return (
          <View style={styles.form}>
            {error && <Error message={error} />}
            <FormikTextInput testID="usernameInput" name="username" placeholder="Username" />
            <View style={styles.spacer} />
            <FormikTextInput testID="passwordInput" name="password" placeholder="Password" secureTextEntry />
            <View style={styles.spacer} />
            <Pressable testID="signInSubmit" onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>
          </View>
        );
      }}
    </Formik>
    
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const history = useHistory();
  const [error, setError] = React.useState(null);

  const handleFormSubmit = async ({ username, password }) => {
    try {
      await signIn({ username, password });
      history.push("/");
    } catch(e) {
      setError(e.message);
      console.log("Error", e);
    }
  };

  return <SignInForm onSubmit={handleFormSubmit} error={error} />
};

export default SignIn;