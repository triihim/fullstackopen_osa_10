import React from "react";
import { View, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import Text from "./Text";
import { useQuery, useMutation } from "@apollo/client";
import { GET_AUTHORIZED_USER } from "../graphql/queries";
import RepositoryReview from "./RepositoryReview";
import { useHistory } from "react-router-native";
import { DELETE_REVIEW } from "../graphql/mutations";

const Separator = () => <View style={{ height: 10 }} />

const DecoratedReviewItem = ({ item, onViewRepository, onDeleteReview }) => {
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "#fff",
      justifyContent: "space-between",
      padding: 20,
      paddingTop: 0
    },
    button: {
      borderRadius: 5,
      flexGrow: 1
    },
    buttonText: {
      color: "#fff",
      padding: 10,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16
    }
  });

  const review = {
    rating: item.rating,
    title: item.repository.fullName,
    createdAt: item.createdAt,
    text: item.text
  };

  return (
    <View>
      <RepositoryReview review={review} />
      <View style={styles.container}>
        <Pressable style={[styles.button, { backgroundColor: "steelblue", marginRight: 5 }]} onPress={() => onViewRepository(item.repository.id)}>
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: "red", marginLeft: 5 }]} onPress={() => onDeleteReview(item.id)}>
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
}

const UserReviews = () => {
  const {data} = useQuery(GET_AUTHORIZED_USER, { variables: { includeReviews: true }, fetchPolicy: "cache-and-network" });
  const [deleteReview] = useMutation(DELETE_REVIEW, { refetchQueries: [ { query: GET_AUTHORIZED_USER, variables: { includeReviews: true }} ] });
  const history = useHistory();

  if(data && data.loading) return <Text>Loading...</Text>

  const items = data?.authorizedUser?.reviews.edges.map(e => e.node);

  if(!items) return <Text>Something went wrong :(</Text>

  const showAlert = (reviewId) => {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteReview(reviewId),
          style: "delete",
        },
      ],
    );
  }

  const viewRepository = (id) => {
    history.push(`/repositories/${id}`);
  }

  const handleDeleteReview = async (id) => {
    try {
      console.log("DELETING", id)
      await deleteReview({ variables: { id }});
      
    } catch(e) {
      console.log(e);
    }
  }

  const renderItem = ({ item }) => {
    return <DecoratedReviewItem item={item} onViewRepository={viewRepository} onDeleteReview={showAlert} />
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={items}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      keyExtractor={item => item.id}
    />
  );
};

export default UserReviews;