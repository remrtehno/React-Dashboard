import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import Fuse from 'fuse.js';
import useProfilesApi from "./useProfilesApi";
import {Link} from "react-router-dom";


const Component = () => {
  const [, load, getProfiles] = useProfilesApi();
  const [filters, setFilters] = useState({});
  const [fuseQuery, setFuseQuery] = useState(null);
  const [modal, setModal] = useState({modal: false});

  useEffect(() => {
    load();
  }, []);

  let filteredProfile = _.filter(getProfiles, filters);
  const fuse = new Fuse(filteredProfile, { keys: ['name'] });
  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  if(fuseQuery) {
    filteredProfile = fuse.search(fuseQuery);
  }

  console.log(filteredProfile);

  const getFields = (field) => {
    if(getProfiles.length === 0) return [];
    // return getProfiles.reduce( (result, object) => {
    //   (Array.isArray(result) || (result = []));
    //   if(result.find( name => name.value === object[field].name)) return result;
    //   result.push({value: object[field].name, label: object[field].name});
    //   return result;
    // });
    return ;
  };

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
              <Link to='/'>
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
                <Link key={key} className="vacancy" to={`/profile/${value.id}`} >
                  <div className="d-flex justify-content-between">
                    <div className="name">
                      {`${value.name}`}
                    </div>
                    <div>
                      <Link to={`/profile/${value.id}`} >
                        <Button color="primary">Редактировать</Button>
                      </Link>
                    </div>
                  </div>
                <Row>
                  <Col lg="4">
                  <div className="d-inline-block align-top table-top-align-row">
                    <table cellPadding="2">
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
                    </table>
                  </div>
                  </Col>
                  <Col lg="2">
                  <div className="d-inline-block align-top">
                    <table cellPadding="2">
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
                    </table>
                  </div>
                  </Col>
                  <Col lg="4">
                    {`${value.description}`}
                  </Col>
                </Row>
                </Link>
              )
            })
          }
        </Col>
      </Row>
    </div>
  );
};

export default Component;
