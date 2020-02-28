import React, {useEffect, useState} from 'react';
import HOST_URL from "../../constants";
import {Col, Row} from "reactstrap";
import {downloadFile} from "../../utils/downloadFile";
import useUploadState from "../../api/useUploadState";
import axios from 'axios';

const Reports = () => {
  const [loadApi, uploadState] = useUploadState();

  const executeRequest = () => {
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

  const executeHoneySource = () => {
    let token = localStorage.getItem('access_token');
    fetch(HOST_URL +'/api/skillaz-candidates/utm-xls-report', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if(result.status === 500) return result.status;
      if (result.status === 200) {
        let filename = result.headers.get('content-disposition');
        result.blob().then(function (text) {
          downloadFile(text, filename.match(/filename=(.*[\s\S]*);/)[1]);
        });
      }
    });
  };



  useEffect( () => {
    loadApi();
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-5 font-weight-light text-uppercase"> Обновлено: {uploadState} </h4>
          <h4 className="mb-4 text-uppercase">Подробный отчет по всем партнерам</h4>
          <button className="btn-download" onClick={executeRequest}> Скачать </button>
          <div className="mb-sm-5 mb-5"> </div>
          <h4 className="mb-4 text-uppercase">Источники Honeyleads</h4>
          <button className="btn-download" onClick={executeHoneySource}> Скачать </button>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
