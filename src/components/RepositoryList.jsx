import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import useRepositories from "../hooks/useRepositories";
import RepositoryItem from "./RepositoryItem";
import { useHistory } from "react-router-native";
import { Button, Menu, Provider, Searchbar } from "react-native-paper";
import Text from "./Text";
import { useDebounce } from "use-debounce";

const styles = StyleSheet.create({
  separator: {
    height: 10
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ListSort = ({ sortBy }) => {
  const [visible, setVisible] = useState(false);
  const [ordering, setOrdering] = useState("Latest repositories");

  const sortByLatest = () => {
    sortBy("CREATED_AT", "DESC"),
    setOrdering("Latest");
    setVisible(false);
  };

  const sortByHighestRated = () => {
    sortBy("RATING_AVERAGE", "DESC");
    setOrdering("Highest rated");
    setVisible(false);
  };

  const sortByLowestRated = () => {
    sortBy("RATING_AVERAGE", "ASC");
    setOrdering("Lowest rated");
    setVisible(false);
  };

  return (
    <Provider>
      <View
        style={{
          paddingTop: 30,
          paddingBottom: 10,
          justifyContent: "center",
          flexDirection: "row"
        }}>
        <Menu 
          visible={visible} 
          anchor={<Button onPress={() => setVisible(true)}><Text fontWeight="bold">{ordering}</Text></Button>}
          onDismiss={() => setVisible(false)}
        >
          <Menu.Item onPress={sortByLatest} title="Latest repositories" />
          <Menu.Item onPress={sortByHighestRated} title="Highest rated repositories" />
          <Menu.Item onPress={sortByLowestRated} title="Lowest rated repositories" />
        </Menu>
      </View>
    </Provider>
  );
};

const SearchRepository = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [query] = useDebounce(searchQuery, 500);

  const onChangeSearch = query => {
    setSearchQuery(query);
    onSearch(query);
  }
  return (
    <Searchbar
      style={{
        marginBottom: 20
      }}
      placeholder="Search repository"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
  );
}

export const RepositoryListContainer = ({ repositories, onSearch }) => {
  const history = useHistory();

  const repositoryNodes = repositories ? repositories.edges.map((edge) => edge.node) : [];

  const showRepositoryDetails = id => history.push(`/repositories/${id}`);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => showRepositoryDetails(item.id)}>
        <RepositoryItem item={item} />
      </Pressable>
    );
  };

  const search = () => {
    return <SearchRepository onSearch={onSearch} />
  };

  return (
    <FlatList style={{ zIndex: -9999 }}
      ListHeaderComponent={search}
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const RepositoryList = () => {
  const [orderBy, setOrderBy] = useState("CREATED_AT");
  const [orderDirection, setOrderDirection] = useState("DESC");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { repositories } = useRepositories({ orderBy, orderDirection, searchKeyword });

  const sortBy = (property, order) => {
    setOrderBy(property);
    setOrderDirection(order)
  };

  const onSearch = (keyword) => {
    setSearchKeyword(keyword);
  }

  return (
    <View>
      <ListSort sortBy={sortBy} />
      <RepositoryListContainer repositories={repositories} onSearch={onSearch} />
    </View>
  );
};

export default RepositoryList;