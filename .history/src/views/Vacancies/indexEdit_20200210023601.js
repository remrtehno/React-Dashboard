import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Table, CardBody} from "reactstrap";
import _ from 'lodash';

import {useVacanciesApi, deleteVacancyApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";

const Component = (props) => {
  const [getAllVacancies, load] = useVacanciesApi();
  const [deleteVacancy] = deleteVacancyApi();

  useEffect(() => {
    load();
  }, []);

  console.log(getAllVacancies);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <h2 className="mb-3"> Редактировать вакансии </h2>
          <CardBody className="p-0">
            <Table responsive striped hover>
              <tbody>
              <tr>
                <td> Название </td>
                <td> Регион </td>
                <td width="150"> Профиль </td>
                <td> Зарплата </td>
                <td> Места </td>
                <td> Внешние ID </td>
                <td> Статус </td>
                <td> Действия </td>
              </tr>
              {
                _.map(getAllVacancies, (value, key) => {
                  return (
                    <tr key={key}>
                      <td>{`${value.name}`}</td>
                      <td width="150">{`${value.region.name}`}</td>
                      <td>{`${value.profile.name}`}</td>
                      <td>
                        От: {`${value.salary.from}`}{`${value.salary.currency}`} <br/>
                        До: {`${value.salary.to}`}{`${value.salary.currency}`}
                      </td>
                      <td>{`${value.openPositions}`}</td>
                      <td> {
                        value.externalIds.map(system => <div>{system.system}</div>)
                      } </td>
                      <td>{`${value.status}`}</td>
                      <td>
                        <Link to={`/vacancy/edit/${value.id}`} >
                          <Button block color="primary">Редактировать</Button>
                        </Link>
                        <Button block className="mt-3" onClick={ () => deleteVacancy(value.id) } color="primary">Удалить</Button>
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </Table>
          </CardBody>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
