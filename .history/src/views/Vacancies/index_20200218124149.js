import React, {useEffect} from 'react';
import {Col, Row, Button, Table, CardBody} from "reactstrap";
import _ from 'lodash';

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
          <h2 className="mb-3"> Список вакансии </h2>
          {/* <CardBody className="p-0"> */}
            {/* <Table responsive striped hover>
              <tbody>
              <tr>
                <td> Название </td>
                <td> Регион </td>
                <td width="150"> Профиль </td>
                <td> Статус </td>
                <td> Действия </td>
              </tr> */}
              {
                _.map(getAllVacancies, (value, key) => {
                  return (

                    <tr key={key}>
                      <td>Название: {`${value.name}`}</td>
                      <td width="150">{`${value.region.name}`}</td>
                      <td>{`${value.profile.name}`}</td>
                      <td>{`${value.status}`}</td>
                      <td>
                          <Link to={`vacancy/${value.id}`} >
                            <Button block color="primary">Подробнее</Button>
                          </Link>
                      </td>
                    </tr>
                  )
                })
              }
              {/* </tbody>
            </Table>
          </CardBody> */}
        </Col>
      </Row>
    </div>
  );
};

export default Component;
