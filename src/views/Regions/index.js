import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Table, CardBody} from "reactstrap";
import _ from 'lodash';
import {Link} from "react-router-dom";
import {get} from '../../api';


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

  // const saveToBDAPI = () => {
  //   saveToBd.yandexRegions = _.cloneDeep(fill);
  //   let token = localStorage.getItem('access_token');
  //   fetch(HOST_URL +'/api/regions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token
  //     },
  //     body: JSON.stringify(saveToBd),
  //   }).then((result) => {
  //     if(result.status === 500) alert('error');
  //     if (result.status === 200) {
  //       alert('Ok');
  //       window.location.reload();
  //     }
  //   })
  // };

  // const getAllRegions = (query = "") => {
  //   if(query === " " || !query) return;
  //
  //   const token = localStorage.getItem('access_token');
  //   let url = new URL(HOST_URL +`/api/yandex-direct/regions`);
  //   let params = {search: query};
  //   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  //
  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'text/plain',
  //       'Authorization': 'Bearer ' + token
  //     },
  //   }).then((result) => {
  //     if (result.status === 200) {
  //       return result.clone().json()
  //     }
  //   }).then((result) => {
  //     setAllRegion(result.items);
  //     setSearchField(
  //       _.map(result.items, (value) => { return {value: value.name, label: value.name}; })
  //     );
  //   });
  // };

  // const getRegions = () => {
  //   const token = localStorage.getItem('access_token');
  //   fetch(HOST_URL +`/api/regions`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'text/plain',
  //       'Authorization': 'Bearer ' + token
  //     },
  //   }).then((result) => {
  //     if (result.status === 200) {
  //       return result.clone().json()
  //     }
  //   }).then((result) => {
  //     setLoadRegions(result);
  //   });
  // };

  // function deleteRegion(id) {
  //   const token = localStorage.getItem('access_token');
  //   fetch(HOST_URL +`/api/regions/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Accept': '*/*',
  //       'Authorization': 'Bearer ' + token
  //     },
  //   }).then((result) => {
  //     if (result.status === 200) {
  //       getRegions();
  //       alert('Ok');
  //       console.log(result)
  //     }
  //   });
  // }

  useEffect(() => {
    get('/api/regions')
      .then(res => {
        setLoadRegions(res);
      })
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h2 className="mb-4"> Список регионов </h2>
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
                      <td>{`${value.name}`}</td>
                      <td  width="240">
                        { value.yandexRegions.map((region, index) => {
                            return index < value.yandexRegions.length - 1 ?
                              region.name + ', ' :
                              region.name
                          })
                        }
                      </td>
                      <td className="text-right">
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
