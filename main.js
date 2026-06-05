let currentFavoritesList;
const savedMichis = document.getElementById('savedMichis');
const randomMichis = document.getElementById('randomMichis');
const API_RANDOM = "https://api.thecatapi.com/v1/images/search";
const API_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_UPLOAD = "https://api.thecatapi.com/v1/images/upload"
const API_Auth = "live_AjyaXLJ6CYSiSwDxIV9tza1NgJYYWlKwb8jWUfpOAajlqn5FZq8fDq2w7BMVmqfu";


loadRandomMichis();
loadFavoritesMichis();

async function loadRandomMichis(){
    const response = await fetch(API_RANDOM);
    const data = await response.json();
    
   if(response.status !== 200){
    showNotification(`Hubo un error: ${response.status} (${data.message})`,'error');
   }else{
    data.forEach(element=>{
        randomMichis.innerHTML = '';
        randomMichis.innerHTML += `<div class="card-michi">
                                    <img class="img" src="${element.url}" alt="Random Image about Cats" width="250" height="250"  >
                                    <button onclick="saveFavoriteMichis('${element.id}')">💾 Guardar Michi en Favoritos</button>
                                </div>`;
    })
    
   }
   
}

async function loadFavoritesMichis(){
    const response = await fetch(`${API_FAVORITES}`,{
        method: 'GET',
        headers:{
            'X-API-KEY': API_Auth
        }
    })
    const data = await response.json();


    if(response.status !== 200){
        showNotification(`Hubo un error: ${response.status} (${data.message})`,'error',4000);
    }else{
    if(data.length){
        savedMichis.innerHTML = '';
        currentFavoritesList = data;

        data.forEach(element => {
            savedMichis.innerHTML += `<div class="card-michi">
                                        <img class="img" src="${element.image.url}" width="150" height="150"  >
                                        <button onclick="deleteFavoriteMichi('${element.id}')">❌Eliminar</button>
                                     </div>`;
        });
    }else{
        savedMichis.innerHTML = "<p>No se ha guardado ningún Gatito</p>";
    }
}
}

async function saveFavoriteMichis(id){
    if(currentFavoritesList.length){
        const search = currentFavoritesList.find(element=>{
           return element.image_id == id
        })
        if(search){
            showNotification('Ya se guardó esta imagen','info');
            return false;
        }
    }
    
    const response = await fetch(`${API_FAVORITES}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_Auth
        },
        body: JSON.stringify({
            image_id: id
        })
    });
    const data = await response.json();

    if(response.status !== 200){
        showNotification(`Hubo un error: ${response.status} (${data.message})`,'error');
    }else{
         loadFavoritesMichis();   
         showNotification('Se ha guardado correctamente este Michi','success')
    }
    
}

async function deleteFavoriteMichi(id){
    const response = await fetch(`${API_FAVORITES}/${id}`,{
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_Auth
        }
    });
    const data = await response.json();

    if(response.status !== 200){
        showNotification(`Hubo un error: ${response.status} (${data.message})`,'error');
    }else{
         loadFavoritesMichis();   
         showNotification('Se ha borrado correctamente el Michi','success')
    }
}

async function uploadMichi(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form)

    const response = await fetch(API_UPLOAD,{
        method:'POST',
        headers:{
            'X-API-KEY': API_Auth
        },
        body: formData
    })
    const data = await response.json();

    if(response.status !== 201){
        showNotification(`Hubo un error: ${response.status} (${data.message})`,'error');
    }else{  
         showNotification('Se subió la foto del michi correctamente','success')
         console.log(data);
    }
}

function showNotification(text,type,time = 1500){
    switch(type){
        case 'success':
            document.getElementById('confirmation-message').innerText = `✔ ${text}`;
        break
        case 'info':
            document.getElementById('confirmation-message').innerText = `⚠ ${text}`;
        break
        case 'error':
            document.getElementById('confirmation-message').innerText = `❌ ${text}`;
        break
        default:
            document.getElementById('confirmation-message').innerText = `👀 ${text}`;
        break
    }
    
    document.getElementById('confirmation-message').classList.add(type);
    document.getElementById('confirmation-message').classList.add('show');
    setTimeout(function(){
        document.getElementById('confirmation-message').classList.remove('show');
        document.getElementById('confirmation-message').classList.remove(type);
    }, time)
}