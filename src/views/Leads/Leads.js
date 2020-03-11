import React, {useState, useEffect} from 'react';
import moment from "moment";
import {Col, Row, Input} from "reactstrap";
import Select from 'react-select';

import get from '../../api/useGetRequest';

const getAllState = async () => {
  const leads = await get('/api/leads'),
    vacancies = await get('/api/vacancies'),
    regions = await get('/api/regions'),
    sources = await get('​/api/sources/main');

  return {
    leads,
    vacancies: vacancies.items,
    regions: regions.items,
    sources
  }
};

const getCampaignsByRegion = async (selectedRegion) => {
  const campaigns = await get('/api/yandex-direct/campaigns', {regionId: selectedRegion.id});

  return campaigns.items
};

const renderLeadsCards = (leads) => {
  return leads.map(lead => {
    const {
      firstName,
      lastName,
      middleName,
      mobilePhone,
      region,
      vacancy,
      emailAddress,
      id,
      createdAt,
      generatedId,
      campaign,
      utmRegion,
      utmSource,
      utmCampaign
    } = lead;

    const createdDate = moment(createdAt).format('DD.MM.YYYY HH:mm');

    return (
      <div className="vacancy" key={id}>
        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
            <div className='name'>
              <span className='mr-4'>{`${firstName} ${lastName} ${middleName}`}</span>
              <span className='mr-4'>{region.name}</span>
              <span><u>{vacancy.name}</u></span>
            </div>
            <a
              href={`mailto:${emailAddress}`}
              className='name m-0'
            >
              {emailAddress}
            </a>
            <a
              href={`tel:${mobilePhone}`}
              className='name'
            >
              {mobilePhone}
            </a>
          </div>
          <table style={{maxWidth: '40%'}} className='table table-borderless table-sm'>
            <tbody>
              <tr>
                <td>{createdDate}</td>
                <td>{campaign || 'Кампания отсутствует'}</td>
              </tr>
              <tr>
                <td>{generatedId}</td>
                <td>{campaign && campaign.name || 'Кампания отсутствует'}</td>
              </tr>
              <tr>
                <td>utmCity</td>
                <td>{utmRegion}</td>
              </tr>
              <tr>
                <td>utmCampaign</td>
                <td>{utmCampaign}</td>
              </tr>
              <tr>
                <td>utmSource</td>
                <td>{utmSource}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  })
};

const Component = () => {
  const [initialData, setInitialData] = useState({
    leads: [],
    vacancies: [],
    regions: [],
    sources: [],
    campaigns: []
  });

  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    const {leads, vacancies, region} = initialData;
    const isAllDataLoaded = leads.length && vacancies.length && region.length;

    if (!isAllDataLoaded) {
      getAllState()
        .then(data => {
          setInitialData({...initialData, ...data});
        })
    }
  }, []);

  useEffect(() => {
    const { region } = selectedValues;
    if (region)
    getCampaignsByRegion(region)
      .then(campaigns => {
        setInitialData({...initialData, campaigns})
      })
  }, [selectedValues.region]);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className='d-flex align-middle mb-3'>
              <h2 className="mb-0 mr-3">Лиды</h2>
              <Input
                placeholder='Поиск'
              />
            </Col>
            <Col lg="6" md='8'>
              <Row>
                <Col>
                  <Select
                    placeholder='Статус'
                  />
                </Col>
                <Col>
                  <Select
                    placeholder='Регионы'
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    options={initialData.regions}
                    onChange={selected => setSelectedValues({...selectedValues, region: selected})}
                  />
                </Col>
                <Col>
                  <Select
                    placeholder='Источник'
                  />
                </Col>
                <Col>
                  <Select
                    placeholder='Кампании'
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    options={initialData.campaigns}
                    onChange={(selected => setSelectedValues({...selectedValues, campaigns: selected}))}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <hr color="black"/>
          {renderLeadsCards(initialData.leads)}
        </Col>
      </Row>
    </div>
  );
};

export default Component;
