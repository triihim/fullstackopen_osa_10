import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import useAuthStorage from "./useAuthStorage";

const useSignIn = () => {
  const [login, result] = useMutation(LOGIN);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    const { data } = await login({ variables: { username, password } });
    await authStorage.setAccessToken(data.authorize.accessToken);
    apolloClient.resetStore();
    return;
  };

  return [signIn, result];
};

export default useSignIn;