import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Input, Row, Table} from 'reactstrap';
import _ from 'lodash';
import HOST_URL from "../../constants";

function User(props) {
  const [user, setUser] = useState({
    "userName": "string",
    "password": "string",
    "tenantId": 0,
    "roleId": "string",
    "identity": {
      "email": "string",
      "phoneNumber": "string",
      "lastName": "string",
      "firstName": "string",
      "middleName": "string",
      "position": "string"
    }
  });

  const changedFields = _.cloneDeep(user);

  const sendFields = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(changedFields),
    }).then((result) => {
      console.log(result);
      if (result.status === 200) {
        window.location.reload();
      }
    });
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <Table responsive striped hover>
                <tbody>
                {
                  _.map(user, (value, key) => {
                    if(_.isObject(value)) {
                      return _.map(value, (recurseValue, recurseKey)=> {
                        return (
                          <tr key={recurseKey}>
                            <td>{`${recurseKey}:`}</td>
                            <td><strong>
                              <Input type="text" onChange={(event) => {
                                if(!changedFields.identity) {
                                  changedFields.identity = { [recurseKey]: event.target.value }
                                } else {
                                  changedFields.identity[recurseKey] = event.target.value;
                                }
                              }} placeholder={recurseValue}  />
                            </strong></td>
                          </tr>
                        )
                      })
                    }
                    return (
                      <tr key={key}>
                        <td>{`${key}:`}</td>
                        <td><strong>
                          <Input type="text" onChange={(event) => { changedFields[key] = event.target.value } } placeholder={value}  />
                        </strong></td>
                      </tr>
                    )
                  })
                }
                <tr>
                  <Button onClick={()=> sendFields()} block color="primary">Создать</Button>
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
