import React, {useEffect, useState} from 'react';
import HOST_URL from "../../constants";
import {Col, Row, Input, Button, Table, CardBody} from "reactstrap";
import axios from "axios";
import _ from 'lodash';


const Reports = () => {

  const [searchField, setSearchField] = useState(null);
  const [yandexApiResult, setYandexApiResult] = useState({});
  const [regions, setRegions] = useState({
    "name": "string",
    "nameDative": "string",
    "utm": "string",
    "yandexRegions": []
  });

  const saveToBd = _.cloneDeep(regions);

  const saveToBDAPI = () => {

    saveToBd.yandexRegions = _.clone(yandexApiResult.items);

    let token = localStorage.getItem('access_token');

    fetch(HOST_URL +'/api/regions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(saveToBd),
    }).then((result) => {
      if(result.status === 500) alert('error');
      if (result.status === 200) {
        alert('Ok');
        window.location.reload();
      }
    })
  };

  const search = (field = "") => {
    let token = localStorage.getItem('access_token');
    axios({
      method: "get",
      url: HOST_URL +'/api/yandex-direct/regions',
      headers: {
          'Accept': '*/*',
          'Authorization': 'Bearer ' + token
        },
      params: {
        search: field,
      }
    }).then(res => setYandexApiResult(res.data));
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-0">
          <h4> Поиск регионов </h4>
        </Col>
        <Col lg="6" className="mb-sm-5 mb-5">
          <Input onChange={ (event) => { setSearchField(event.target.value) } } />
        </Col>
        <Col lg="2" className="mb-sm-5 mb-5">
          <Button onClick={ () => search(searchField) } block color="primary">Найти</Button>
        </Col>
        <Col lg="6" className="mb-sm-5 mb-5">
          <CardBody className="p-0">
            <Table responsive striped hover>
              <tbody>
              <tr>
                <td> Город </td>
                <td> Тип </td>
              </tr>
              {
                _.map(yandexApiResult.items, (value, key) => {
                  return (
                    <tr key={key}>
                      <td>{`${value.name}`}</td>
                      <td>{`${value.type}`}</td>
                    </tr>
                  )
                })
              }
              </tbody>
            </Table>
          </CardBody>
        </Col>
        <Col lg="12" className="mb-0"></Col>
        <Col lg="6" className="mb-2">
          <h5> Name </h5>
          <Input onChange={ (event) => { saveToBd.name = event.target.value } } />
        </Col>
        <Col lg="6" className="mb-2">
          <h5> nameDative </h5>
          <Input onChange={ (event) => { saveToBd.nameDative = event.target.value } } />
        </Col>
        <Col lg="6" className="mb-2">
          <h5> utm </h5>
          <Input onChange={ (event) => { saveToBd.utm = event.target.value } } />
        </Col>
        <Col lg="12" className="mb-0"></Col>
        <Col lg="2" className="mb-2">
          <h5> Отправить </h5>
          <Button onClick={ () => saveToBDAPI() } block color="primary">Сохранить</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
