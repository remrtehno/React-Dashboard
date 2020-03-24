import React, {useState} from 'react';
import {Col, Row, Input, Button} from "reactstrap";
import Select from 'react-select'
import {useHistory} from 'react-router-dom'

import {get, post} from "../../api";

const getRegionsBySearch = (query = "", setYandexRegions) => {
  if(query === " " || !query) return;
  let params = {search: query};
  get('/api/yandex-direct/regions', params)
    .then(result => {
      setYandexRegions(result.items);
    });
};

const uploadRegion = (region, history) => {
  let computedRegion = {...region}
  computedRegion.yandexRegions = region.yandexRegions.map(region => ({id: region.id, name: region.name}))

  post('/api/regions', computedRegion)
    .then((result) => {
      if (result.status === 500) alert('error');
      if (result.status === 200) {
        alert('Ok');
        history.push('/regions')
      }
    })
};

const Reports = () => {
  const history = useHistory()
  const [yandexRegions, setYandexRegions] = useState([])
  const [region, setRegion] = useState({})

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-4">
          <h2> Сохранить в базу </h2>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Название </h5>
          <Input onChange={e => setRegion({...region, name: e.target.value})} />
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Дательный падеж (где) </h5>
          <Input onChange={e => setRegion({...region, nameDative: e.target.value})} />
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Utm </h5>
          <Input onChange={e => setRegion({...region, utm: e.target.value})} />
        </Col>
        <Col lg="12" className="mb-0">
          <h5> Регионы для Яндекс.Директа </h5>
        </Col>
        <Col lg="6" className="mb-4">
          <Select
            isMulti
            closeMenuOnSelect={false}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            options={yandexRegions}
            placeholder='Введите название региона'
            onInputChange={value => getRegionsBySearch(value, setYandexRegions)}
            onChange={value => setRegion({...region, yandexRegions: value})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          <Button onClick={() => uploadRegion(region, history)}  color="primary">Сохранить</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
