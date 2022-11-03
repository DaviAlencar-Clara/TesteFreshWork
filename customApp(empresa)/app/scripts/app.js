var client;

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

function mostrarModal1() {
  client.interface.trigger("showModal", {
    title: "Modal 1",
    template: "views/modal.html"
  });
}

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

//Todas requisições em relação ao cliente passam aqui
async function buscarDadosCliente() {
  let requisitarConta = await client.data.get("sales_account")
  idSalesAccount = requisitarConta.sales_account.id
  nomeEmpresa = requisitarConta.sales_account.name;
  // let idDeal = account.sales_account.deals.id;
  console.log("Id da Sales Account:", requisitarConta.sales_account.id);
  const deals = await requisitarDeals(idSalesAccount, nomeEmpresa)
  await requisitarProdutos_Deals(deals)

  renderizarHtml(deals)
}

// function findDuplicates(arr) {
//   arr.filter((item, index) => arr.indexOf(item) != index)
// }

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

function renderizarHtml(deals) {

  // console.log("wow", deals);

  document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
  document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

  if (deals.length == 0) {
    console.log("Sem deals");
    popup("Não existem Deals", "warning")

    document.getElementById("ativo").innerHTML += `Você é um excrente! `

    let html = `<div id="txtBox"> 
        <div class="introducaoFlex">
          <p class="triste">:( </p>
          <p class="introducaoFlex">Não existem contratos para ${nomeEmpresa} !</p>
          </div> `

    document.getElementById("containerDeal").innerHTML += html

    pararLoading()

    return
  }



  let contadorDeals = 0
  let contVigentes = 0
  let contProdutos = 0
  var array = []
  var arr = [];
  var date = new Date();
  var current_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  var diffdate = new Date(current_date);



  deals.forEach(async j => {
    contadorDeals++;

    let idDeal = j.idDeal,
      nomeDeal = j.nomeDeal,
      dataInicio = j.dataInicio,
      mesesContrato = j.mesesContrato,
      estagioValidoContrato = j.estagioValidoContrato,
      temVendaAdicional = j.temVendaAdicional

    if (!estagioValidoContrato) {
      console.log("Deal em negociação/ não ganha", nomeDeal);
      return
    }

    if (mesesContrato < 12) {

      if (!j.temProduto) {
        //pass
        return
      }

      contVigentes += 1

      const produtos = j.produtos

      console.log("Vigente", nomeDeal, dataInicio);


      // var tal = produtos.map(k => {
      //   var array = []
      //   return {array: k.idProduto}
      // }, [])

      // console.log("talll", tal);

      produtos.forEach(i => {
        contProdutos += 1

        let nomeProduto = i.nomeProduto
        let quantiaProduto = i.quantidadeProduto
        let idProduto = i.idProduto

        // var array = []
        array.push(idProduto, `${idDeal}`)
        // array += idProduto + " "
        console.log("arrayPro", array);


        findDuplicates(array) // All duplicates
        console.log("ArrayDuplo", findDuplicates(array)) // All duplicates
        // console.log("ArrayDuplo", [...new Set(findDuplicates(array))]) // Unique duplicates

        console.log("TemVenda", temVendaAdicional);

        let iniciaisProdutos = nomeProduto.charAt(0)
        iniciaisProdutos += nomeProduto.charAt(1).toLowerCase()

        // idProduto.forEach(l => {
        //   document.getElementById(idProduto) == l.idProduto ? console.log("id produto sim") :
        //   document.getElementById(idProduto) != l.idProduto ? console.log("id produto não") :
        //   console.log("erro verificação id produto");
        // })

        console.log("Tem produto?", i.temProduto);

        if (temVendaAdicional == true) {
          console.log("array yes", nomeProduto);

          console.log("uooou", document.getElementById(idProduto));
          if (document.getElementById(idProduto)) {
            let quantiaTxt = document.getElementsByClassName(`dados quantia ${idProduto}`)[0].innerHTML;

            console.log("quantidadeeeeee", document.getElementsByClassName(`dados quantia ${idProduto}`)[0].innerHTML);
            console.log("resultadoododo", eval(Number(quantiaTxt) + Number(quantiaProduto)));

            document.getElementsByClassName(`dados quantia ${idProduto}`)[0].innerHTML = eval(Number(quantiaTxt) + Number(quantiaProduto))

            console.log("uooou", document.getElementsByClassName(`subtitulo ${idProduto}`));

            document.getElementsByClassName(`subtitulo ${idProduto}`)[0].innerHTML += ", " + `<a href='https://claracloud.myfreshworks.com/crm/sales/deals/${idDeal}' target="_blank">${idDeal}</a>`

            return;

          } else {
            console.log("idproduto nao");
          }
        } else {
          console.log("array no");
        }

        arr.push(dataInicio)

        // const num = 10;
        // const buildString = (num = 1) => {

        //   let res = '';
        //   for (let i = 0; i < num; i++) {

        //     if (i % 2 === 0) {

        //       res += 1;
        //     } else {

        //       res += 0;
        //     };
        //   };
        //   return res;
        // };
        // console.log(buildString(num));

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
        // if (dataInicio == null && dataFechamento == null) {
        //   html += `
        //     <div class="quantiaBox2"> 
        //         <p class="subtitulo">Data de Inicio</p>
        //         <p class="dados">Não consta</p>
        //       </div>
        //       </div>
        //   </div>
        //     `
        // } else if (dataInicio == formatDate(new Date(j.closed_date))) {
        //   html += `
        //   <div class="quantiaBox2"> 
        //       <p class="subtitulo">Data de Fechamento</p>
        //       <p class="dados">${dataInicio}</p>
        //     </div>
        //     </div>
        // </div>
        //   `

        // } else {
        //   html += `
        //     <div class="quantiaBox2"> 
        //         <p class="subtitulo">Data de Inicio</p>
        //         <p class="dados">${dataInicio}</p>
        //       </div>
        //       </div>
        //   </div>
        //     `
        // }
        document.getElementById("containerDeal").innerHTML += html
      })

      return
    }

    console.log("Não vigente", nomeDeal, dataInicio);
  });
  arr.sort(function (a, b) {
    var distancea = Math.abs(diffdate - a);
    var distanceb = Math.abs(diffdate - b);
    return distancea - distanceb; // sort a before b when the distance is smaller
  });


  if (diffMonths(new Date(arr[0])) > 12 || typeof arr[0] == 'undefined') {
    document.getElementById("ativo").innerHTML += `Você é um excrente! `
    console.log("excrente", arr[0]);
  } else {
    document.getElementById("ativo").innerHTML += `Você é um crente!`
    console.log("crente", arr[0]);
  }

  if (document.getElementById("containerDeal").innerHTML == "" && contProdutos == 0) {
    document.getElementById("containerDeal").innerHTML = `<div id="txtBox"> 
        <div class="introducaoFlex">
          <p class="triste">:( </p>
          <p class="introducaoFlex">${nomeEmpresa} não possui negociações ativas!</p>
          </div> `
    pararLoading()
    return
  }

  document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} | Total Produtos: ${contProdutos}`;


  console.log("Length da quantia", document.getElementById("quantia"))

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
          const temProduto = JSON.parse(data.response).deal.has_products;

          const tipoDeal = JSON.parse(data.response).deal_types
          const canoDeal = JSON.parse(data.response).deal_pipelines

          if (tipoDeal.some(i => i.name.toLowerCase() == "venda adicional") &&
            canoDeal.some(i => i.name.toLowerCase() == "base")) {
            deal.temVendaAdicional = true
          } else {
            deal.temVendaAdicional = false
          }

          // console.log("Tem produto? e Id", temProduto, id);
          console.log("dentro da request", products);

          if (!temProduto) {
            deal.temProduto = false
            return
          }

          //obj.atributo <- quando não existente, é criado
          deal.produtos = products.map(product => {
            return {
              idProduto: product.id,
              nomeProduto: product.name,
              quantidadeProduto: product.quantity
            }
          })
          deal.temProduto = true
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

function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

function teste(resultado) {
  resultado = document.getElementById("quantia").innerText
}

// total produtos de base
// var quantidade + quantidade
//pipeline = sko(?)
// data de renovação
