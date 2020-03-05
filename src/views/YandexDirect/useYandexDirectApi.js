import {useState} from 'react';
import axios from 'axios';
import HOST_URL from "../../constants";

const token = localStorage.getItem('access_token');

export function useCompaniesApi() {
  const [allCompanies, setAllCompanies] = useState([]);

  const load = () => {
    axios
      .get(HOST_URL + `/api/yandex-direct/campaigns`, {
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      if (result.status === 200) {
        console.log(result)
        setAllCompanies(result.data.items);
      }
    }).catch(err => {
      console.log(err)
    });
  };
  return [allCompanies, load];
}

export function useRegionsApi() {
  const [allRegions, setAllRegions] = useState([]);

  const loadRegions = () => {
    const token = localStorage.getItem('access_token');
    axios
      .get(HOST_URL + '/api/yandex-direct/creation-wizard/regions', {
      headers: {
        'Accept': 'text/plain',
        'Authorization': 'Bearer ' + token
      },
    }).then((result) => {
      setAllRegions(result.data);
    }).catch(err => {
      console.log(err)
    });
  };
  return [allRegions, loadRegions];
}

export function useProfilesApi() {
  const [allProfiles, setAllProfiles] = useState([]);

  const loadProfiles = (regionId) => {
    axios
      .get(HOST_URL + '/api/yandex-direct/creation-wizard/profiles', {
        params: { regionId },
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer ' + token
        }
      }).then((result) => {
      setAllProfiles(result.data);
    }).catch(err => {
      console.log(err)
    });
  };
  return [allProfiles, loadProfiles];
}

export function useCardsApi() {
  const [allCards, setAllCards] = useState({});

  const loadCards = (regionId, profileIds) => {
    axios
      .get(HOST_URL + '/api/yandex-direct/creation-wizard/ad-text-templates',  {
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer ' + token
        },
        params: { regionId: "5e35aca51acb3417c8381c2d", profileIds: ["5e35af60f7acdf352c83b500"] + '' }
      }).then((result) => {
      setAllCards(result.data);
    }).catch(err => {
      console.log(err)
    });
  };

  return [allCards, loadCards];
}

export function useImagesApi() {
  const [images, setImage] = useState([]);

  const loadImages = () => {
    axios
      .get(HOST_URL + '/api/images',  {
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer ' + token
        },
      }).then((result) => {
        setImage(result.data.items);
      }).catch(err => {
        console.log(err)
      });
  };

  return [images, loadImages];
}

export function useImageByIdApi() {
  const [images, setImages] = useState([]);
  const loadImage = (imageIds) => {
    imageIds.map(id => {
      axios
        .get(HOST_URL + `/api/images/${id}`,  {
          headers: {
            'Accept': 'text/plain',
            'Authorization': 'Bearer ' + token
          },
        }).then((result) => {
          console.log(result)
        setImages([...images, {data: result.data, id}]);
      }).catch(err => {
        console.log(err)
      });
    })
  };

  return [images, loadImage];
}

export function uploadCardsApi(cards) {
  return axios
    .post(HOST_URL + '/api/yandex-direct/creation-wizard/ad-previews', cards, {

      headers: {
        'Accept': 'text/plan',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      console.log(res)
    }).catch(err => console.log(err))
}

export function uploadImageApi(data) {
  return axios
    .post(HOST_URL + '/api/images', data, {
      headers: {
        'Accept': 'text/plan',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      return res.data
    }).catch(err => console.log(err))
}
