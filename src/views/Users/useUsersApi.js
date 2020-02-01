import HOST_URL from "../../constants";
import {useState} from "react";

function useUsersApi(userName = '') {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('access_token');
  
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

export default useUsersApi;
