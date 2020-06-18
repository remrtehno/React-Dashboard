import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Input, Row, FormFeedback, FormGroup} from 'reactstrap';
import _ from 'lodash';
import {get} from '../../api'
import HOST_URL from "../../constants";
import Select from "react-select";

function User(props) {
  const [user, setUser] = useState({
    "userName": "",
    "password": "",
    "repeatPassword": "",
    "roleId": "",
    "identity": {
      "email": "",
      "phoneNumber": "",
      "lastName": "",
      "firstName": "",
      "middleName": "",
      "position": ""
    }
  });
  const [roles, setRoles] = useState([])
  const [isInvalidPassword, setIsInvalidPassword] = useState(false)
  const [isInvalidEmail, setIsInvalidEmail] = useState(false)

  useEffect(() => {
    get('/api/roles', {Page: 1, Size: 10})
      .then(res => setRoles([...res.items]))
  }, [])

  const validatePassword = () => {
    if (user.password !== user.repeatPassword) {
      setIsInvalidPassword(true)
      return false
    }
    return true
  }

  const validateEmail = () => {
    const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;

    if (!reg.test(user.identity.email)) {
      setIsInvalidEmail(true)
      return false
    }

    return true
  }

  const sendFields = () => {
    const isValidUser = validatePassword() && validateEmail()

    if (isValidUser) {
      const {
        repeatPassword,
        ...userToUpload
      } = user
      console.log('lol')

      // const token = localStorage.getItem('access_token');
      // fetch(HOST_URL +`/api/users`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + token
      //   },
      //   body: JSON.stringify(user),
      // }).then((result) => {
      //   if (result.status === 200) {
      //     window.location.reload();
      //   }
      // });
    }
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              {
                _.map(user, (value, key) => {
                  if(_.isObject(value)) {
                    return _.map(value, (recurseValue, recurseKey)=> {
                      if (recurseKey === 'email') return (
                        <Row className='border-bottom border-secondary pt-2 pb-2' key={key}>
                          <Col>{`${key}:`}</Col>
                          <Col>
                            <FormGroup>
                              <Input
                                invalid={isInvalidEmail}
                                type="text"
                                onChange={(event) => {
                                  setUser({
                                    ...user,
                                    identity: {
                                      ...user.identity,
                                      [recurseKey]: event.target.value
                                    }
                                  })
                                  setIsInvalidEmail(false)
                                }}
                                placeholder='example@mail.com'
                              />
                              <FormFeedback>
                                Invalid email
                              </FormFeedback>
                            </FormGroup>
                          </Col>
                        </Row>
                      )

                      return (
                        <Row className='border-bottom border-secondary pt-2 pb-2' key={recurseKey}>
                          <Col>{`${recurseKey}:`}</Col>
                          <Col>
                            <Input
                              type="text"
                              onChange={(event) => {
                                setUser({
                                  ...user,
                                  identity: {
                                    ...user.identity,
                                    [recurseKey]: event.target.value
                                  }
                                })
                              }}
                              placeholder={recurseValue}
                            />
                          </Col>
                        </Row>
                      )
                    })
                  }

                  if (key === 'roleId') return (
                    <Row className='border-bottom border-secondary pt-2 pb-2' key={key}>
                      <Col>{`${key}:`}</Col>
                      <Col>
                        <Select

                        />
                      </Col>
                    </Row>
                  )

                  if (key === 'repeatPassword') return (
                    <Row className='border-bottom border-secondary pt-2 pb-2' key={key}>
                      <Col>{`${key}:`}</Col>
                      <Col>
                        <FormGroup>
                          <Input
                            invalid={isInvalidPassword}
                            type="text"
                            onChange={(event) => {
                              setUser({...user, [key]: event.target.value})
                              setIsInvalidPassword(false)
                            }}
                            placeholder={value}
                          />
                          <FormFeedback>
                            The password does not match
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  )

                  return (
                    <Row className='border-bottom border-secondary pt-2 pb-2' key={key}>
                      <Col>{`${key}:`}</Col>
                      <Col>
                        <Input
                          type="text"
                          onChange={(event) => setUser({...user, [key]: event.target.value})}
                          placeholder={value}
                        />
                      </Col>
                    </Row>
                  )
                })
              }
              <Button
                className='col-sm-3 mt-2'
                onClick={()=> sendFields()} block color="primary"
              >
                Создать
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default User;
