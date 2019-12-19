import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import HOST_URL from '../../../constants/';


function Register() {
    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [name, setName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [position, setPosition] = useState(null);
    const [password, setPassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);

    const signIn = (e) => {
      if(!userName) return alert('Укажите логин');
      if(password !== repeatPassword) return alert('Не совпадают пароли');
      if(!password || !repeatPassword) return alert('Пароли должны быть заполнены');


      e.preventDefault();
      fetch(HOST_URL +'/api/users', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': 'Bearer ',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          tenantId: 0,
          roleId: 0,
          identity: JSON.stringify({
            email: email,
            phoneNumber: phone,
            lastName: lastName,
            firstName: name,
            middleName: '',
            position: position,
          })
        }),
      }).then((result) => {
        if(result.status === 500) return result.status;
        if (result.status === 200) {
          return result.clone().json();
        }
      }).then((result) => {
        console.log(result);
      });
    };

    // useEffect( () => {
    //   //loadCharts();
    // }, []);



    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4 text-center">
                  <Form>
                    <h1>Регистрация</h1>
                    <p className="text-muted">Создать аккаунт</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Логин" autoComplete="username" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setEmail(event.target.value)} type="text" placeholder="Email" autoComplete="email" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-phone  "></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setPhone(event.target.value)} type="text" placeholder="Номер телефона" autoComplete="tel" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setName(event.target.value)} type="text" placeholder="Имя" autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setLastName(event.target.value)} type="text" placeholder="Фамилия" autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setPosition(event.target.value)} type="text" placeholder="Должность" autoComplete="email" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Пароль" autoComplete="new-password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={(event) => setRepeatPassword(event.target.value)} type="password" placeholder="Повтроите пароль" autoComplete="new-password" />
                    </InputGroup>
                    <Button onClick={signIn} color="success" block>Создать аккаунт</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
}

export default Register;
