import HOST_URL from "../../constants";
import _ from "lodash";
import {useState} from "react";

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
      if (result.status === 200) return result.clone().json();
    }).then((result) => {
      try {
        if(!_.isEmpty(result)) setAllVacancies(result.items);
      } catch (e) {
        console.log(e);
      }
    });
  };
  return [allVacancies, load, setAllVacancies];
}

export function useVacancyApi() {
  const [vacancy, setVacancy] = useState({
      "region": {
        "id": "",
        "name": ""
      },
      "profile": {
        "id": "",
        "name": ""
      },
      "name": "",
      "salary": {
        "from": 0,
        "to": 0,
        "currency": ""
      },
      "openPositions": 0,
      "externalIds": [
      ],
      "status": "",
      "id": ""
    });

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
      setVacancy(_.find(result.items, { 'id': vacancyId }));
    });
  };
  return [vacancy, setVacancy, load];
}

export function useVacancyPutApi() {
  const loadPut = (vacancyId, data) => {
    const token = localStorage.getItem('access_token');
    return fetch(HOST_URL + `/api/vacancies/${vacancyId}`, {
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
        return result.status === 200
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
