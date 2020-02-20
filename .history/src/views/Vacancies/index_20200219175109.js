import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';

import {useVacanciesApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";

const Component = () => {
  const [getAllVacancies, load, setAllVacancies] = useVacanciesApi();
  const [vacanciesFiltered, setVacanciesFiltered] = useVacanciesApi();
  const [modal, setModal] = useState({modal: false});

  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  useEffect(() => {
    load();
  }, []);

  //if(!_.isEmpty(getAllVacancies)) setVacanciesFiltered(getAllVacancies);

  console.log(vacanciesFiltered)

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0"><h2 className="mb-0"> Вакансии </h2></Col>
            <Col lg="3">
              <Input  onChange={ event => console.log(_.filter(setVacanciesFiltered, field => field.name === event.target.value )) }/>
            </Col>
            <Col lg="2">
              <Select
                    placeholder={"Статус"}
                    closeMenuOnSelect={true}
                    options={ [{value: 'active', label: 'Активные'}, {value: 'stopped', label: 'Неактивные'}] } 
                    onChange={ (value) => { console.log(_.filter(setVacanciesFiltered, field => field.status === value.value )); } }
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
                    <div className="d-flex justify-content-center">
                      <div className="name">
                        {`${value.name}`}, {`${value.region.name}`}
                      </div>
                      <div>
                          <Link to={`/vacancy/edit/${value.id}`} >
                            <Button color="primary">Редактировать</Button>
                          </Link>
                      </div>
                    </div>
                    <div className="vacancy-field">
                      <b>Профиль:</b> {`${value.profile.name}`}
                    </div>
                    <div className="vacancy-field">
                      <b>Регион:</b> {`${value.region.name}`}
                    </div>
                    <div className="vacancy-field">
                      <b>Статус:</b> {`${value.status}`}
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
