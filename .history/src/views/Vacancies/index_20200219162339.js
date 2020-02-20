import React, {useEffect} from 'react';
import {Col, Row, Button, Table, CardBody, Input} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';

import {useVacanciesApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";

const Component = () => {
  const [getAllVacancies, load] = useVacanciesApi();

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0"><h2 className="mb-0"> Вакансии </h2></Col>
            <Col lg="3"><Input /></Col>
            <Col lg="2">
              <Select
                    placeholder={"Статус"}
                    closeMenuOnSelect={true}
                    options={ [{value: 'Rub', label: 'Rub'}, {value: '$', label: '$'}] } />
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
                    <div className="name">
                      {`${value.name}`}, {`${value.region.name}`}
                    </div>
                    <div className="vacancy-field">
                      Профиль: {`${value.profile.name}`}
                    </div>
                    <div className="vacancy-field">
                      Регион: {`${value.region.name}`}
                    </div>
                    <div className="vacancy-field">
                      Статус: {`${value.status}`}
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
