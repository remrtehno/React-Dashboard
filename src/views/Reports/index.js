import React, {useEffect, useState} from 'react';
import HOST_URL from "../../constants";
import {Col, Row} from "reactstrap";
import {downloadFile} from "../../utils/downloadFile";

const Reports = () => {

  const executeRequest = (e) => {
    e.preventDefault();

    let token = localStorage.getItem('access_token');
    fetch(HOST_URL +'/api/skillaz-candidates/xls-report', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if(result.status === 500) return result.status;
      if (result.status === 200) {
       result.blob().then(function (text) {
         downloadFile(text, 'report.xlsx');
        });
      }
    });
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-5 font-weight-light text-uppercase"> Обновлено: 29.01.2020 19:47 </h4>
          <h4 className="mb-4 text-uppercase">Подробный отчет по всем партнерам</h4>
          <a href="#" className="btn-download" onClick={executeRequest}> Скачать </a>
          <div className="mb-sm-5 mb-5"> </div>
          <h4 className="mb-4 text-uppercase">Источники Honeyleads</h4>
          <a href="#" className="btn-download" onClick={executeRequest}> Скачать </a>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
