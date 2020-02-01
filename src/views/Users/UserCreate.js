import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, CardHeader, Col, Input, Row, Table} from 'reactstrap';
import _ from 'lodash';
import HOST_URL from "../../constants";

function User(props) {
  const [user, setUser] = useState([]);
  const userId = props.match.params.id;
  const changedFields = _.cloneDeep(user.identity);
  const token = localStorage.getItem('access_token');

  const sendFields = () => {
    fetch(HOST_URL +`/api/users/${userId}/identity/change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(changedFields),
    }).then((result) => {
      if (result.status === 200) {
        window.location.reload();
      }
    });
  };

  const loadUser = () => {
    fetch(HOST_URL +`/api/users/${userId}`, {
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
      setUser(result);
    });
  };

  useEffect(() => {
    loadUser(userId);
  }, []);

  const userDetails = user.identity ? Object.entries(user.identity) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]];

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <strong><i className="icon-info pr-1"></i>User id: {userId}</strong>
            </CardHeader>
            <CardBody>
              <Table responsive striped hover>
                <tbody>
                {
                  userDetails.map(([key, value]) => {
                    return (
                      <tr key={key}>
                        <td>{`${key}:`}</td>
                        <td><strong>
                          <Input type="text" onChange={(event) => { changedFields[key] = event.target.value } } placeholder={value} autoComplete="username" />
                        </strong></td>
                      </tr>
                    )
                  })
                }
                <tr>
                  <Button onClick={()=> sendFields()} block color="primary">Сохранить</Button>
                </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default User;
