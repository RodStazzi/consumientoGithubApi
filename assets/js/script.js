const baseUrl = 'https://api.github.com';

const request = async (url) => {
  const results = await fetch(url)
  const response = await results.json()
  return response;
}

const getRepos = async (id, page, per_page) => {
  const url = `${baseUrl}/users/${id}/repos?page=${page}&per_page=${per_page}`
  return request(url);
}

const getUser = async (id) => {
  const url = `${baseUrl}/users/${id}`;
  return request(url);
}


let form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userId = document.getElementById('nombre').value;
  const page = document.getElementById('pagina').value;
  const per_page = document.getElementById('repoPagina').value;
  const results = document.getElementById('resultados');

  const getFuncion = async () => {
    try {
      const [user, repos] = await Promise.all([getUser(userId), getRepos(userId, page, per_page)]);
      if (user.message) {
        throw 'Ha ocurrido un error en el usuario'
      }
      if (repos.message) {
        throw 'Ha ocurrido un error en repositorios'
      }

      const nombreUsuario = user.name;
      const nombreLogin = user.login;
      const cantRepo = user.public_repos;
      const localidad = user.location;
      const tipoUsuario = user.type;
      const imagen = user.avatar_url;

      let repositorios = '';
      repos.forEach(element => {
        repositorios += `
          <p><a href="${element.html_url}" target="_blank">${element.name}</a></p>
          `
          ;
      })


      results.innerHTML = `
        <div class="row mt-4">
          <div class="text-left col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <h3>Datos de Usuario</h3>
              <div class="w-50">
                <img src="${imagen}" class="img-fluid">
              </div>
              <p>Nombre de Usuario: ${nombreUsuario}</p>
              <p>Nombre de Login: ${nombreLogin}</p>
              <p>Cantidad de Repositorios: ${cantRepo}</p>
              <p>Localidad: ${localidad}</p>
              <p>Tipos de Usuario: ${tipoUsuario}</p>
            </div>
            <div class="text-right col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <h3>Nombre de Repositorios</h3>
              ${repositorios}
            </div>
          </div>
        </div>
        `;
    } catch (err) {
      alert(err)
      console.log('err', err)
    }

  }
  getFuncion();
})