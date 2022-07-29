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
    }
}
window.mainPatient = mainPatient;


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
        })
    }
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
    messageExist.innerText = "The patient already exists. Select correspondent button you want to add a new appointment to this patient or register a new one:"
}