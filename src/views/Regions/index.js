import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Table, CardBody} from "reactstrap";
import _ from 'lodash';
import {Link} from "react-router-dom";
import {get} from '../../api';


const Reports = () => {
  const [loadRegions, setLoadRegions] = useState({items: []});

  useEffect(() => {
    get('/api/regions')
      .then(res => {
        setLoadRegions(res);
      })
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg='12' className='d-flex align-items-start'>
          <h2 className="mb-4"> Список регионов </h2>
          <Link to='/regions/create'>
            <Button
              className='ml-5'
            >
              Добавить
            </Button>
          </Link>
        </Col>
        <Col lg="12">
          <CardBody className="p-0">
            <Table responsive hover>
              <thead className='thead-dark'>
              <tr>
                <th> Город </th>
                <th> Регион </th>
                <th className="text-right"/>
              </tr>
              </thead>
              <tbody>
              {
                _.map(loadRegions.items, (value, key) => {
                  return (
                    <tr key={key}>
                      <td>{value.name}</td>
                      <td  width="240">
                        { value.yandexRegions.map((region, index) => {
                            return index < value.yandexRegions.length - 1 ?
                              region.name + ', ' :
                              region.name
                          })
                        }
                      </td>
                      <td className="text-right">
                        <Link to={`/regions/edit/${value.id}`}>
                          <Button color="primary" className='mr-2'>Редактировать</Button>
                        </Link>
                        <Link to={`/region/${value.id}`}>
                          <Button color="primary">Подробнее</Button>
                        </Link>
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

export default Reports;
