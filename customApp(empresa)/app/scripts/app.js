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
  let nomeEmpresa = account.sales_account.name;
  console.log(account.sales_account.id);
  requisitarServicos_ProdutosContratados(idSalesAccount, nomeEmpresa)
  
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

function diffMonths(startDate) {

  // console.log(typeof startDate);

  const currentDate = new Date();

  return Math.abs(startDate.getMonth() - currentDate.getMonth() +
    (12 * (startDate.getFullYear() - currentDate.getFullYear())));
}


async function requisitarServicos_ProdutosContratados(id, nomeEmpresa) {
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
        document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
        document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

        let contadorDeals = 0
        let contadorSemDeals = 0
        let contVigentes = 0

        deals.forEach(i => {
          contadorDeals = contadorDeals + 1
          let nomeDeal = i.name
      
          let quantiaDeal = i.amount
          let fechamentoPrevisto = i.expected_close
          let dataFechamento = i.closed_date
          let dataInicio = new Date(i.custom_field.cf_data_de_incio).toLocaleDateString().split('/').reverse().join('-')
          let dataAtual = new Date().toLocaleDateString()

          
          // const offset = dataAtual.getTimezoneOffset()
          // dataAtual = new Date(dataAtual.getTime() - (offset * 60 * 1000))
          // return dataAtual.toISOString().split('T')[0]

          if(dataInicio == null || dataFechamento == null) {
            console.log("Data de Inicio ou Fechamento nulos para deal: ", contadorDeals)
          }
          else if(dataInicio == null && dataFechamento == null) {
            console.log("Deal", contadorDeals, "em andamento");
          } else {
            if (diffMonths(dataInicio ? new Date(dataInicio) : new Date(dataFechamento)) < 12) {
              console.log("Vigente");
              console.log(nomeDeal, dataInicio.split('-').reverse().join('/'), dataFechamento.split('-').reverse().join('/'));
              
              contVigentes += 1

              if (fechamentoPrevisto == null) {
                contadorSemDeals = contadorSemDeals + 1
                console.log("Deal contador", contadorDeals, "sem fechamento previsto");
                //pass
              } else if (fechamentoPrevisto !== null) {
    
                document.getElementById("mostrarTxt2").innerHTML += `<div id="txtBox"> 
                <p id="nomeDeal"> ${nomeDeal} <p/>  
                <p id="quantiaDeal"> $ ${quantiaDeal}  <p/> 
                <p id="txt"> Vencido: ${dataAtual > fechamentoPrevisto} <p/> 
                <p id="fechamentoPrevisto"> Até: ${fechamentoPrevisto.split('-').reverse().join('/')} <p/> 
                <p id="ate"> Data Atual: ${dataAtual.split('-').reverse().join('/')} <p/>
                <p id="txt"> Contrato: ${contadorDeals} <p/>  
                <p id="vigente"> <p/>  
                `
              } else {
                console.log("err")
                popupErr("Erro de Requisição")
              }
            } else if (diffMonths(dataInicio ? new Date(dataInicio) : new Date(dataFechamento)) > 12) {
              console.log("Não vigente");
              console.log(nomeDeal, dataInicio.split('-').reverse().join('/') , dataFechamento.split('-').reverse().join('/'));
            } else {
              console.log("Errado")
            }
          }
        });

        document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} `
        // document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${deals.length - contadorSemDeals} `

        popupSuc("Sucesso na Requisição!")
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


// popup com tipo em parametro
// exs de css
// listar contr
// tratativas de erro || popups