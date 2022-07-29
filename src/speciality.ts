import { getAllSpecialties, 
    getSpeciality, 
    createSpeciality, 
    updateSpeciality, 
    deleteSpeciality 
} from "./actions/specialityActions.js";

import { ISpeciality } from "../src/models/ISpeciality";

declare global {
    interface Window {
        mainSpeciality:any;
        mainSpecialties:any;
    }
}
window.mainSpeciality = mainSpeciality;
window.mainSpecialties = mainSpecialties;

function mainSpecialties(){
    createNewSpeciality();
    getSpecialtiesList();
    
    let createButton = document.getElementById("createButton") as HTMLButtonElement;
    createButton.addEventListener("click", displayAddSpeciality);
}

function mainSpeciality(){
    getSpecialityById();
}

function getSpecialtiesList(){
    const specialtiesList = document.getElementById("specialties-list") as HTMLTableSectionElement;
    specialtiesList.innerHTML = "";
    getAllSpecialties()
        .then(specialtiesReturn => {
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

function displayAddSpeciality(){
    const createSpeciality = document.querySelector(".create-speciality") as HTMLTableSectionElement;
    createSpeciality.classList.remove('display-none');
}

async function createNewSpeciality(){ 
    const form = document.getElementById('formCreate') as HTMLFormElement;

    form.onsubmit = async function (event){
        event.preventDefault();

        const formData = new FormData(form);   

        let newSpeciality:ISpeciality = {
            idSpeciality: null,
            name: formData.get('name') as string,
            physician: formData.get('physician') as string
        }
        
    createSpeciality(newSpeciality)
    .then(response => {
        if(response.status !== 200){
            throw Error(response.status.toString());
        }
        return response.json();
    })
    .then(specialityResponse => {
        const speciality:ISpeciality = specialityResponse.data;
        const resetButton = document.getElementById("reset") as HTMLButtonElement;
        resetButton.click();
        const message = document.getElementById("messageCreate") as HTMLTableSectionElement;;
        let p = document.createElement("p");  
        p.innerHTML = "Speciality " + speciality.name + " created successfully.";
        message.appendChild(p);
        getSpecialtiesList();
    })
    }
}