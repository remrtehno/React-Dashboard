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
         downloadFile(text, 'report.xls');
        });
      }
    });
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-4 text-center">Города с самым большим числом Интервью за прериод</h4>
          <a href="#" onClick={executeRequest}> Скачать </a>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
