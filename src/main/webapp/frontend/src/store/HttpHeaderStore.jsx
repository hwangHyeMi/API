import { create } from 'zustand';

// 새로고침하면 App Context 사라지기 때문에, 초기 값은 localStorage 값으로 세팅
const getHeaderData = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem('com_access_token')}`,
  };
};

const removeHeaderData = () => {
  localStorage.removeItem('com_access_token');
};

const httpHeaderStore = create((set) => ({
  getHeaders: () => {
    return getHeaderData();
  },
  removeHeaderData: () => {
    removeHeaderData();
  },
}));

export default httpHeaderStore;
