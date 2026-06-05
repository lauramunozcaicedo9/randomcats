let currentFavoritesList;

const API = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {
        'X-API-KEY': 'live_AjyaXLJ6CYSiSwDxIV9tza1NgJYYWlKwb8jWUfpOAajlqn5FZq8fDq2w7BMVmqfu'
    }
})

const savedMichis = document.getElementById('savedMichis');
const randomMichis = document.getElementById('randomMichis');


loadRandomMichis();
loadFavoritesMichis();

async function loadRandomMichis(){
    const {data,status} = await API.get('/images/search')
    
   if(status !== 200){
    showNotification(`Hubo un error: ${status} (${data.message})`,'error');
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
    const {data, status} = await API.get('/favourites')


    if(status !== 200){
        showNotification(`Hubo un error: ${status} (${data.message})`,'error',4000);
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
    
    const {data, status} = await API.post('/favourites',{
        image_id: id
    });
   

    if(status !== 200){
        showNotification(`Hubo un error: ${status} (${data.message})`,'error');
    }else{
         loadFavoritesMichis();   
         showNotification('Se ha guardado correctamente este Michi','success')
    }
    
}

async function deleteFavoriteMichi(id){
    const {data, status} = await API.delete(`/favourites/${id}`);

    if(status !== 200){
        showNotification(`Hubo un error: ${status} (${data.message})`,'error');
    }else{
         loadFavoritesMichis();   
         showNotification('Se ha borrado correctamente el Michi','success')
    }
}

async function uploadMichi(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form)

    const {data, status}= await API({
        method: 'post',
        url:'/images/upload',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })

    if(status !== 201){
        showNotification(`Hubo un error: ${status} (${data.message})`,'error');
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