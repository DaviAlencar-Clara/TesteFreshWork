var client;

// Ao iniciar, renderiza app e primeira função
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(mostrarErro);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', buscarDadosCliente());
    }
  }
};

// Formatar data
//======================================================================
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate() + 1),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
//========================================================================**/

async function buscarDadosCliente() {
  //Requisição busca dados cliente
  let requisitarConta = await client.data.get("sales_account")
  idSalesAccount = requisitarConta.sales_account.id
  nomeEmpresa = requisitarConta.sales_account.name;
  console.log("Id da Sales Account:", requisitarConta.sales_account.id);

  //Armazena dados deal pelo usuário pesquisado
  const deals = await requisitarDeals(idSalesAccount, nomeEmpresa)
  await requisitarProdutos_Deals(deals)

  //Renderiza Html + funções ao terminar de buscar esses dados
  renderizarHtml(deals)
}

//Renderiza Html + funções
function renderizarHtml(deals) {

  //Renderizam nome, e quantia de Contratos 
  document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
  document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

  //Tratativa para caso não existam Contratos, retornando mensagem indicando o mesmo
  if (deals.length == 0) {
    console.log("Sem deals");
    popup("Não existem Deals", "warning")

    //Insere status do Cliente
    document.getElementById("ativo").innerHTML += `Você é um excrente! `

    //Insere Html ao App
    let html = `<div id="txtBox"> 
        <div class="introducaoFlex">
          <p class="triste">:( </p>
          <p class="introducaoFlex">Não existem contratos para ${nomeEmpresa} !</p>
          </div> `

    document.getElementById("containerDeal").innerHTML += html

    pararLoading()

    return
  }

  //contadores
  let contadorDeals = 0
  let contVigentes = 0
  let contProdutos = 0

  //arrays
  var array = []
  var arr = [];

  //datas
  var date = new Date();
  var current_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  var diffdate = new Date(current_date);

  //Para cada Contrato, faz os comandos abaixo 
  deals.forEach(async j => {
    contadorDeals++;

    //Dados trazidos pela requisição API requisitarDeals()
    let idDeal = j.idDeal,
      nomeDeal = j.nomeDeal,
      dataInicio = j.dataInicio,
      mesesContrato = j.mesesContrato,
      estagioValidoContrato = j.estagioValidoContrato,
      temVendaAdicional = j.temVendaAdicional

    //Tratativa para caso estágio do Contrato não seja -, - e -, retornando mensagem indicando o mesmo
    if (!estagioValidoContrato) {
      console.log("Deal em negociação/ não ganha", nomeDeal);
      return
    }

    //Tratativa para somente listar produtos caso seja vigente (menos de 12 meses) 
    if (mesesContrato < 12) {

      //Tratativa para caso Contrato não tiver Produto, não imprimí-lo

      contVigentes++

      //Armazena dados dos Produtos de cada Contrato
      const produtos = j.produtos

      console.log("Vigente", nomeDeal, dataInicio);

      //Para cada Produto num Contrato, faz os comandos abaixo 
      produtos.forEach(i => {
        contProdutos++

        //Dados trazidos pela requisição API requisitarProdutos_Deals()
        let nomeProduto = i.nomeProduto,
          quantiaProduto = i.quantidadeProduto,
          idProduto = i.idProduto

        //Formata 2 primeiras letras do produto para inserir no ícone
        let iniciaisProdutos = nomeProduto.charAt(0)
        iniciaisProdutos += nomeProduto.charAt(1).toLowerCase()

        //Insere a Data de todos Contratos numa var
        arr.push(dataInicio)

        //Caso Produto possua Venda Adicional, faz os comandos abaixo
        if (temVendaAdicional == true) {

          //Caso qualquer elemento HTML tenha um id="" igual à um id de um Produto, faz os comandos abaixo
          if (document.getElementById(idProduto)) {

            //Armazena dados(quantidade de um produto) do primeiro elemento específico (1o produto com venda adicional, 
            // para agregar todos os outros à ele) com id="" do id Produto 
            let quantiaTxt = document.getElementsByClassName(`dados quantia ${idProduto}`)[0].innerHTML;

            //Insere no HTML a soma da quantia de produtos do primeiro produto (var quantiaTxt) com todos os outros,
            // já que var quantiaProduto está num loop, retornando o valor de todos produtos
            document.getElementsByClassName(`dados quantia ${idProduto}`)[0].innerHTML = eval(Number(quantiaTxt) + Number(quantiaProduto))

            //Insere no HTML do primeiro Produto um link p/ os outros Contratos que adicionaram mais do mesmo Produto
            document.getElementsByClassName(`subtitulo ${idProduto}`)[0].innerHTML += ", " + `<a href='https://claracloud.myfreshworks.com/crm/sales/deals/${idDeal}' target="_blank">${idDeal}</a>`

            return;

          } else {
            console.log("idproduto nao");
          }
        } else {
          console.log("array no");
        }

        //Armazena o corpo do HTML e os dados do Produto na var html
        let html = `<div id="txtBox"> 
        <div class="produtos" id="${idProduto}">
          <div class="produtosFlex">
          <div class="iconeFlex"> 
          <div class="icone">
          <p class="inicialPr"> ${iniciaisProdutos} </p>
          </div> 
            <div class="produtoBox"> 
          <!--  <p class="dados" id="nomeProduto" onclick="mostrarModal1()">${nomeProduto}</p> -->  
            <p class="dados" id="nomeProduto">${nomeProduto}</p>  
            <p class="subtitulo ${idProduto}">Oportunidades: <a href='https://claracloud.myfreshworks.com/crm/sales/deals/${idDeal}' target="_blank"> ${idDeal}</a></p> 
            </div>
            </div>
            <div class=posProduto>
              <div class="quantiaBox"> 
                <p class="subtitulo">Quantidade</p>
                <p class="dados quantia ${idProduto}">${quantiaProduto}</p>
              </div>
              <div class="quantiaBox2"> 
              <p class="subtitulo">Data do Contrato</p>
              <p class="dados">${dataInicio}</p>
            </div>
            </div>
        </div>
        <hr>
          `
      //Insere conteúdo da var html num elementp deste arquivo Js, no index.html
        document.getElementById("containerDeal").innerHTML += html

        //Fim do Produtos.forEach
      })
      return
      //Fim dos Contratos Vigentes
    }
    
    console.log("Não vigente", nomeDeal, dataInicio);

    //Fim do Deals.forEach
  });

  //Com todas datas dos Produtos de um Contrato armazenados, organiza os de mais antiga, para maus recente data
  arr.sort(function (a, b) {
    var distancea = Math.abs(diffdate - a);
    var distanceb = Math.abs(diffdate - b);
    return distancea - distanceb; // sort a before b when the distance is smaller
  });

  //Verifica a data do contrato mais recente e, se passado 1 ano comparado à hoje, imprime Ex-Cliente, senão, Cliente
  if (diffMonths(new Date(arr[0])) > 12 || typeof arr[0] == 'undefined') {
    document.getElementById("ativo").innerHTML += `Você é um excrente! `
    console.log("excrente", arr[0]);
  } else {
    document.getElementById("ativo").innerHTML += `Você é um crente!`
    console.log("crente", arr[0]);
  }
  
  //Se não ouver Produtos em nenhum Contrato, imprime o mesmo
  if (document.getElementById("containerDeal").innerHTML == "" && contProdutos == 0) {
    document.getElementById("containerDeal").innerHTML = `<div id="txtBox"> 
    <div class="introducaoFlex">
          <p class="triste">:( </p>
          <p class="introducaoFlex">${nomeEmpresa} não possui negociações ativas!</p>
          </div> `
    pararLoading()
    return
  }
  
  //Imprime quantos Contratos/Contratos Vigentes
  document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} | Total Produtos: ${contProdutos}`;

  popup("Sucesso na Requisição das Deals!", "success")

  pararLoading()

  return
}

async function requisitarDeals(id) {
  return await client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/sales_accounts/${id}?include=deals`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token token=Nj7PjcNtyaKpfOpKO-ozRA"
    }
  })
    .then(
      function (payload) {

        console.log("qwee oiiii", JSON.parse(payload.response).deals)


        return JSON.parse(payload.response).deals.map(j => {
          return {
            idDeal: j.id,
            nomeDeal: j.name,
            dataInicio: j.custom_field.cf_data_de_incio ? formatDate(new Date(j.custom_field.cf_data_de_incio)) : j.closed_date ? formatDate(new Date(j.closed_date)) : "Não consta",
            mesesContrato: diffMonths(j.custom_field.cf_data_de_incio ? new Date(j.custom_field.cf_data_de_incio) : new Date(j.closed_date)),
            estagioValidoContrato: j.deal_stage_id == 16000205588 || j.deal_stage_id == 16000328219 || j.deal_stage_id == 16000328224
          }
        })
      },
      function (err) {
        console.log("Erro", err)
        popup("Erro de Requisição das Deals!", err)
      }
    )
}


async function requisitarProdutos_Deals(deals) {
  await Promise.all(deals.map(async deal => {
    await client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/deals/${deal.idDeal}?include=products,deal_type,deal_pipeline`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token token=4fl9OGup3VHqavP-nk-qGQ"
      }
    })
      .then(
        function (data) {
          const products = JSON.parse(data.response).deal.products;
          const tipoDeal = JSON.parse(data.response).deal_types
          const canoDeal = JSON.parse(data.response).deal_pipelines

          if (tipoDeal.some(i => i.name.toLowerCase() == "venda adicional") &&
            canoDeal.some(i => i.name.toLowerCase() == "base")) {
            deal.temVendaAdicional = true
          } else {
            deal.temVendaAdicional = false
          }

          console.log("dentro da request", products);

          //obj.atributo <- quando não existente, é criado
          deal.produtos = products.map(product => {
            return {
              idProduto: product.id,
              nomeProduto: product.name,
              quantidadeProduto: product.quantity
            }
          })
        },
        function (err) {
          console.log("Erro", err)
          popup("Erro de Requisição dos Produtos!", err)
        }
      )
  }))

}

function pararLoading() {
  document.getElementById("loading").style.display = `none`
}

function mostrarErro(err) {
  console.error(`Erro. `, err);
}

// function redirecionarDeal() {
//   document.getElementById("oportunidade").onclick = function () {
//     location.href = "https://claracloud.myfreshworks.com/crm/sales/deals/16001629700";
// };

// }

//tipos de popup: success, info, warning, danger
function popup(mensagem, tipo) {
  client.interface.trigger("showNotify", {
    type: tipo,
    //    title: "Sucesso!",
    message: mensagem
  }).then(function (data) {
    console.log("Sucesso popup", data);
  }).catch(function (error) {
    console.log("Erro popup", error);
  });
}

function diffMonths(startDate) {
  const currentDate = new Date();

  return Math.abs(startDate.getMonth() - currentDate.getMonth() +
    (12 * (startDate.getFullYear() - currentDate.getFullYear())));
}

// total produtos de base
// var quantidade + quantidade
//pipeline = sko(?)
// data de renovação
