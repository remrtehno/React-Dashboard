import React, {useEffect, useState} from 'react';
import { MDBDataTable } from 'mdbreact';
import HOST_URL from "../../constants";
import {Col, Row} from "reactstrap";
import _ from 'lodash';


const formCity = (array) => {
  return _.reduce(array, (partners, {items, city, totalCount}) => {
    items.forEach(({partnerName, count}) => {
      const field = _.find(partners, {city: city});
      if (field) {
        field[partnerName] = count;
        field['totalCount'] = totalCount;
        return;
      }

      let objField = {
        city: city,
        totalCount: totalCount,
      };
      objField[partnerName] = count;
      partners.push(objField);
    });
    return partners;
  }, []);
};

const DatatablePage = () => {
  const [dataTable, setDataTable] = useState({ topCity: null });

  const loadTables = () => {
    let token = localStorage.getItem('access_token');
    fetch(HOST_URL +'/api/skillaz-candidates/report', {
      method: 'GET',
      headers: {
        'Accept': 'text/json',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if(result.status === 500) return result.status;
      if (result.status === 200) {
        return result.clone().json();
      }
    }).then((result) => {
      console.log(window.p = result.topCity);
      //console.log(formCity(result.topCity));
      setDataTable({ topCity: formCity(result.topCity),});
    });
  };

  useEffect( () => {
    loadTables();
  }, []);

  const data = {
    columns: [
      {
        label: 'Города',
        field: 'city',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Easyelead',
        field: 'Easyelead',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Honeyleads',
        field: 'Honeyleads',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Лидген-ПрофитСейл',
        field: 'Лидген-ПрофитСейл',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Яндекс',
        field: 'Яндекс',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Всего за период',
        field: 'totalCount',
        sort: 'asc',
        width: 100
      }
    ],
    rows: dataTable.topCity,
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-4 text-center">Города с самым большим числом Интервью за прериод</h4>
          <MDBDataTable
            striped
            bordered
            hover
            data={data}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DatatablePage;
