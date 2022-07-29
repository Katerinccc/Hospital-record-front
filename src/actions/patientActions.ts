import { IPatient } from './../models/IPatient';
import { IIdPatient } from "./../models/IIdPatient";

const API = 'http://localhost:8080/api/v1/patient/';

export async function getExistentPatient(idSpeciality:number, identification:number) {
    const response:Response = await fetch(API + idSpeciality + '/' +identification);
    return response;
}

export async function createPatient(patient:IPatient){
    const response:Response = await fetch(API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(patient)
    })
    return response;
}

export async function addNewAppointment(idPatient:IIdPatient){
    const response:Response = await fetch(API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(idPatient)
    })
    return response;
}

export async function deletePatient(id:number){
    const response:Response = await fetch( (API + id), {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: 'application/json'
    })
    const dataApi = await response.json();
    return dataApi;
}