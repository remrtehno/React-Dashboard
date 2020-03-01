import React, {useEffect} from 'react';
import {Col, Row, Button} from "reactstrap";
import {Link} from "react-router-dom";


import {useProfileApi} from "./useProfilesApi";
import _ from "lodash";


const Component = (props) => {
  const profileID = props.match.params.id;
  const [profile, loadApi] = useProfileApi();


  useEffect(() => {
    loadApi(profileID);
  }, []);

  console.log(profile)

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">  <h2> Профиль: {profile.name} </h2> </Col>
        <Col lg="12" className="mb-2">
          <Link to="/">Инфо</Link>
          <hr/>
        </Col>
        <Col lg="4" className="mb-3">
          <div className="mb-3">
            <h5>Внешние индетификаторы</h5>
            { _.isEmpty(profile.externalIds) ? 'Не указаны' : "" }
            { _.map(profile.externalIds, ({name, id}) => { return name+', '; }) }
          </div>
          <div className="mb-3">
            <h5 className="mr-2 d-inline-block">Занятность</h5>
            { profile.employment }
          </div>
          <div className="mb-3">
            <h5 className="mr-2 d-inline-block">График</h5>
            { profile.schedule }
          </div>
          <div className="mb-3">
            <h5 className="mr-2 mb-3">Задачи</h5>
            <div className="pl-4">
              { _.isEmpty(profile.tasks) ? 'Не указаны' : "" }
              { _.map(profile.tasks, ({title, description}) => {
                return (
                  <div>
                    <div className="mb-4">
                      <h6 className="m-0">{title}</h6>
                      {description}
                    </div>
                  </div>
                  )
              }) }
            </div>
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5>Ключевые фразы</h5>
          <div className="vertical-scroll">
            { _.map(profile.keywords, name => { return name ? name+', ': 'Не указаны'; }) }
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5>Минус фразы</h5>
          <div className="vertical-scroll">
            { _.map(profile.negativeKeywords, name => { return name ? name+', ': 'Не указаны'; }) }
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5 className="mb-3">Описание</h5>
          {profile.description}
        </Col>
        <Col lg="12" className="mb-3">
          <Button onClick={ () => props.history.goBack() }>Назад</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
