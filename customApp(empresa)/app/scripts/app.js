var client;

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', teste);
    }
  }
};

async function teste() {

  let account = await client.data.get("sales_account")
  let idSalesAccount = account.sales_account.id
  console.log(account.sales_account.id);
  requisitarServicos_ProdutosContratados(idSalesAccount)
  
}

// function onAppActivate() {
//   var btn = document.querySelector('.btn-open');
//   btn.addEventListener('click', openModal);
//   // Start writing your code...
// }

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

function popupSuc(mensagem) {
  client.interface.trigger("showNotify", {
    type: "success",
    //    title: "Sucesso!",
    message: mensagem
    /* The "message" should be plain text */
  }).then(function (data) {
    // data - success message
  }).catch(function (error) {
    // error - error object
  });
}

function popupErr(mensagem) {
  client.interface.trigger("showNotify", {
    type: "danger",
    //    title: "Erro!",
    message: mensagem
  }).then(function (data) {
    // data - success message
  }).catch(function (error) {
    // error - error object
  });
}
function popupWar(mensagem) {
  client.interface.trigger("showNotify", {
    type: "warning",
    //    title: "Erro!",
    message: mensagem
  }).then(function (data) {
    // data - success message
  }).catch(function (error) {
    // error - error object
  });
}

// function requisitarServicos_ProdutosContratados() {

//   let idConta;
//   function a(payload) {
//     let getConta = client.data.get("sales_account")
//     console.log(payload.response)
//     let buscaIdConta = JSON.parse(payload.response).filter(i => {
//       if (i.id === getConta.id) {
//         console.log("Sucesso", buscaIdConta)
//         idConta = i.id
//         console.log("id", idConta)
//       } else {
//         console.log("Erro")
//       }
//     })
//   }


async function requisitarServicos_ProdutosContratados(id) {
  await client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/sales_accounts/${id}?include=deals`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token token=Nj7PjcNtyaKpfOpKO-ozRA"
    }
  })
    .then(
      function (payload) {
        let getConta = client.data.get("sales_account")

        const deals = JSON.parse(payload.response).deals

      if(deals.length !== 0) {

        console.log(deals.length)

        let contador = 0

        deals.forEach(i => {
          contador = contador + 1
          let nomeDeal = i.name
          let quantiaDeal = i.amount
          let fechamentoPrevisto = i.expected_close
          let dataAtual = new Date().toLocaleDateString().split('/').reverse().join('-')
          // const offset = dataAtual.getTimezoneOffset()
          // dataAtual = new Date(dataAtual.getTime() - (offset * 60 * 1000))
          // return dataAtual.toISOString().split('T')[0]

          if (fechamentoPrevisto == null) {
            //pass
          } else if (fechamentoPrevisto !== null) {
            document.getElementById("mostrarTxt2").innerHTML += `<div id="txtBox"> 
            <p class="nomeDeal"> ${nomeDeal} <p/>  
            <p class="quantiaDeal"> $ ${quantiaDeal}  <p/> 
            <p class="txt"> Vencido: ${dataAtual > fechamentoPrevisto} <p/> 
            <p class="fechamentoPrevisto"> Até: ${fechamentoPrevisto.split('-').reverse().join('/')} <p/> 
            <!-- <p class="fechamentoPrevisto"> Até: ${fechamentoPrevisto.split('-').reverse().join('/')} <p/> --!>
            <!-- <p class="fechamentoPrevisto"> Até: ${fechamentoPrevisto.split('-').reverse().join('/')} <p/> --!>
            <p class="ate"> Data Atual: ${dataAtual.split('-').reverse().join('/')} <p/>
            <p class="txt"> teste: ${contador} <p/> 
            <div/> `
          } else {
            console.log("err")
            popupErr("Erro de Requisição")
          }
        });
        popupSuc("Sucesso na Requisição!")
        // let substituirTxt = document.getElementById("mostrarTxt")
        // let tituloServico = payload.response

        // console.log("payload", payload.response)
        // console.log("payload2", payload.response.deals)
      } else {
        console.log("Sem deals");
        popupWar("Não existem Deals")
      }
    },
      function (err) {
        console.log("Erro", err)
        popupErr("Erro de Requisição!")
      }
    )
}
