import React from 'react';
import HOST_URL from "../constants";
import axios from 'axios';

const post = async (url, data = null) => {
  const token = localStorage.getItem('access_token');

  return await axios
    .post(HOST_URL + url, data,{
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then(res => {
      return res
    }).catch(err => console.log(err));
};

export default post;
