import {useState} from 'react';
import HOST_URL from "../../constants";

export function useCompaniesApi() {
  const [allCompanies, setAllCompanies] = useState([]);

  const load = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL + `/api/yandex-direct/campaigns`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        return result.clone().json()
      }
    }).then((result) => {
      setAllCompanies(result.items);
    }).catch(err => {
      console.log(err)
    });
  };
  return [allCompanies, load];
}
