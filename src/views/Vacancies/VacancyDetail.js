import React, {useEffect} from 'react';
import {Col, Row, Button} from "reactstrap";

import {useVacancyApi} from "./useVacanciesApi";


const Component = (props) => {
  const vacancyId = props.match.params.id;
  const [vacancy, set, load] = useVacancyApi();


  useEffect(() => {
    load(vacancyId);
  }, []);

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
                <td>{ vacancy.name }</td>
              </tr>
              <tr>
                <th>Регион:</th>
                <td>{ vacancy.region.name }</td>
              </tr>
              <tr>
                <th>Профиль:</th>
                <td>{ vacancy.profile.name }</td>
              </tr>
              <tr>
                <th>Зарплата От - До:</th>
                <td>{ vacancy.salary.from } - { vacancy.salary.to } { vacancy.salary.currency }</td>
              </tr>
              <tr>
                <th>Места:</th>
                <td>{ vacancy.openPositions }</td>
              </tr>
              <tr>
                <th>Внешние ID:</th>
                <td>{ vacancy.externalIds.map(({id, system}) => system)}</td>
              </tr>
              <tr>
                <th>Статус:</th>
                <td>{ vacancy.status }</td>
              </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={() => props.history.goBack() }>Назад</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
