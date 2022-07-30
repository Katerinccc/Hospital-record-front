import { IPatient } from './models/IPatient';
import { IIdPatient } from './models/IIdPatient';
import { getAllSpecialties} from "./actions/specialityActions.js";
import { ISpeciality } from './models/ISpeciality';
import { IPatientResponse } from './models/IPatientResponse';
import { createPatient, 
    getAllPatients,
    addNewAppointment, 
    deletePatient, 
    getExistentPatient 
} from "./actions/patientActions.js";

declare global {
    interface Window {
        mainPatient:any
        addNewAppointmentCurrentPatient:any
        displayCreatePatientForm:any
        loadPatients:any
    }
}
window.mainPatient = mainPatient;
window.addNewAppointmentCurrentPatient = addNewAppointmentCurrentPatient;
window.displayCreatePatientForm = displayCreatePatientForm;
window.loadPatients = loadPatients;

function mainPatient(){
    fillSpecialtiesSelect();
    searchExistentPatient();
    createNewPatient();
}

function fillSpecialtiesSelect(){
    getAllSpecialties()
    .then(specialtiesReturn =>{
        addOptions(specialtiesReturn)
    });
}

function loadPatients(){
    getPatientsList();
}

function addOptions(specialties:ISpeciality[]) {
    const select = document.getElementById("specialitySelect") as HTMLSelectElement;

    specialties.forEach(speciality =>{
        let option = document.createElement('option');
        option.value = Number(speciality.idSpeciality).toString();
        option.text = speciality.name;
        option.setAttribute("id", "idSpeciality" + Number(speciality.idSpeciality).toString())
        select.appendChild(option)

    } )
}

async function searchExistentPatient(){
    const form = document.getElementById('formSearch') as HTMLFormElement;
    const selectValue = document.getElementById('specialitySelect') as HTMLSelectElement;

    form.onsubmit = async function (event){
        event.preventDefault();
        hideCreatePatientForm();

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
            localStorage.setItem('idPatient', JSON.stringify(dataApi.data));
        })
    }
}

export function getPatientsList(){
    const patientsList = document.getElementById("patientsList") as HTMLTableSectionElement;
    patientsList.innerHTML = "";
    getAllPatients()
        .then(patientsReturn => {
            for (let index = 0; index < patientsReturn.length; index++) {
                let element = patientsReturn[index];
                createPatientDisplay(element);
            }
    });
}

function createPatientDisplay(patient:IPatientResponse){
    const patientsList = document.getElementById("patientsList") as HTMLTableSectionElement;

    const mainContainer:HTMLDivElement = document.createElement('div');
    mainContainer.className = 'patient-container';
    mainContainer.classList.add(`patient-${patient.idPatient}`);

    const infoContainer:HTMLDivElement = document.createElement('div');
    infoContainer.className = 'info-container'

    const buttonContainer:HTMLDivElement = document.createElement('div');
    buttonContainer.className = 'button-container'
    
    const h4:HTMLHeadElement = document.createElement('h4');
    h4.innerText = patient.name;
    
    const specialityP:HTMLParagraphElement = document.createElement('p')
    specialityP.innerText = "Speciality: " + patient.nameSpeciality;
    
    const identificationP:HTMLParagraphElement = document.createElement('p')
    identificationP.innerText = "Identification: " + patient.identification.toString();

    const appointmentP:HTMLParagraphElement = document.createElement('p')
    appointmentP.innerText = "Identification: " + patient.numberAppointments.toString();

    const ageP:HTMLParagraphElement = document.createElement('p')
    ageP.innerText = "Age: " + patient.age.toString();

    const deleteButton:HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'patient-delete-button'
    deleteButton.innerText = 'X'
    deleteButton.addEventListener('click', ()=> deleteSelectPatient(mainContainer));

    infoContainer.append(h4, specialityP, identificationP, appointmentP, ageP);
    buttonContainer.append(deleteButton);
    mainContainer.append(infoContainer,buttonContainer);
    patientsList.append(mainContainer);
}

function addNewAppointmentCurrentPatient(){
    
    let idCurrentPatient = localStorage.getItem('idPatient');
    
    const idPatient:IIdPatient = {
        idPatient: Number(idCurrentPatient)
    }

    addNewAppointment(idPatient)
    .then(dataApi =>{
        const appointmentSection = document.getElementById('addAppointment') as HTMLTableSectionElement;
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

async function createNewPatient(){ 
    const form = document.getElementById('formCreatePatient') as HTMLFormElement;

    form.onsubmit = async function (event){
        event.preventDefault();

        const formData = new FormData(form);

        const selectValue = document.getElementById('specialitySelect') as HTMLSelectElement;
        const specialityId:number = Number(selectValue.value);
        const specialityName = document.getElementById('idSpeciality'+specialityId.toString()) as HTMLOptionElement;
        
        let newPatient:IPatient = {
            idSpeciality: specialityId,
            name: formData.get('name') as string,
            identification: Number(formData.get('newIdentification')),
            age: Number(formData.get('age'))
        }

        const message = document.getElementById("messagePatient") as HTMLTableSectionElement;

        createPatient(newPatient)
        .then(response => {
            if(response.status === 400){
                let pError = document.createElement("p");  
                pError.innerHTML = "The patient could not be created. Please review the data and try again.";
                pError.style.color = '#B10D0D';
                message.appendChild(pError);
            }else if (response.status === 201){
                return response.json();
            }            
        })
        .then(patientResponse => {
            const patient:IPatient = patientResponse.data;
            const resetButton = document.getElementById("reset") as HTMLButtonElement;
            resetButton.click();
            message.innerHTML = "";
            let p = document.createElement("p");  
            p.innerHTML = "Patient " + patient.name + " was created successfully in Speciality " + specialityName.textContent;
            message.appendChild(p);
        })
    }
}

function deleteSelectPatient(mainContainer:HTMLDivElement){
    const id:number = Number(mainContainer.classList[1].split('-')[1]);
    deletePatient(id)
    .then(response => {
        if(response.status === 200){
            mainContainer.remove();
        }
    }).then(()=>loadPatients());

}

function displayCreatePatient(){
    const createPatient = document.getElementById('createPatient') as HTMLButtonElement;
    createPatient.classList.remove('display-none');
}

function displayAddNewAppointmentButton(){
    const addAppointment = document.getElementById('addAppointment') as HTMLButtonElement;
    addAppointment.classList.remove('display-none');
}

function displayCreatePatientForm(){
    const display = document.getElementById('createPatientForm') as HTMLTableSectionElement;
    display.classList.remove('display-none');

    const input = document.getElementById('identification') as HTMLInputElement;
    input.value = "";
}

function hideAddNewAppointmentButton(){
    const addAppointment = document.getElementById('addAppointment') as HTMLButtonElement;
    addAppointment.classList.add('display-none')
}

function hideCreatePatientForm(){
    const display = document.getElementById('createPatientForm') as HTMLTableSectionElement;
    display.classList.add('display-none');
}

function messageNotFound(){
    const messageNoExist = document.getElementById('messageResult') as HTMLParagraphElement;
    messageNoExist.innerText = "Patient not found. Click button to create new patient."
}

function messageFound(){
    const messageExist = document.getElementById('messageResult') as HTMLParagraphElement;
    messageExist.innerText = "The patient already exists. \nClick correspondent button to add a new appointment to this patient or register a new one:"
}