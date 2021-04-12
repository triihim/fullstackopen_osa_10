import { useQuery } from "@apollo/client";
import { GET_REPOSITORIES } from "../graphql/queries";

const useRepositories = (variables) => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES, { variables });
  return { repositories: data && data.repositories, error, loading };
};

export default useRepositories;