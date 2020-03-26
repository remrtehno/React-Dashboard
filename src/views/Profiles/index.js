import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input} from "reactstrap";
import _ from 'lodash';
import Fuse from 'fuse.js';
import useProfilesApi from "./useProfilesApi";
import {Link} from "react-router-dom";


const Component = () => {
  const [, load, getProfiles] = useProfilesApi();
  const [filters, setFilters] = useState({});
  const [fuseQuery, setFuseQuery] = useState(null);

  useEffect(() => {
    load();
  }, []);

  let filteredProfile = _.filter(getProfiles, filters);
  const fuse = new Fuse(filteredProfile, { keys: ['name'] });
  if(fuseQuery) {
    filteredProfile = fuse.search(fuseQuery);
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0"><h2 className="mb-0"> Профили </h2></Col>
            <Col lg="3">
              <Input onChange={
                event => {
                  if(event.target.value) {
                    const query = event.target.value.toString();
                    setFuseQuery(query);
                  } else {
                    setFuseQuery(null);
                  }
                }
              }
              />
            </Col>
            <Col >
              <Link to="/profiles/create">
                <Button className='bg-turquoise-button text-white'>
                  Новый профиль +
                </Button>
              </Link>
            </Col>
          </Row>
          <hr color="black"/>
          {
            _.map(filteredProfile, (value, key) => {
              return (
                <div key={key} className="vacancy">
                  <div className="d-flex justify-content-between">
                    <div className="name">
                      {`${value.name}`}
                    </div>
                    <div className='d-flex flex-column align-items-end'>
                      <Link to={`/profile/edit/${value.id}`} className='mb-2'>
                        <Button color="primary"> Редактировать </Button>
                      </Link>
                      <Link to={`/profile/${value.id}`}>
                        <Button color="primary"> Подробнее </Button>
                      </Link>
                    </div>
                  </div>
                <Row>
                  <Col lg="4">
                  <div className="d-inline-block align-top table-top-align-row">
                    <table cellPadding="2">
                      <tbody>
                        <tr>
                          <td>
                            <div className="vacancy-field">
                              <b>Занятность:</b>
                            </div>
                          </td>
                          <td>{`${value.employment}`}</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="vacancy-field">
                              <b>График:</b>
                            </div>
                          </td>
                          <td>{`${value.schedule}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </Col>
                  <Col lg="2">
                  <div className="d-inline-block align-top">
                    <table cellPadding="2">
                      <tbody>
                        <tr>
                          <td>
                            <div className="vacancy-field">
                              <b>Ключевики:</b>
                            </div>
                          </td>
                          <td>0</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="vacancy-field">
                              <b>Просмотров сегодня:</b>
                            </div>
                          </td>
                          <td>0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </Col>
                  <Col lg="4">
                    {`${value.description}`}
                  </Col>
                </Row>
                </div>
              )
            })
          }
        </Col>
      </Row>
    </div>
  );
};

export default Component;
