import React, { useEffect, useState, PureComponent } from 'react';
import HOST_URL from '../../constants';
import * as moment from 'moment';
import _ from 'lodash';

import {
  Col,
  Row,
} from 'reactstrap';
import { AreaChart, Area,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const formData = (array) => {
  const result = _.reduce(array, function(result, { fields, partnerName }) {
    fields.forEach((field) => {
      result[field.key] = result[field.key] || { key: moment(field.key).format("DD.MM.YYYY") };
      result[field.key][partnerName] = field.candidateCount;
    });
    return result;
  }, {});
  return _.orderBy(result, [(o) => moment(o.key, 'DDMMYYYY').format("YYYYMMDD")] );
};


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

  const [dataCharts, setDataCharts] = useState({ monthly: null });

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
      //console.log(window.p = result.monthly)
      setDataCharts({ monthly: formData(result.monthly), weekly: formData(result.weekly)});
    });
  };

  useEffect( () => {
    loadCharts();
  }, []);




  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-5 mb-5">
          <h4 className="mb-4 text-center">Динамика по пройденным Интервью</h4>
          <div style={{ width: '100%', height: '300px'}}>
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
        </Col>
        <Col lg="12" className="mb-sm- mb-5">
          <h4 className="mb-4 text-center">Динамика по пройденным Интервью</h4>
          <div style={{ width: '100%', height: '300px'}}>
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
