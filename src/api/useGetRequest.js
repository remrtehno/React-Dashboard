import React from 'react';
import HOST_URL from "../constants";
import axios from 'axios';

const get = async (url, params = {}) => {
  const token = localStorage.getItem('access_token');

  return await axios
    .get(HOST_URL + url, {
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
      params
    }).then(res => {
      return res.data
    }).catch(err => console.log(err));
};

export default get;
