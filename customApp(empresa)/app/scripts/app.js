var client;

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};

function onAppActivate() {
  var btn = document.querySelector('.btn-open');
  btn.addEventListener('click', openModal);
  // Start writing your code...
}

function openModal() {
  client.interface.trigger(
    'showModal',
    useTemplate('Title of the Modal', './views/modal.html')
  );
}

function useTemplate(title, template) {
  return {
    title,
    template
  };
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}

// function requisitarServicos_ProdutosContratados() {
//   client.request.get("https://claracloud.myfreshworks.com/crm/sales/api/sales_accounts/16002926401?include=deals", {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Token token=Nj7PjcNtyaKpfOpKO-ozRA"
//     }
//   })
//     .then(
//       function (payload) {

//         let substituirTxt = document.getElementById("mostrarTxt")
//         let tituloServico = payload.response
//         // let subtituloServico = payload.response.deals.custom_field.cf_qual_o_impacto_que_o_cliente_est_tendo_
//         // let subtituloServico2 = payload.response.deals.custom_field.cf_necessidade

//         substituirTxt.innerHTML = `aaa ${tituloServico} `

//         console.log("payload", payload.response)
//       },
//       function (err) {
//         console.log("Erro", err)
//       }
//     )
// }

function requisitarServicos_ProdutosContratados() {
  client.data.get("sales_account").then(
    function (payload) {

      let substituirTxt = document.getElementById("mostrarTxt")
      let tituloServico = payload.response
      // let subtituloServico = payload.response.deals.custom_field.cf_qual_o_impacto_que_o_cliente_est_tendo_
      // let subtituloServico2 = payload.response.deals.custom_field.cf_necessidade

      substituirTxt.innerHTML = `aaa ${tituloServico} `

      console.log("payload", payload)
    },
    function (err) {
      console.log("Erro", err)
    }
  )
}
