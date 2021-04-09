import React from "react";
import { Text, Pressable, View } from "react-native";
import { Formik } from "formik";
import FormikTextInput from "./FormikTextInput";
import theme from "../theme";
import * as Yup from "yup";
import useSignIn from "../hooks/useSignin";
import { useHistory } from "react-router-native";

const SignInForm = ({onSubmit}) => {
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

  return (
    <View style={styles.form}>
      <FormikTextInput name="username" placeholder="Username" />
      <View style={styles.spacer} />
      <FormikTextInput name="password" placeholder="Password" secureTextEntry />
      <View style={styles.spacer} />
      <Pressable onPress={onSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const history = useHistory();

  const handleFormSubmit = async ({ username, password }) => {
    try {
      await signIn({ username, password });
      history.push("/");
    } catch(e) {
      console.log("Error", e);
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
    <Formik initialValues={initialValues} onSubmit={handleFormSubmit} validationSchema={validationSchema}>
      {( { handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

export default SignIn;