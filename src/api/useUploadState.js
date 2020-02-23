import {useState} from "react";
import HOST_URL from "../constants";
import * as moment from 'moment';

function useUploadState() {
 const [uploadState, setUploadState] = useState(null);

  const loadApi = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +'/api/skillaz-candidates/upload-state', {
      method: 'get',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then(json => {
      if(json.status === 500) return json.status;
      return json.json();
    }).then((result) => {
      setUploadState(moment(result['uploadedAt'], 'YYYYMMDDTHH:mm').format("DD.MM.YYYY HH:mm"));
    })
  };

  return [loadApi, uploadState, setUploadState, ];
}

export default useUploadState;
