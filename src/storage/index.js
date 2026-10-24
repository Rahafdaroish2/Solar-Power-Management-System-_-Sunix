import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createStorage } from './createStorage';
export const storage = createStorage(AsyncStorage);
export const sessionStorage = createStorage({
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
});
export const userStorage = (userId) =>
  createStorage(AsyncStorage, `sunix.v1.user.${encodeURIComponent(userId)}.`);
