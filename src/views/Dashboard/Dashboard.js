import React, { useEffect, useState } from 'react';
import HOST_URL from '../../constants';
import * as moment from 'moment';
import _ from 'lodash';
import {
  Col,
  Row,
} from 'reactstrap';
import { AreaChart, Area,Brush,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import useUploadState from "../../api/useUploadState";

const formData = (data, fieldSelect) => {
  const result = _.reduce(data, function(points, { fields, partnerName }) {
    fields.forEach(({ key, candidateCount, interviewCount }) => {
      const date = moment(key).format('DD.MM.YYYY');
      const point = _.find(points, { key: date });
      if (point) {
        point[partnerName] = (fieldSelect === true) ? candidateCount : interviewCount;
        return;
      }

      points.push({
        key: date,
        [partnerName]: fieldSelect === true ? candidateCount : interviewCount,
      });
    });
    return points;
  }, []);
  return _.orderBy(result, [(o) => moment(o.key, 'DDMMYYYY').format("YYYYMMDD")] );
};

// const formData2 = (array) => {
//   const result = _.reduce(array, function(result, { fields, partnerName }) {
//     fields.forEach((field) => {
//       result[field.key] = result[field.key] || { key: moment(field.key).format("DD.MM.YYYY") };
//       result[field.key][partnerName] = field.candidateCount;
//     });
//     return result;
//   }, {});
//   return _.orderBy(result, [(o) => moment(o.key, 'DDMMYYYY').format("YYYYMMDD")] );
// };

function CustomizedAxisTick(props) {
  const {
    x, y, payload,
  } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
    </g>
  );
}

function Dashboard() {
  const [loadApi, uploadState] = useUploadState();
  const [dataCharts, setDataCharts] = useState({ monthly: null, monthlyInterview: null, weekly: null, weeklyInterview: null, });
  const loadCharts = () => {
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
      setDataCharts({ monthly: formData(result.monthly), monthlyInterview: formData(result.monthly, true), weekly: formData(result.weekly), weeklyInterview: formData(result.weekly, true),});
    });
  };



  useEffect( () => {
    loadApi();

    loadCharts();

  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-5 font-weight-light text-uppercase"> Обновлено: {uploadState} </h4>
          <h4 className="mb-4 text-center">Динамика по пройденным Интервью</h4>
          <div style={{ width: '100%', height: '300px'}} className="mb-5">
            <ResponsiveContainer>
              <BarChart
                data={dataCharts.monthly}
                margin={{
                  top: 5, right: 0, left: 0, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Easyelead" fill="#446bc7" />
                <Bar dataKey="Honeyleads" fill="#fb7207" />
                <Bar dataKey="Лидген-ПрофитСейл" fill="#a5a5a5" />
                <Bar dataKey="Яндекс" fill="#ffc100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h4 className="mb-4 text-center">Динамика по количеству Кандидатов</h4>
          <div style={{ width: '100%', height: '300px'}} className="mb-5">
            <ResponsiveContainer>
              <BarChart
                data={dataCharts.monthlyInterview}
                margin={{
                  top: 5, right: 0, left: 0, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Easyelead" fill="#446bc7" />
                <Bar dataKey="Honeyleads" fill="#fb7207" />
                <Bar dataKey="Лидген-ПрофитСейл" fill="#a5a5a5" />
                <Bar dataKey="Яндекс" fill="#ffc100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col lg="12" className="mb-sm- mb-5">
          <h4 className="mb-4 text-center">Динамика по пройденным Интервью</h4>
          <div style={{ width: '100%', height: '300px'}} className="mb-5">
          <ResponsiveContainer>
              <AreaChart
                data={dataCharts.weekly}
                margin={{
                  top: 10, right: 30, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" interval={0} domain={['auto', 'auto']}  height={70} tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                <Brush dataKey='key' height={30} stroke="#8884d8"/>
                <Area type="monotone" dataKey="Easyelead" stackId="1" stroke="#446bc7" fill="#446bc7" />
                <Area type="monotone" dataKey="Honeyleads" stackId="1" stroke="#fb7207" fill="#fb7207" />
                <Area type="monotone" dataKey="Лидген-ПрофитСейл" stackId="1" stroke="#a5a5a5" fill="#a5a5a5" />
                <Area type="monotone" dataKey="Яндекс" stackId="1" stroke="#ffc100" fill="#ffc100" />
              </AreaChart>
          </ResponsiveContainer>
          </div>
            <h4 className="mb-4 text-center">Динамика по количеству Кандидатов </h4>
            <div style={{ width: '100%', height: '300px'}} className="mb-5">
            <ResponsiveContainer>
                <AreaChart
                  data={dataCharts.weeklyInterview}
                  margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" interval={0} domain={['auto', 'auto']}  height={70} tick={<CustomizedAxisTick />} />
                  <YAxis />
                  <Tooltip />
                  <Brush dataKey='key' height={30} stroke="#8884d8"/>
                  <Area type="monotone" dataKey="Easyelead" stackId="1" stroke="#446bc7" fill="#446bc7" />
                  <Area type="monotone" dataKey="Honeyleads" stackId="1" stroke="#fb7207" fill="#fb7207" />
                  <Area type="monotone" dataKey="Лидген-ПрофитСейл" stackId="1" stroke="#a5a5a5" fill="#a5a5a5" />
                  <Area type="monotone" dataKey="Яндекс" stackId="1" stroke="#ffc100" fill="#ffc100" />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
