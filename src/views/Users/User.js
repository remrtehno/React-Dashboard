import React, {useEffect} from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import useUsersApi from './useUsersApi'

function User(props) {
  const [users, loadUsers] = useUsersApi(props.match.params.id);

  useEffect(() => {
    loadUsers();
  }, []);

    const userDetails = users.identity ? Object.entries(users.identity) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]];

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
