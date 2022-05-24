import { DataFromStorage } from "../App";

const getObjectFromLocalStorage = async (
  key: string
): Promise<DataFromStorage | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const saveObjectInLocalStorage = async (obj: any) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set(obj, function () {
        resolve(undefined);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const removeObjectFromLocalStorage = async (keys: string) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.remove(keys, function () {
        resolve(undefined);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export {
  getObjectFromLocalStorage,
  saveObjectInLocalStorage,
  removeObjectFromLocalStorage,
};
