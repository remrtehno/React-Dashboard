import HOST_URL from "../../constants";
import {useState} from "react";


function useUsersApi(userName = '') {
  const token = localStorage.getItem('access_token');
  const [users, setUsers] = useState([]);
  const loadUsers = () => {
      fetch(HOST_URL +`/api/users/${userName}`, {
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
        setUsers(result.items);
      });
    };
  return [users, loadUsers];
}

export function deleteUser(userName) {
  const token = localStorage.getItem('access_token');
  fetch(HOST_URL +`/api/users/${userName}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'text/plain',
      'Authorization': 'Bearer ' + token
    },
  }).then((result) => {
    if (result.status === 200) {
      //window.location.reload();
    }
  });
}

export function changePassword(userName, newPassword) {
  const token = localStorage.getItem('access_token');
  fetch(HOST_URL +`/api/users/${userName}/api/users/{userName}/password/reset`, {
    method: 'DELETE',
    headers: {
      'Accept': '*/*',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(newPassword),
  }).then((result) => {
    if (result.status === 200) {
      window.location.reload();
    }
  });
}

export default useUsersApi;
