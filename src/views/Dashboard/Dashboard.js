import React, { useEffect, useState } from 'react';
import HOST_URL from '../../constants';

import {
  Col,
  Row,
} from 'reactstrap';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


const formData = (array) => {
  let dates = array.map((v,i)=>{
    return v.fields.map(v=>v.key);
  });

  let data = [];
  dates[0].forEach( vDates => {
    array.forEach( (v) => {
      let r = v.fields.find( vc => {
        if(vc.key === vDates) return vc;
      });
      r.name = v.partnerName;
      data.push(r);
    });
  });


  let result = [];
  data.forEach(function (a, i) {
    if (!this[a.key]) {
      this[a.key] = { key: a.key.replace(/\T.*/,''), };
      result.push(this[a.key]);
    }
    //console.log(a.name, a.candidateCount ,'key:' + i);
    let name = a.name.toString();
    this[a.key][name] = a.candidateCount;
  }, Object.create(null));

  return result;

};


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
      setDataCharts({ monthly: formData(result.monthly)});
    });
  };

  useEffect( () => {
    loadCharts();
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-sm-2 mb-0">
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
      </Row>
    </div>
  );
}

export default Dashboard;
