import requests from './requestAjax'
export const reqgetPeople = (params) => requests.get('/people', { params });
export const reqgetAge = (params) => requests.get('/age', { params });
export const reqgetPeopleIncrease = (params) => requests.get('/increase', { params });
export const reqgetMap = (params) => requests.get('/density', { params });
export const reqgetEducation = (params) => requests.get('/education', { params });
export const reqgetPid = () => requests.get('/getPid');
export const reqgetWorld = () => requests.get('/world');