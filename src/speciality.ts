import { getAllSpecialties, 
    getSpeciality, 
    createSpeciality, 
    updateSpeciality, 
    deleteSpeciality 
} from "./actions/specialityActions.js";

import { ISpeciality } from "../src/models/ISpeciality";

declare global {
    interface Window {
        getSpecialtiesList:any;
        getSpecialityById:any;
    }
}
window.getSpecialtiesList = getSpecialtiesList;
window.getSpecialityById = getSpecialityById;

let specialtiesReturn:ISpeciality[] = [];

function getSpecialtiesList(){
    const specialtiesList = document.getElementById("specialties-list") as HTMLTableSectionElement;
    getAllSpecialties()
        .then(specialties => {
            specialtiesReturn = specialties;
            for (let index = 0; index < specialtiesReturn.length; index++) {
                let element = specialtiesReturn[index];
                let a = document.createElement("a");
                a.href = "../views/speciality.html?id="+ element.idSpeciality;     
                a.innerHTML = element.name;    
                specialtiesList.appendChild(a);
            }
    });
}

const params = new URLSearchParams(window.location.search);
let id = params.get('id');

function getSpecialityById(){
    const speciality = document.getElementById("speciality") as HTMLTableSectionElement;
    getSpeciality(Number(id))
        .then(specialityReturn => {
            if(specialityReturn !== null){
                let name = document.createElement("p");  
                name.innerHTML = "Name: " + specialityReturn.name;
                speciality.appendChild(name);
                let physician = document.createElement("p"); 
                physician.innerHTML = "Physician: " + specialityReturn.physician;
                speciality.appendChild(physician);
            }
    });
}
