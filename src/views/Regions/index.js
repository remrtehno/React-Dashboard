import React, {useEffect, useState} from 'react';
import HOST_URL from "../../constants";
import {Col, Row, Input, Button, Table, CardBody} from "reactstrap";
import _ from 'lodash';
import {Link} from "react-router-dom";
import Select from 'react-select'


const Reports = () => {

  const [searchField, setSearchField] = useState([]);
  const [loadRegions, setLoadRegions] = useState([]);
  const [allRegion, setAllRegion] = useState({});
  const [selectRegion, setSelectRegion] = useState({});
  const [regions, setRegions] = useState({
    "name": "string",
    "nameDative": "string",
    "utm": "string",
    "yandexRegions": []
  });

  const saveToBd = _.cloneDeep(regions);


  const [fill, setfill] = useState([]);

  _.forEach(allRegion, ({name, id}) => {
    if(_.find(selectRegion, {'value' : name })) {
      if(!_.find(fill, {'name' : name })) {
        setfill( oldArray => [...oldArray, {name: name, id: id}] );
      }
    }
  });

  const saveToBDAPI = () => {
    saveToBd.yandexRegions = _.cloneDeep(fill);
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

  const getAllRegions = (query = "") => {
    if(query === " " || !query) return;

    const token = localStorage.getItem('access_token');
    let url = new URL(HOST_URL +`/api/yandex-direct/regions`);
    let params = {search: query};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        return result.clone().json()
      }
    }).then((result) => {
      setAllRegion(result.items);
      setSearchField(
        _.map(result.items, (value) => { return {value: value.name, label: value.name}; })
      );
    });
  };

  function getRegions() {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/regions`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        return result.clone().json()
      }
    }).then((result) => {
      setLoadRegions(result);
    });
  }

  function deleteRegion(id) {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/regions/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        getRegions();
        alert('Ok');
        console.log(result)
      }
    });
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-4">
          <h2> Сохранить в базу </h2>
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
        <Col lg="12" className="mb-0">
          <h4> Поиск регионов </h4>
        </Col>
        <Col lg="6" className="mb-sm-5 mb-5">
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={searchField}
            onInputChange={ (value) => { getAllRegions(value) } }
            onChange={ (value) => { setSelectRegion(value) } } />
        </Col>
        <Col lg="12" className="mb-2"></Col>
        <Col lg="2" className="mb-5">
          <Button onClick={ () => saveToBDAPI() } block color="primary">Сохранить</Button>
        </Col>
        <Col lg="12" className="mb-0">
          <h2> Загрузить из базы </h2>
        </Col>
        <Col lg="2" className="mb-4">
          <Button onClick={ () => getRegions() } block color="primary">Загрузить</Button>
        </Col>
        <Col lg="12" className="mb-sm-5 mb-5">
          <CardBody className="p-0">
            <Table responsive striped hover>
              <tbody>
              <tr>
                <td> Город </td>
                <td> Тип </td>
                <td> Utm </td>
                <td> Регион </td>
                <td> Действие </td>
              </tr>
              {
                _.map(loadRegions.items, (value, key) => {
                  return (
                    <tr key={key}>
                      <td>{`${value.name}`}</td>
                      <td>{`${value.nameDative}`}</td>
                      <td>{`${value.utm}`}</td>
                      <td  width="330">
                        { value.yandexRegions.map( regions => {
                          return regions.name + ', ';
                        }) }
                      </td>
                      <td>
                        <div className="row align-items-center">
                          <Link to={`regions/edit/${value.id}`} className="col-6">
                            <Button block color="primary">Редактировать</Button>
                          </Link>
                          <Button className="col-6" onClick={ () => deleteRegion(value.id) } block color="primary">Удалить</Button>
                        </div>
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
