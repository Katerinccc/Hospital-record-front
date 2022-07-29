import { ISpeciality } from './../models/ISpeciality';

const API = 'http://localhost:8080/api/v1/speciality/';

export async function getAllSpecialties() {
    const response:Response = await fetch(API + "list");
    const dataApi = await response.json();
    const data:ISpeciality[] = dataApi.data;
    return data;
}

export async function getSpeciality(id:number) {
    const response:Response = await fetch(API + id);
    const dataApi = await response.json();
    const data:ISpeciality = dataApi.data;
    return data;
}

export async function createSpeciality(speciality:ISpeciality){
    const response:Response = await fetch(API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(speciality)
    })
    return response;
}

export async function updateSpeciality(id:number, speciality:ISpeciality){
    const response:Response = await fetch((API + id), {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(speciality)
    })
    return response;
}

export async function deleteSpeciality(id:number){
    const response:Response = await fetch( (API + id), {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: 'application/json'
    })
    const dataApi:boolean = await response.json();
    return dataApi;
}