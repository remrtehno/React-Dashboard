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
            responseType: 'arraybuffer',
            headers: {
              'Accept': '*/*',
              'Authorization': 'Bearer ' + token
            },
          }).then(res => res.data ? ({data: _imageEncode(res.data), id}) : null)
      })
    );

    loadedImages && setImages(loadedImages);
  };

  function _imageEncode (arrayBuffer) {
    let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''));
    let mimetype="image/png";

    return "data:"+mimetype+";base64,"+b64encoded
  }

  return [images, loadImages];
};

export default GetImageByIdsApi;
