import React from "react";
import { StyleSheet } from "react-native";
import { useField } from "formik";

import TextInput from "./TextInput";
import Text from "./Text";

const styles = StyleSheet.create({
  errorText: {
    marginTop: 5,
    color: "#d73a4a"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10
  },
  inputError: {
    borderColor: "#d73a4a"
  }
});

const FormikTextInput = ({testID, name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput
        testID={testID}
        style={showError ? [styles.input, styles.inputError] : styles.input}
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </>
  );
};

export default FormikTextInput;