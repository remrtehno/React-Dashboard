import React from 'react';
import HOST_URL from "../constants";
import axios from 'axios';

const put = async (url, data = null) => {
  const token = localStorage.getItem('access_token');

  return await axios
    .put(HOST_URL + url, data,{
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then(res => {
      if (res.status === 200)
      console.log(res);
      return true
    }).catch(err => console.log(err));
};

export default put;
