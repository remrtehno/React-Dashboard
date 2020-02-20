import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import Fuse from 'fuse.js';

import {useVacanciesApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";


const Component = () => {
  const [getAllVacancies, load, setAllVacancies] = useVacanciesApi();
  const [vacanciesFiltered, setVacanciesFiltered] = useVacanciesApi();
  const [modal, setModal] = useState({modal: false});

  var opts = {
    keys: ['name']
  };
  var fuse = new Fuse(getAllVacancies, opts);


  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  useEffect(() => {
    load();
  }, []);


  console.log(getAllVacancies)

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0"><h2 className="mb-0"> Вакансии </h2></Col>
            <Col lg="3">
              <Input  onChange={ event => console.log( fuse.search(event.target.value)  ) }/>
            </Col>
            <Col lg="2">
              <Select
                    placeholder={"Статус"}
                    closeMenuOnSelect={true}
                    options={ [{value: 'active', label: 'Активные'}, {value: 'stopped', label: 'Неактивные'}] } 
                    onChange={ (value) => { console.log(_.filter(getAllVacancies, field => field.status === value.value )); } }
                    />
            </Col>
            <Col lg="2">
              <Select
                  placeholder={"Регион"}
                  closeMenuOnSelect={true}
                  options={ [{value: 'Rub', label: 'Rub'}, {value: '$', label: '$'}] } />
            </Col>
            <Col lg="2">
              <Select
                placeholder={"Профиль"}
                closeMenuOnSelect={true}
                options={ [{value: 'Rub', label: 'Rub'}, {value: '$', label: '$'}] } />
            </Col>
            <Col lg="1">
              <Button> Добавить </Button>
            </Col>
          </Row>
            <hr color="black"/>
            {
              _.map(  getAllVacancies, (value, key) => {
                return (
                  <Link key={key} className="vacancy" to={`vacancy/${value.id}`} >
                    <div className="d-flex justify-content-between">
                      <div className="name">
                        {`${value.name}`}, {`${value.region.name}`}
                        {_.map(value.profile.externalIds, field => { return field.system })}
                      </div>
                      <div>
                          <Link to={`/vacancy/edit/${value.id}`} >
                            <Button color="primary">Редактировать</Button>
                          </Link>
                      </div>
                    </div>

                      <div className="d-inline-block align-top mr-5">
                        <table cellPadding="2">
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Профиль:</b> 
                              </div>
                            </td>
                            <td>
                              {`${value.profile.name}`}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Регион:</b> 
                              </div>
                            </td>
                            <td>{`${value.region.name}`}</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Статус:</b> 
                              </div>
                            </td>
                            <td>{`${value.status}`}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="d-inline-block align-top">
                        <table cellPadding="2">
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Кампаний:</b> 
                              </div>
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Просмотров сегодня:</b> 
                              </div>
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Отликов сегодня:</b> 
                              </div>
                            </td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="vacancy-field">
                                <b>Интервью сегодня:</b> 
                              </div>
                            </td>
                            <td>0</td>
                          </tr>
                        </table>
                      </div>
                  </Link>
                )
              })
            }
        </Col>
      </Row>
    </div>
  );
};

export default Component;
