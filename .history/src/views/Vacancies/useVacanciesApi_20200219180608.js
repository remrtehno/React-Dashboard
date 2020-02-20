import HOST_URL from "../../constants";
import _ from "lodash";
import {useState} from "react";
import useAllRegions from "../Regions/useRegionsApi";

function usePostVacancies() {
  const sendVacancy = (query = '') => {
    if(query === " " || !query) return;
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/vacancies`, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(query),
    }).then((result) => {
      if(result.status === 500) alert(result.status); return result.status;
      if (result.status === 200) {
        return result.clone().json()
      }
    }).then((result) => {
      alert('Вакансия создана');
      window.location.reload();
    });
  };
  return [sendVacancy, ]
};

export function useVacanciesApi() {
  const [allVacancies, setAllVacancies] = useState([]);

  const load = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL + `/api/vacancies`, {
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
      setAllVacancies(result.items);
    });
  };
  return [allVacancies, load, setAllVacancies];
}

export function useVacancyApi() {
  const [vacancy, setVacancy] = useState([
    {
      "region": {
        "id": "string",
        "name": "string"
      },
      "profile": {
        "id": "string",
        "name": "string"
      },
      "name": "string",
      "salary": {
        "from": 0,
        "to": 0,
        "currency": "Undefined"
      },
      "openPositions": 0,
      "externalIds": [
      ],
      "status": "Active",
      "id": "string"
    }
   ]);

  const load = (vacancyId) => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL + `/api/vacancies`, {
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
      setVacancy(_.filter(result.items, { 'id': vacancyId }));
    });
  };
  return [vacancy, setVacancy, load];
}

export function useVacancyPutApi() {
  const loadPut = (vacancyId, data) => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL + `/api/vacancy/${vacancyId}`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data),
    }).then((result) => {
      if(result.status === 500) alert(result.status);
      if (result.status === 200) {
        alert(result.status);
        window.location.reload();
      }
    });
  };
  return [loadPut];
}

export function deleteVacancyApi() {
  const deleteVacancy = (id) => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL + `/api/vacancy/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if(result.status === 500) return result.status;
      if (result.status === 200) {
        alert('Вакансия удалена');
        window.location.reload();
      }
    });
  };
  return [deleteVacancy];
}

export default usePostVacancies;
