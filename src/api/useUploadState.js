import {useState} from "react";
import HOST_URL from "../constants";
import * as moment from 'moment';
import _ from 'lodash';

function useUploadState() {
 const [uploadState, setUploadState] = useState(null);

  const loadApi = () => {
    const token = localStorage.getItem('access_token');
    let url =  `${HOST_URL}/api/skillaz-candidates/upload-state`;
    fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then(json => {
      if(json.status === 500) return json.status;
      if(json.statusText ==="OK") return json.json();
    }).then((result) => {
      try {
        if(!_.isEmpty(result)) setUploadState(moment(result['uploadedAt'], 'YYYYMMDDTHH:mm').format("DD.MM.YYYY HH:mm"));
      } catch (e) {
        console.log(e);
      }
    })
  };

  return [loadApi, uploadState, setUploadState, ];
}

export default useUploadState;
