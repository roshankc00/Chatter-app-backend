import axios from 'axios';

export const getData = async (url, token) => {
  const { data } = await axios.get(`http://localhost:3002/${url}`);
  console.log(data);
  return data;
};
