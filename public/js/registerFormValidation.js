window.onload = function(){

    let form = document.querySelector('form.register');
    let fieldName = document.querySelector('input.name');
    let fieldLastName = document.querySelector('input.lastName');
    let fieldEmail = document.querySelector('input.mail');
    let fieldPassword = document.querySelector('input.password');
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    //Validando el campo Nombre
    
    let errorName = document.querySelector(".errorName p");    
    
    fieldName.addEventListener('focus', function () {
        
        errorName.innerHTML += "El campo nombre no debe estar vacío";        
    })

    fieldName.onkeydown  = function () {
   
        errorName.innerHTML = "";           
    }

    fieldName.onblur  = function () {

        if (fieldName.value.length < 2 ) {

            errorName.innerHTML = "El campo nombre de poseer al menos 2 caracteres";  

        } else {

            errorName.innerHTML = "";
        }
                 
    }

    //Validando el campo Apellido
    
    let errorLastName = document.querySelector(".errorLastName p");    
    
    fieldLastName.addEventListener('focus', function () {
            
        errorLastName.innerHTML += "El campo apellido no debe estar vacío";        
    })
    
    fieldLastName.onkeydown  = function () {
       
        errorLastName.innerHTML = "";           
    }
    
    fieldLastName.onblur  = function () {
    
        if (fieldLastName.value.length < 2 ) {
    
            errorLastName.innerHTML = "El campo nombre de poseer al menos 2 caracteres";  
    
        } else {
    
            errorLastName.innerHTML = "";
        }
                     
    }

    //Validando el campo Email
    
    let errorEmail = document.querySelector(".errorEmail p");    
    
    fieldEmail.addEventListener('focus', function () {
            
        errorEmail.innerHTML += "El campo email no debe estar vacío";        
    })
    
    fieldEmail.onkeydown  = function () {
       
        errorEmail.innerHTML = "";           
    }
    
    fieldEmail.onblur  = function () {
    
        if (regex.test(fieldEmail.value) == false) {

            errorEmail.innerHTML = "debes escribir un email válido";

        } else {
    
            errorEmail.innerHTML = "";
        }
                     
    }

    //Validando el campo Password
    
    let errorPassword = document.querySelector(".errorPassword p");    
    
    fieldPassword.addEventListener('focus', function () {
            
        errorPassword.innerHTML += "El campo password no debe estar vacío";        
    })
    
    fieldPassword.onkeydown  = function () {
       
        errorPassword.innerHTML = "";           
    }
    
    fieldPassword.onblur  = function () {
    
        if (fieldPassword.value.length < 8 ) {
    
            errorPassword.innerHTML = "La contraseña debe poseer al menos 8 caracteres";  
    
        } else {
    
            errorPassword.innerHTML = "";
        }
                     
    }
    
    /* 
    *** La forma que probé inicialmente, la misma funcionaba,
         pero acumulaba los mensajes de errores ***

    form.addEventListener("submit", function(event){

        let errors = [];

    
        if(fieldName.value == ""){
            errors.push("El campo nombre no debe estar vacío");
           } else if (fieldName.value.length < 2) {
            errors.push("El nombre debe tener al menos 2 caracteres");               
           };

        if(fieldLastName.value == ""){
            errors.push("El campo apellido no debe estar vacío");
           } else if (fieldLastName.value.length < 2) {
            errors.push("El apellido debe tener al menos 2 caracteres");               
           };

        if(fieldEmail.value == ""){
            errors.push("El campo email no debe estar vacío");
            }

        if (regex.test(fieldEmail.value) == false) {
            errors.push("debes escribir un email válido");
        }
            


        if(fieldPassword.value == ""){
            errors.push("El campo contraseña no debe estar vacío");
           }  
        
        if(errors.length > 0){

            event.preventDefault();

            let errorName = document.querySelector(".errorName p");
            for (let i = 0 ; i < errors.length ; i++) {
                if (errors[i] != "" && errors[i].indexOf('nombre') != -1) {
                    errorName.innerHTML += errors[i];
                }
            }

            let errorLastName = document.querySelector(".errorLastName p");
            for (let i = 0 ; i < errors.length ; i++) {
                if (errors[i] != "" && errors[i].indexOf('apellido') != -1) {
                    errorLastName.innerHTML += errors[i];
                }
            }

            let errorEmail = document.querySelector(".errorEmail p");
            for (let i = 0 ; i < errors.length ; i++) {
                if (errors[i] != "" && errors[i].indexOf('email') != -1) {
                    errorEmail.innerHTML += errors[i];
                }
            }

            let errorPassword = document.querySelector(".errorPassword p");
            for (let i = 0 ; i < errors.length ; i++) {
                if (errors[i] != "" && errors[i].indexOf('contraseña') != -1) {
                    errorPassword.innerHTML += errors[i];
                }
            }

        }

    }); */


    


    

}