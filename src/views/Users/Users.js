import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Button, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';

import useUsersApi from './useUsersApi';


function UserRow(props) {
  const user = props.user;
  const userLink = `/users/${user.userName}`;

  return (
    <tr key={user.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.userName}</Link></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td>
        <Link to={`/users/edit/${user.userName}`}>
          <Button className='mb-2' block color="primary">Редактировать</Button>
        </Link>
        <Button block color="primary">Удалить</Button>
      </td>
    </tr>
  )
}

function Users() {
  const [users, loadUsers] = useUsersApi();

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xl={6}>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Users <small className="text-muted">example</small>
            </CardHeader>
            <CardBody>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">name</th>
                    <th scope="col">registered</th>
                    <th scope="col">role</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) =>
                    <UserRow key={index} user={user}/>
                  )}
                </tbody>
              </Table>
              <Link to={`/user/create`}><Button block color="primary">Добавить нового пользователя</Button></Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Users;
