import React, {useEffect} from 'react';
import {Col, Row, Button} from "reactstrap";

import {useLoadRegion} from "./useRegionsApi";
import _ from "lodash";


const Component = (props) => {
  const vacancyId = props.match.params.id;
  const [region, set, loadApi] = useLoadRegion();


  useEffect(() => {
    loadApi(vacancyId);
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
                <td>{ region.name }</td>
              </tr>
              <tr>
                <th> Дательный падеж (где): </th>
                <td>{ region.nameDative }</td>
              </tr>
              <tr>
                <th> Utm </th>
                <td>{ region.utm }</td>
              </tr>
              <tr>
                <th> Регионы для Яндекс.Директа: </th>
                <td> { _.map(region.yandexRegions, ({name, id}) => { return name+', '; }) } </td>
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
