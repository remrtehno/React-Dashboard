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

export function useProfileApi() {
  const [profile, setProfile] = useState({keywords: "", negativeKeywords: "", tasks: [], externalIds: [],});
  const loadProfile = (id = 0) => {
    if(!id) return;
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/profile/${id}`, {
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
      setProfile(result);
    });
  };

  return [profile, loadProfile, setProfile];
}

export function useProfileUpdate() {
  const updateProfile = (id = 0, data) => {
    console.log(window.ps = data);
    if(!id) return;
    const token = localStorage.getItem('access_token');
    fetch( `${HOST_URL}/api/profile/${id}`, {
      method: 'put',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data),
    }).then((result) => {
      if (result.status === 200) {
        alert(result.status);
        window.location.reload();
      }
    });
  };

  return [updateProfile];
}

export function useProfileCreate() {
  const createProfile = (data) => {
    const token = localStorage.getItem('access_token');
    fetch( `${HOST_URL}/api/profiles/`, {
      method: 'post',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data),
    }).then((result) => {
      if (result.status === 200) {
        alert(result);
        window.location.reload();
      }
    });
  };

  return [createProfile];
}

export function useProfileDelete() {
  const deleteProfile = (id) => {
    const token = localStorage.getItem('access_token');
    fetch( `${HOST_URL}/api/profile/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        alert(result.status);
        window.history.back();
      }
    });
  };

  return [deleteProfile];
}

export default useProfilesApi;