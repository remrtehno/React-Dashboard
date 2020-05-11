import React, {useState} from "react";
import axios from "axios";
import HOST_URL from "../constants";

const GetImageByIdsApi = () => {
  const [images, setImages] = useState([]);
  const token = localStorage.getItem('access_token');

  const loadImages = async (imageIds) => {
    const loadedImages = await Promise.all(
      imageIds.map(async id => {
        return await axios
          .get(HOST_URL + `/api/images/${id}`, {
            headers: {
              'Accept': '*/*',
              'Authorization': 'Bearer ' + token
            },
          }).then(res => res.data ? ({...res.data, data: res.data.data}) : null)
      })
    );

    loadedImages && setImages(loadedImages);
  };

  return [images, loadImages];
};

export default GetImageByIdsApi;
