import React from "react";
import { View, StyleSheet, Image, Pressable, FlatList } from "react-native";
import Text from "./Text";
import theme from "../theme";
import { useParams } from "react-router-native";
import { useLazyQuery } from "@apollo/client";
import { GET_REPOSITORY, GET_REVIEWS } from "../graphql/queries";
import * as Linking from "expo-linking";
import RepositoryReview from "./RepositoryReview";
import useReviews from "../hooks/useReviews";

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#fff",
    flex: 1
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flexDirection: "column",
    flexShrink: 1
  },
  icon: {
    width: 60,
    height: 60,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 5
  },
  languagePill: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
    color: "#fff",
    padding: 3,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  statisticRow: {
    padding: 20,
    paddingBottom: 0,
    justifyContent: "space-between"
  },
  statistic: {
    textAlign: "center"
  },
  description: {
    marginTop: 5,
    marginBottom: 5
  },
  githubButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5
  },
  githubButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    padding: 10,
  }
});

const GithubLink = ({ url }) => {
  const openInGithub = () => Linking.openURL(url);
  return (
    <Pressable onPress={openInGithub} style={style.githubButton}>
      <Text style={style.githubButtonText}>Open in GitHub</Text>
    </Pressable>
  );
}

const RepositoryReviews = ({ reviews }) => {
  if(reviews.loading) return <Text>Loading ...</Text>
  if(!reviews.data) return null;

  const items = reviews.data.repository.reviews.edges.map(e => e.node)

  const renderItem = ({ item }) => {
    return <RepositoryReview review={item} />
  }

  const separator = () => {
    return <View style={{height: 10}}></View>
  }

  const fetchMoreReviews = () => {
    reviews.fetchMore();
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={items}
      renderItem={renderItem}
      ItemSeparatorComponent={separator}
      keyExtractor={item => item.id}
      onEndReached={fetchMoreReviews}
      onEndReachedThreshold={0.5}
    />
  );
}

const RepositoryItem = ({ item }) => {
  const { id } = useParams();
  const [getRepository, repositoryResult] = useLazyQuery(GET_REPOSITORY, { fetchPolicy: 'cache-and-network' });
  const reviewsResult = useReviews(); 

  const showDetails = !!id;

  if(id && !repositoryResult.called && !reviewsResult.called) {
    getRepository({ variables: { id: id } });
    reviewsResult.getReviews({ variables: { id: id, first: 8 } });
  }

  if(repositoryResult.called && repositoryResult.loading) return <Text>Loading...</Text>
  if(repositoryResult.data && repositoryResult.data.repository) item = repositoryResult.data.repository;
  if(!item) return <Text>Something went wrong :(</Text>

  const parseValue = value => value >= 1000 ? (value * 0.001).toFixed(1) + "k" : value;
  
  return (
    <View testID={"repositoryItem"} style={style.container}>
      <View style={style.row}>
        <Image style={style.icon} source={{ uri: item.ownerAvatarUrl }} />
        <View style={style.col}>
          <Text color="textPrimary" fontWeight="bold" fontSize="subheading">{item.fullName}</Text>
          <Text style={style.description} color="textSecondary">{item.description}</Text>
          <Text style={style.languagePill}>{item.language}</Text>
        </View>
      </View>
      <View style={[style.statisticRow, style.row]}>
        <View style={style.col}>
          <Text fontWeight="bold" color="primary" style={style.statistic}>{parseValue(item.stargazersCount)}</Text>
          <Text color="textSecondary" style={style.statistic}>{"Stars"}</Text>
        </View>
        <View style={style.col}>
          <Text fontWeight="bold" color="primary" style={style.statistic}>{parseValue(item.forksCount)}</Text>
          <Text color="textSecondary" style={style.statistic}>{"Forks"}</Text>
        </View>
        <View style={style.col}>
          <Text fontWeight="bold" color="primary" style={style.statistic}>{parseValue(item.reviewCount)}</Text>
          <Text color="textSecondary" style={style.statistic}>{"Reviews"}</Text>
        </View>
        <View style={style.col}>
          <Text fontWeight="bold" color="primary" style={style.statistic}>{parseValue(item.ratingAverage)}</Text>
          <Text color="textSecondary" style={style.statistic}>{"Rating"}</Text>
        </View>
      </View>
      {showDetails && <GithubLink url={item.url} />}
      {showDetails && <RepositoryReviews reviews={reviewsResult} />}
    </View>
  );
};

export default RepositoryItem;