import { create } from 'zustand';
import axios from 'axios';

const setCodDatas = async () => {
  const ALL_CODC_URL = `${process.env.REACT_APP_ALL_CODE_URL}`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('com_access_token')}`,
  };
  try {
    await axios
      .get(ALL_CODC_URL, {
        headers: headers,
      })
      .then((resp) => {
        //console.log(resp.data);
        if (resp && resp.data) {
          localStorage.setItem('com_codes', JSON.stringify(resp.data));
        }
      });
  } catch (error) {
    throw error;
  }
};
const getCodGroupDatas = () => {
  const com_codes = JSON.parse(localStorage.getItem('com_codes'));
  return com_codes;
};
const getCodDtlList = (codGroup) => {
  const com_all_codes = JSON.parse(localStorage.getItem('com_codes'));
  const com_group_code = com_all_codes.filter((data) => data.codeGroupCd === codGroup);
  if (com_group_code && com_group_code.length > 0) {
    return com_group_code[0].codeDetailList;
  } else {
    return [];
  }
};
const removeCodDatas = () => {
  localStorage.removeItem('com_codes');
};

const codeStore = create((set) => ({
  isCodeData: getCodGroupDatas() ? true : false, //초기값
  initCodData: () => {
    try {
      removeCodDatas();
      setCodDatas();
      set({ isCodeData: true });
    } catch (error) {
      set({ isCodeData: false });
    }
  },
  getCodGroupList: () => {
    return getCodGroupDatas();
  },
  getCodDtlList: (codGroup) => {
    return getCodDtlList(codGroup);
  },
  removeCodList: () => {
    removeCodDatas();
    set({ isCodeData: false });
  },
}));

export default codeStore;
