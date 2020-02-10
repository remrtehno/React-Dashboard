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
        <Col lg="6" className="mb-3">
          <h5> Название </h5>
          <Input onChange={ (event) => { saveToBd.name = event.target.value } } />
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Дательный падеж (где) </h5>
          <Input onChange={ (event) => { saveToBd.nameDative = event.target.value } } />
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Utm </h5>
          <Input onChange={ (event) => { saveToBd.utm = event.target.value } } />
        </Col>
        <Col lg="12" className="mb-0">
          <h5> Регионы для Яндекс.Директа </h5>
        </Col>
        <Col lg="6" className="mb-4">
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={searchField}
            onInputChange={ (value) => { getAllRegions(value) } }
            onChange={ (value) => { setSelectRegion(value) } } />
        </Col>
        <Col lg="12" className="mb-3">
          <Button onClick={ () => saveToBDAPI() }  color="primary">Сохранить</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
