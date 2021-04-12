import React from "react";
import { Formik } from "formik";
import FormkiTextInput from "./FormikTextInput";
import { View, Pressable } from "react-native";
import FormikTextInput from "./FormikTextInput";
import Text from "./Text";
import * as Yup from "yup";
import theme from "../theme";
import { useMutation } from "@apollo/client";
import { CREATE_REVIEW } from "../graphql/mutations";
import { useHistory } from "react-router-native";

const CreateReview = () => {
  const [createReview] = useMutation(CREATE_REVIEW);
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

  const handleReviewSubmit = async (values) => {
    const formData = {
      ownerName: values.ownerName,
      repositoryName: values.repositoryName,
      rating: Number(values.rating),
      review: values.review
    };
    try {
      const { data } = await createReview({ variables: formData });
      history.push(`/repositories/${data.createReview.repositoryId}`)
    } catch(e) {
      console.log(e);
    }
  }

  const initialValues = {
    ownerName: "",
    repositoryName: "",
    rating: "",
    review: ""
  };

  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required("Owner name is required"),
    repositoryName: Yup.string().required("Repository name is required"),
    rating: Yup.number().required("Rating is required")
            .min(0, "Rating must be atleast 0")
            .max(100, "Rating can't be greater than 100")
            .typeError("Rating must be a number")
  });

  return (
    <Formik initialValues={initialValues} onSubmit={handleReviewSubmit} validationSchema={validationSchema} >
      {( { handleSubmit, isSubmitting } ) => {
        return (
          <View style={styles.form}>
            <FormkiTextInput name="ownerName" placeholder="Repository owner name" />
            <View style={styles.spacer} />
            <FormkiTextInput name="repositoryName" placeholder="Repository name" />
            <View style={styles.spacer} />
            <FormkiTextInput name="rating" placeholder="Rating between 0 and 100" />
            <View style={styles.spacer} />
            <FormikTextInput name="review" placeholder="Review" />
            <View style={styles.spacer} />
            <Pressable disabled={isSubmitting} style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create review</Text>
            </Pressable>
          </View>
        );
      }}
    </Formik>
  );
};

export default CreateReview;