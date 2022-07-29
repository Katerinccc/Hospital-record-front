import { IIdPatient } from './models/IIdPatient';
import { createPatient, 
    addNewAppointment, 
    deletePatient, 
    getExistentPatient 
} from "./actions/patientActions.js";

import { getAllSpecialties} from "./actions/specialityActions.js";
import { ISpeciality } from './models/ISpeciality';

declare global {
    interface Window {
        mainPatient:any;
        addNewAppointmentCurrentPatient:any
    }
}
window.mainPatient = mainPatient;
window.addNewAppointmentCurrentPatient = addNewAppointmentCurrentPatient;


function mainPatient(){
    fillSpecialtiesSelect();
    searchExistentPatient();
}

function fillSpecialtiesSelect(){
    getAllSpecialties()
    .then(specialtiesReturn =>{
        addOptions(specialtiesReturn)
    });
}

function addOptions(specialties:ISpeciality[]) {
    const select = document.getElementById("specialitySelect") as HTMLSelectElement;

    specialties.forEach(speciality =>{
        let option = document.createElement('option');
        option.value = Number(speciality.idSpeciality).toString();
        option.text = speciality.name;
        select.appendChild(option)

    } )
}

async function searchExistentPatient(){
    const form = document.getElementById('formSearch') as HTMLFormElement;
    const selectValue = document.getElementById('specialitySelect') as HTMLSelectElement;

    form.onsubmit = async function (event){
        event.preventDefault();

        const formData = new FormData(form);

        let specialityId:number = Number(selectValue.value);
        let identification:number = Number(formData.get('identification'));

        getExistentPatient(specialityId, identification)
        .then(response => {
            if (response.status === 404) {
                messageNotFound();
                displayCreatePatient();
                hideAddNewAppointmentButton();
            }else if(response.status === 200){
                messageFound();
                displayCreatePatient();
                displayAddNewAppointmentButton();
            }
            return response.json()
        }).then(dataApi => {
            console.log(dataApi);
            localStorage.setItem('idPatient', JSON.stringify(dataApi.data));
        })
    }
}

function addNewAppointmentCurrentPatient(){
    
    let idCurrentPatient = localStorage.getItem('idPatient');
    
    const idPatient:IIdPatient = {
        idPatient: Number(idCurrentPatient)
    }

    addNewAppointment(idPatient)
    .then(dataApi =>{
        const appointmentSection = document.getElementById('addAppointment') as HTMLTableSectionElement;
        appointmentSection.innerHTML = "";
        if(dataApi.message === 'OK'){
            const p:HTMLParagraphElement = document.createElement('p');
            const date:Date = new Date();
            p.innerText = "New appointment added successfully with date: " + date.toDateString();
            appointmentSection.append(p);
        }else if(dataApi.data === false){
            const p:HTMLParagraphElement = document.createElement('p');
            p.innerText = "The appointment could not be created.";;
            appointmentSection.append(p);
        }
    })
}

function displayCreatePatient(){
    const createPatient = document.getElementById('createPatient') as HTMLButtonElement;
    createPatient.classList.remove('display-none');
}

function displayAddNewAppointmentButton(){
    const addAppointment = document.getElementById('addAppointment') as HTMLButtonElement;
    addAppointment.classList.remove('display-none');
}

function hideAddNewAppointmentButton(){
    const addAppointment = document.getElementById('addAppointment') as HTMLButtonElement;
    addAppointment.classList.add('display-none')
}

function messageNotFound(){
    const messageNoExist = document.getElementById('messageResult') as HTMLParagraphElement;
    messageNoExist.innerText = "Patient not found. Select button to create new patient."
}

function messageFound(){
    const messageExist = document.getElementById('messageResult') as HTMLParagraphElement;
    messageExist.innerText = "The patient already exists. \nSelect correspondent button you want to add a new appointment to this patient or register a new one:"
}