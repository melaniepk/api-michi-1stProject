const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

//axios
const api_axios = axios.create({
	baseURL: 'https://api.thecatapi.com/v1',
	headers: {'X-API-KEY': 'live_braKGKtLeeqrTOrwno7XWUlgDPjX8OuzAQnspZeOUHK3Q8o2Wh7AaPdZuA0KEvYd'}
}); 


const API_URL_FAVORITES_DELETE = (id)=>`https://api.thecatapi.com/v1/favourites/${id}`;

const spanError = document.getElementById('error');

const API_KEY_FAV = 'live_braKGKtLeeqrTOrwno7XWUlgDPjX8OuzAQnspZeOUHK3Q8o2Wh7AaPdZuA0KEvYd';



async function loadRandomMichis(){
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();


    console.log(data);
    if(res.status !== 200){
        spanError.innerHTML = "Hubo un error";
    }
    else{
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const btn1 = document.getElementById("btn1");
        const btn2 = document.getElementById("btn2");
        
        btn1.onclick = ()=> saveFavoriteMichi(data[0].id);
        btn2.onclick = ()=>saveFavoriteMichi(data[1].id);

        img1.src = data[0].url;    
        img2.src = data[1].url;  
    }
      

}

async function loadFavoriteMichis(){
    const res = await fetch(API_URL_FAVORITES,{
        method: 'GET',
        headers:{
            'X-API-KEY':API_KEY_FAV,
        },
    });
    const data = await res.json();
    console.log('favoritos');
    console.log(data);
    if(res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    else{
        const section = document.getElementById('favoriteMichis');
        section.innerHTML ="";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis Favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(michi =>{
            // michi.image.url
            
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');
            
            btn.onclick= () => deleteFavoriteMichi(michi.id);
            btn.appendChild(btnText);
            img.src = michi.image.url;
            img.width= 150;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);

        })
    }
        

}


async function saveFavoriteMichi(id){

    const{data,status} = await api_axios.post('favourites',{
        image_id: id,
    })
    
    
    // const res = await fetch(API_URL_FAVORITES,{
    //     method: 'POST',
    //     headers:{
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': API_KEY_FAV,
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // });

    // const data = await res.json();

    if(status !== 200){
        spanError.innerHTML = 'Hubo un error: ' +status + data.message;
    }
    else{
        console.log('michi guardado en favs');
        loadFavoriteMichis();
    }
}


async function deleteFavoriteMichi(id){
    const res = await fetch(API_URL_FAVORITES_DELETE(id),{
        method: 'DELETE',
        headers:{
            'X-API-KEY':API_KEY_FAV,
        }
    });

    const data = await res.json();
    if(res.status !== 200){
        spanError.innerHTML = 'Hubo un error: ' +res.status + data.message;
    }
    else{
        console.log('michi eliminado de favs');
        loadFavoriteMichis();
    }
}


async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD,{
        method:'POST',
        headers:{
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': API_KEY_FAV,
        },
        body:formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavouriteMichi(data.id) //para agregar el michi cargado a favoritos.
    }
}



loadRandomMichis();
loadFavoriteMichis();