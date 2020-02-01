import React, {useEffect, useState} from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import HOST_URL from "../../constants";

function User(props) {

  const [user, setUser] = useState([]);
  const loadUser = (userName) => {
    const token = localStorage.getItem('access_token');
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
      setUser(result);
    });
  };

  useEffect(() => {
    loadUser(props.match.params.id);
  }, []);

  const userDetails = user.identity ? Object.entries(user.identity) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]];

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <strong><i className="icon-info pr-1"></i>User id: {props.match.params.id}</strong>
            </CardHeader>
            <CardBody>
                <Table responsive striped hover>
                  <tbody>
                    {
                      userDetails.map(([key, value]) => {
                        return (
                          <tr key={key}>
                            <td>{`${key}:`}</td>
                            <td><strong>{value}</strong></td>
                          </tr>
                        )
                      })
                    }
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
