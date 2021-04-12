import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import useRepositories from "../hooks/useRepositories";
import RepositoryItem from "./RepositoryItem";
import { useHistory } from "react-router-native";
import { Searchbar } from "react-native-paper";
import Text from "./Text";
import { useDebouncedCallback } from "use-debounce";

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

  const styles = StyleSheet.create({
    menuButton: {
      padding: 20,
      alignItems: "center"
    },
    menuButtonText: {
      fontWeight: "bold",
      fontSize: 18
    },
    menu: {
      textAlign: "center",
      backgroundColor: "#fff",
      marginBottom: 20
    },
    menuItem: {
      padding: 10,
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#eee"
    },
    menuItemText: {
      fontSize: 16,
      textAlign: "center"
    }
  });

  const renderMenu = () => {
    return (
      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={sortByLatest}><Text style={styles.menuItemText}>Latest repositories</Text></Pressable>
        <Pressable style={styles.menuItem} onPress={sortByHighestRated}><Text style={styles.menuItemText}>Highest rated repositories</Text></Pressable>
        <Pressable style={styles.menuItem} onPress={sortByLowestRated}><Text style={styles.menuItemText}>Lowest rated repositories</Text></Pressable>
      </View>
    );
  };

  return (
    <View>
      <Pressable style={styles.menuButton} onPress={() => setVisible(!visible)}><Text style={styles.menuButtonText}>{ordering}</Text></Pressable>
      {visible && renderMenu()}
    </View>

    // The below react-native-paper menu does not work properly. Despite all attempts the menu opens underneath the list items.

    // <Provider>
    //   <View
    //     style={{
    //       paddingTop: 20,
    //       paddingBottom: 10,
    //       justifyContent: "center",
    //       flexDirection: "row"
    //     }}>
    //     <Menu 
    //       visible={visible} 
    //       anchor={<Button onPress={() => setVisible(true)}><Text fontWeight="bold">{ordering}</Text></Button>}
    //       onDismiss={() => setVisible(false)}
    //     >
    //       <Menu.Item onPress={sortByLatest} title="Latest repositories" />
    //       <Menu.Item onPress={sortByHighestRated} title="Highest rated repositories" />
    //       <Menu.Item onPress={sortByLowestRated} title="Lowest rated repositories" />
    //     </Menu>
    //   </View>
    // </Provider>
  );
};

const SearchRepository = ({ initialValue, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const debounced = useDebouncedCallback(
    () => {
      onSearch(searchQuery);
    },
    500
  );

  return (
    <Searchbar
      style={{
        marginBottom: 20
      }}
      placeholder="Search repository"
      onChangeText={(text) => setSearchQuery(text) || debounced()}
      value={searchQuery}
    />
  );
}

const ListItem = ({ item }) => {
  const history = useHistory();
  const showRepositoryDetails = id => history.push(`/repositories/${id}`);
  return (
    <Pressable onPress={() => showRepositoryDetails(item.id)}>
      <RepositoryItem item={item} />
    </Pressable>
  );
};

export class RepositoryListContainer extends React.Component {
  renderItem = ({ item }) => {
    return <ListItem item={item} />
  };

  renderHeader = () => {
    return (
      <View>
        <ListSort sortBy={this.props.onSort} />
        <SearchRepository onSearch={this.props.onSearch} initialValue={this.props.searchKeyword} />
      </View>
    );
  };

  render = () => {
    return (
      <FlatList
        style={{ flex: 1 }}
        ListHeaderComponent={this.renderHeader}
        data={this.props.repositories ? this.props.repositories.edges.map((edge) => edge.node) : []}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={0.5}
      />
    );
  }
};

const RepositoryList = () => {
  const [orderBy, setOrderBy] = useState("CREATED_AT");
  const [orderDirection, setOrderDirection] = useState("DESC");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { repositories, fetchMore } = useRepositories({ orderBy, orderDirection, searchKeyword, first: 8 });

  const sortBy = (property, order) => {
    setOrderBy(property);
    setOrderDirection(order)
  };

  const onSearch = (keyword) => {
    setSearchKeyword(keyword);
  }

  const onEndReached = () => {
    fetchMore();
  }

  return (
    <View style={{ flex: 1 }}>
      <RepositoryListContainer 
        repositories={repositories} 
        onSearch={onSearch} 
        searchKeyword={searchKeyword} 
        onEndReached={onEndReached}
        onSort={sortBy}
      />
    </View>
  );
};

export default RepositoryList;