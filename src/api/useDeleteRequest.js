import React from 'react';
import HOST_URL from "../constants";
import axios from 'axios';

const del = async (url, data = {}) => {
  const token = localStorage.getItem('access_token');

  return await axios
    .delete(HOST_URL + url, {
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
      data
    }).then(res => {
      return res.status === 200
    }).catch(err => console.log(err));
};

export default del;
