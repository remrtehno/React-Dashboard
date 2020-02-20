import HOST_URL from "../../constants";
import {useState} from "react";
import _ from "lodash";

function useProfilesApi() {
  const [profiles, setProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);

  const loadProfiles = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/profiles`, {
      method: 'get',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        return result.clone().json();
      }
    }).then((result) => {
      setAllProfiles(result.items);
      setProfiles(_.map(result.items, (value) => { return {value: value.name, label: value.name}; }));
    });
  };

  return [profiles, loadProfiles, allProfiles];
}


export default useProfilesApi;