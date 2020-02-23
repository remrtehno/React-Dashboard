import React, {useEffect, useState} from 'react';
import HOST_URL from "../../constants";
import {Col, Row, Input, Button, Table} from "reactstrap";
import Select from 'react-select';
import _ from 'lodash';

import {usePutRegion} from './useRegionsApi';

const RegionEdit = (props) => {
  const regionId = props.match.params.id;
  const [region, setRegion] = useState({});
  const [allRegion, setAllRegion] = useState([]);
  const [apiLoad] = usePutRegion();

  const loadRegion = () => {
    const token = localStorage.getItem('access_token');
    fetch(HOST_URL +`/api/regions/${regionId}`, {
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
      setRegion(result);
    });
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
      setAllRegion(
        _.map(result.items, (value) => {
          return {value: value.name, label: value.name, id: value.id, };
        })
      );
    });

  };

  useEffect(() => {
    loadRegion(regionId);
    getAllRegions();
  }, []);


  const edit = (value, key, key2 = null) => {
    setRegion((oldArray) => {
        if(key2) {
          let obj = _.cloneDeep(oldArray);
          obj[key][key2] = value;
          return obj;
        }
        let obj =_.cloneDeep(oldArray);
        obj[key] = value;
        return obj;
    });
  };

  const editSelect = (regionFilter) => {
    const yandexRegions = _.map(regionFilter, ({value, id}) => {
     return {name: value, id: id};
    });
    setRegion({...region, 'yandexRegions': yandexRegions });
  };


  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-0">
          <h2 className="mb-3"> Редактировать регион</h2>
          <Table responsive striped hover className="mb-3">
            <tbody>
              <tr>
                <td>Название:</td>
                <td><Input onChange={(event) => { edit(event.target.value, 'name', null) } } value={region.name}  /></td>
              </tr>
              <tr>
                <td>Дательный падеж (где):</td>
                <td> <Input onChange={(event) => { edit(event.target.value, 'nameDative', null) } } value={region.nameDative} /> </td>
              </tr>
              <tr>
                <td>Utm:</td>
                <td><Input onChange={(event) => { edit(event.target.value, 'utm', null) } } value={region.utm}  /></td>
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
            onInputChange={ (value) => { getAllRegions(value) } }
            onChange={ (value) => { editSelect(value) }}
          />
          <Button onClick={()=> apiLoad(regionId, region) }  color="primary">Сохранить</Button>
        </Col>

      </Row>
    </div>
  );
};

export default RegionEdit;
