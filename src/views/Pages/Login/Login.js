import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import HOST_URL from '../../../constants';

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

function Login() {
  let history = useHistory();
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);


  const dashboard = () => {
    history.push('/dashboard');
  };

  const login = (event) => {
    event.preventDefault();
    fetch(HOST_URL +'/api/userSessions', {
      method: 'post',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/*+json'
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      })
    }).then(json => {
      if(json.status === 500) return json.status;
      return json.json()
      }).then((result) => {
        if (result.token) {
          let expiresAt = JSON.stringify(( (7*24*60*60) * 1000) + new Date().getTime());
          localStorage.setItem('access_token', result.token);
          localStorage.setItem('expires_at', expiresAt);
          dashboard();
        } else {
          alert('Invalid User');
          console.log(userName,password)
        }
      })
  };

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText >
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Username" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <button onClick={login} className={'px-4 btn btn-primary'}> Login </button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button  color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
}

export default Login;
