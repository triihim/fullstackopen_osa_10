import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
  constructor(namespace = "auth") {
    this.namespace = namespace;
  }

  tokenKey = `${this.namespace}:token`;

  async getAccessToken() {
    return await AsyncStorage.getItem(this.tokenKey);
  }

  async setAccessToken(accessToken) {
    return await AsyncStorage.setItem(this.tokenKey, accessToken);
  }

  async removeAccessToken() {
    return await AsyncStorage.removeItem(this.tokenKey);
  }
}

export default AuthStorage;