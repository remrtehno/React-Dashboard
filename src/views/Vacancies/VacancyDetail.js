import React, {useEffect} from 'react';
import {Col, Row, Button} from "reactstrap";
import _ from 'lodash';

import {useVacancyApi} from "./useVacanciesApi";


const Component = (props) => {
  const vacancyId = props.match.params.id;
  const [vacancy, set, load] = useVacancyApi();


  useEffect(() => {
    load(vacancyId);
  }, []);

  console.log(vacancy);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">  <h2> Общая инфрмация </h2> </Col>
        <Col lg="12" className="mb-3">
          <div className="table-responsive">
            <table className="table tr-text-right">
              <tbody>
              <tr>
                <th>Название:</th>
                <td>{ vacancy.map( field => field.name ) }</td>
              </tr>
              <tr>
                <th>Регион:</th>
                <td>{ vacancy.map( field => field.region.name  ) }</td>
              </tr>
              <tr>
                <th>Профиль:</th>
                <td>{ vacancy.map( field => field.profile.name ) }</td>
              </tr>
              <tr>
                <th>Зарплата От/До:</th>
                <td>{vacancy.map( field => field.salary.from )} - {vacancy.map( field => field.salary.to )} { vacancy.map( field => field.salary.currency) }</td>
              </tr>
              <tr>
                <th>Места:</th>
                <td>{ vacancy.map( field => field.openPositions ) }</td>
              </tr>
              <tr>
                <th>Внешние ID:</th>
                <td>{ vacancy.map( field => {
                  return field.externalIds.map( ({id, system}) => {
                    return system
                  })
                }) }</td>
              </tr>
              <tr>
                <th>Статус:</th>
                <td>{ vacancy.map( field => field.status) }</td>
              </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={ () => props.history.goBack() }>Назад</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
