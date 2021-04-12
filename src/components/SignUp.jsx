import React from "react";
import { Pressable, View } from "react-native";
import { Formik } from "formik";
import FormkiTextInput from "./FormikTextInput";
import * as Yup from "yup";
import theme from "../theme";
import Text from "./Text";
import { CREATE_USER } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-native";
import useSignIn from "../hooks/useSignIn";

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const history = useHistory();

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
    password: "",
    passwordConfirm: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").min(1).max(30),
    password: Yup.string().required("Password is required").min(5).max(50),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirm is required")
  });

  const handleSignUpSubmit = async (values) => {
    const user = { username: values.username, password: values.password };
    try {
      const { data } = await createUser({ variables: user });
      await signIn(user);
      history.push("/");
    } catch(e) {
      console.log(e)      ;
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSignUpSubmit}>
      {( { handleSubmit } ) => {
        return (
          <View style={styles.form}>
            <FormkiTextInput name="username" placeholder="Username" />
            <View style={styles.spacer} />
            <FormkiTextInput name="password" placeholder="Password" secureTextEntry />
            <View style={styles.spacer} />
            <FormkiTextInput name="passwordConfirm" placeholder="Confirm password" secureTextEntry />
            <View style={styles.spacer} />
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
          </View>
        );
      }}
    </Formik>
  );
};

export default SignUp;