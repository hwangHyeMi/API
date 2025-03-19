import { create } from 'zustand';
import axios from 'axios';

const setMenuDatas = async () => {
  const ALL_MENU_URL = `${process.env.REACT_APP_ALL_MENU_URL}`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('com_access_token')}`,
  };
  try {
    await axios
      .get(ALL_MENU_URL, {
        headers: headers,
      })
      .then((resp) => {
        console.log(resp.data);
        if (resp && resp.data) {
          localStorage.setItem('allMenus', JSON.stringify(resp.data));
        }
      });
  } catch (error) {
    throw error;
  }
};
const getMenuDatas = () => {
  return JSON.parse(localStorage.getItem('allMenus'));
};
const removeMenuDatas = () => {
  localStorage.removeItem('allMenus');
};

const menuStore = create((set) => ({
  getMenuDatas: () => {
    return getMenuDatas();
  },
  isMenuData: getMenuDatas() ? true : false, //초기값
  initMenuData: () => {
    try {
      removeMenuDatas();
      setMenuDatas();
      set({ isMenuData: true });
    } catch (error) {
      set({ isMenuData: false });
    }
  },
  getMenuList: () => {
    return getMenuDatas();
  },
  removeMenuList: () => {
    removeMenuDatas();
    set({ isMenuData: false });
  },
}));

export default menuStore;
