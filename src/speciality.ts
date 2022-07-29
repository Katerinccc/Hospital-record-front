import { ISpeciality } from './models/ISpeciality';
import { getAllSpecialties, 
    getSpeciality, 
    createSpeciality, 
    updateSpeciality, 
    deleteSpeciality 
} from "./actions/specialityActions.js";

declare global {
    interface Window {
        mainSpeciality:any;
        mainSpecialties:any;
        mainUpdate:any
    }
}
window.mainSpeciality = mainSpeciality;
window.mainSpecialties = mainSpecialties;
window.mainUpdate = mainUpdate

const params = new URLSearchParams(window.location.search);
let id:number = Number(params.get('id'));

function mainSpecialties(){
    createNewSpeciality();
    getSpecialtiesList();
    
    let createButton = document.getElementById("createButton") as HTMLButtonElement;
    createButton.addEventListener("click", displayAddSpeciality);
}

function mainSpeciality(){
    getSpecialityById();
    addRef();

    let deleteOption = document.getElementById("deleteSpeciality") as HTMLAnchorElement;
    deleteOption.addEventListener("click", deleteExistentSpeciality);
}

function mainUpdate(){
    updateExistentSpeciality();
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

function getSpecialityById(){
    const speciality = document.getElementById("speciality") as HTMLTableSectionElement;
    getSpeciality(id)
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
            const message = document.getElementById("messageCreate") as HTMLTableSectionElement;
            message.innerHTML = "";
            let p = document.createElement("p");  
            p.innerHTML = "Speciality " + speciality.name + " created successfully.";
            message.appendChild(p);
            getSpecialtiesList();
        })
    }
}

function addRef(){
    const updatePage = document.getElementById("updatePage") as HTMLAnchorElement;
    updatePage.href = "updateSpeciality.html?id=" + id;

    // const deleteSpeciality = document.getElementById("deleteSpeciality") as HTMLAnchorElement;
    // deleteSpeciality.href = "deleteSpeciality.html?id=" + id;
}

async function updateExistentSpeciality(){
    const form = document.getElementById('formUpdate') as HTMLFormElement;

    form.onsubmit = async function (event){
        event.preventDefault();

        const formData = new FormData(form);

        let specialityUpdate:ISpeciality = {
            idSpeciality: null,
            name: formData.get('name') as string,
            physician: formData.get('physician') as string
        } 
        updateSpeciality(id, specialityUpdate)
        .then(response => {
            if(response.status !== 200){
                throw Error(response.status.toString());
            }
            window.location.href = 'speciality.html?id=' + id;
            return response.json();
        })
    }
}

async function deleteExistentSpeciality(){
    deleteSpeciality(id)
    .then(dataApi => {
        if (dataApi.data === true){
            window.location.href = 'specialties.html';
        }else if (dataApi.message === 'Deletion denied') {
            const messageDelete = document.getElementById('deletedMessage') as HTMLParagraphElement;
            messageDelete.innerHTML = "";
            let p = document.createElement("p");  
            p.innerHTML = "The specialty cannot be deleted because it has associated patients.";
            p.style.color = '#B10D0D';
            messageDelete.appendChild(p);
        }
    })
}