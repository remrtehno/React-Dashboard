import React, {useEffect, useState} from 'react';
import {Col, Row, Input, Button, Table} from "reactstrap";
import Select from 'react-select';
import _ from 'lodash';
import {useHistory} from 'react-router-dom';

import {get, del} from '../../api'
import {usePutRegion} from './useRegionsApi';

const edit = (value, field, setRegion) => {
  setRegion(region => {
    let newRegion =_.cloneDeep(region);
    newRegion[field] = value;
    return newRegion;
  });
};

const editSelect = (regionFilter, setRegion) => {
  const yandexRegions = _.map(regionFilter, ({value, id}) => {
    return {name: value, id: id};
  });
  setRegion(region => ({...region, 'yandexRegions': yandexRegions }))
};

const getAllRegions = (query = "", setAllRegion) => {
  if(query === " " || !query) return;

  let params = {search: query};
  get('/api/yandex-direct/regions', params)
    .then((result) => {
      setAllRegion(
        _.map(result.items, (value) => {
          return {value: value.name, label: value.name, id: value.id, };
        })
      );
    });
};

const deleteRegion = (regionId, history) => {
  del(`/api/regions/${regionId}`)
    .then(res => {
      if (res) history.push('/regions')
    })
}

const RegionEdit = (props) => {
  let history = useHistory();
  const regionId = props.match.params.id;
  const [region, setRegion] = useState({});
  const [allRegion, setAllRegion] = useState([]);
  const [apiLoad] = usePutRegion();

  useEffect(() => {
    get(`/api/regions/${regionId}`)
      .then(res => setRegion(res));
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-0">
          <h2 className="mb-3"> Редактировать регион</h2>
          <Table responsive hover className="mb-3">
            <tbody>
              <tr>
                <td>Название:</td>
                <td>
                  <Input
                    onChange={event => edit(event.target.value, 'name', setRegion)}
                    defaultValue={region.name}
                  />
                </td>
              </tr>
              <tr>
                <td>Дательный падеж (где):</td>
                <td>
                  <Input
                    onChange={event => edit(event.target.value, 'nameDative', setRegion)}
                    defaultValue={region.nameDative}
                  />
                </td>
              </tr>
              <tr>
                <td>Utm:</td>
                <td>
                  <Input
                    onChange={event => edit(event.target.value, 'utm', setRegion)}
                    defaultValue={region.utm}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col lg="6" className="mb-4">
          <h5 className="mb-3"> Регионы для Яндекс.Директа: </h5>
          <Select
            className="mb-3"
            value={
              _.map(region.yandexRegions, ({name, id}) => { return  {value: name, label: name, id: id, }; })
            }
            isMulti
            closeMenuOnSelect={false}
            options={allRegion}
            onInputChange={value => getAllRegions(value, setAllRegion)}
            onChange={value => editSelect(value, setRegion)}
          />
          <div className='d-flex align-items-center'>
            <Button
              className='mr-2'
              onClick={() => {
                apiLoad(regionId, region)
                  .then(() => history.push('/regions'))
              }}
              color="primary"
            >
              Сохранить
            </Button>
            <Button
              onClick={() => deleteRegion(regionId, history)}
              color='danger'
            >
              Удалить
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegionEdit;
