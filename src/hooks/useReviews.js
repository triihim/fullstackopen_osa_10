import { useLazyQuery } from "@apollo/client";
import { GET_REVIEWS } from "../graphql/queries";

const useReviews = (variables) => {
  const [getReviews, { data, loading, fetchMore, ...result }] = useLazyQuery(GET_REVIEWS, {
    variables,
    fetchPolicy: "cache-and-network" 
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    getReviews,
    fetchMore: handleFetchMore,
    loading,
    ...result,
    data
  };
};

export default useReviews;