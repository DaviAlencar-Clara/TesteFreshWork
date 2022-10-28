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

//Todas requisições em relação ao cliente passam aqui
async function buscarDadosCliente() {
  let requisitarConta = await client.data.get("sales_account")
  idSalesAccount = requisitarConta.sales_account.id
  nomeEmpresa = requisitarConta.sales_account.name;
  // let idDeal = account.sales_account.deals.id;
  console.log("Id da Sales Account:", requisitarConta.sales_account.id);
  await requisitarDeals(idSalesAccount, nomeEmpresa)

  // && document.getElementById("produtos").innerHTML == null) {
    // console.log("verificação produtos = null", document.getElementById("containerDeal").innerHTML == "")
    
    pararLoading()
  
  // requisitarProdutos_Deals(idDeal)

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

async function requisitarDeals(id, nomeEmpresa) {
  await client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/sales_accounts/${id}?include=deals`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token token=Nj7PjcNtyaKpfOpKO-ozRA"
    }
  })
    .then(
      function (payload) {

        const deals = JSON.parse(payload.response).deals
        

        // deals.forEach(async k => {
        //   console.log("Deal uno", k.deal_stage_id);

        // })
        
        // const deals2 = deals.filter(d => {d.deal_stage_id == 16000205588 ||
        //   d.deal_stage_id == 16000328219 || d.deal_stage_id == 16000328224})

        // console.log("Deal 2", deals2);

        if (deals.length == 0) {
          console.log("Sem deals");
          popup("Não existem Deals", "warning")

          let html = `<div id="txtBox"> 
              <div class="produtos">
                <hr>
                <p class="introducaoFlex">Não existem Deals :( </p>
                </div> `

                document.getElementById("containerDeal").innerHTML += html

          return
        }

        document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
        document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

        let contadorDeals = 0
        let contVigentes = 0
        let contProdutos = 0

        deals.forEach(async j => {
          contadorDeals++;

          if (j.deal_stage_id != 16000205588 &&
            j.deal_stage_id != 16000328219 &&
            j.deal_stage_id != 16000328224) {

            console.log("Deal", j.deal_stage_id, "em negociação/ não ganha", nomeEmpresa);
            return
          }

          let idDeal = j.id,
              nomeDeal = j.name,
              dataFechamento = j.closed_date,
              dataInicio = new Date(j.custom_field.cf_data_de_incio)
          
          console.log("Id deal", idDeal);
          
          if (diffMonths(dataInicio ? new Date(dataInicio) : new Date(dataFechamento)) < 12) {
            contVigentes += 1
            
            // let html = `<div id="txtBox"> 
            //      <p id="nomeDeal"> ${nomeDeal} </p>  
            //      `

            const respApi = await requisitarProdutos_Deals(idDeal)

            console.log("Vigente");
            console.log(nomeDeal, dataInicio, dataFechamento);

            if (respApi.temProduto == false) {
              //pass
              return
            }

            respApi.produtos.forEach(i => {
              contProdutos += 1

              // respApi.forEach(a => {
              //   console.log(idDeal);
              // })
              
              let nomeProduto = i.nomeProduto
              let quantiaProduto = i.quantidadeProduto
              let idProduto = i.idProduto

              let iniciaisProdutos = nomeProduto.charAt(0)
              iniciaisProdutos += nomeProduto.charAt(1).toLowerCase()

              console.log("Tem produto?", i.temProduto);

              if (temBase == true || temVendaAdicional == true) {
                console.log("array yes", nomeProduto);
                if (document.getElementById(idProduto)) {
                  document.getElementsByClassName(`subtitulo ${idProduto}`).innerHTML +=`, ${idDeal}`
                } else {
                  console.log("idproduto nao");
                }
              } else {
                console.log("array no");
              }

              let html = `<div id="txtBox"> 
              <div class="produtos">
                <hr>
                <div class="produtosFlex">
                <div class="iconeFlex"> 
                <div class="icone">
                <p class="inicialPr"> ${iniciaisProdutos} </p>
                </div> 
                  <div class="produtoBox" id="${idProduto}"> 
                  <p class="dados">${nomeProduto}</p>  
                  <p onclick="openInNewTab('https://claracloud.myfreshworks.com/crm/sales/deals/${idDeal}')" class="subtitulo ${idProduto}">Oportunidades: ${idDeal}</p> 
                  </div>
                  </div>
                  <div class=posProduto>
                    <div class="quantiaBox"> 
                      <p class="subtitulo">Quantidade</p>
                      <p class="dados ${idProduto}">${quantiaProduto}</p>
                    </div>
                `
              if (dataInicio == null && dataFechamento == null) {
                html += `
                  <div class="quantiaBox2"> 
                      <p class="subtitulo">Data de Inicio</p>
                      <p class="dados">Não consta</p>
                    </div>
                    </div>
                </div>
                  `
              } else if (dataInicio == null) {
              html += `
                <div class="quantiaBox2"> 
                    <p class="subtitulo">Data de Fechamento</p>
                    <p class="dados">${dataFechamento.split("-").reverse().join("/")}</p>
                  </div>
                  </div>
              </div>
                `
              
              } else {
                html += `
                  <div class="quantiaBox2"> 
                      <p class="subtitulo">Data de Inicio</p>
                      <p class="dados">${dataInicio.toLocaleDateString()}</p>
                    </div>
                    </div>
                </div>
                  `
              }
              document.getElementById("containerDeal").innerHTML += html
            })
            
            // html += `</div>`
            document.getElementById("quantia").innerHTML += `Total Produtos: ${contProdutos} |`
            
            let texto = document.getElementById("quantia").innerText 
        console.log("Teste texto",texto);
        console.log("Teste texto include",texto.includes("Total Produtos"));
        
        if (document.getElementById("containerDeal").innerHTML == "" && contProdutos == 0) {
          document.getElementById("containerDeal").innerHTML = `<div class="produtos">
          <hr>
          <p class="introducaoFlex">Esta empresa não possui negociações ativas! </p>
          </div>`
          pararLoading()
          return
        }
        
        return
      }
      
      console.log("Não vigente");
      console.log(nomeDeal, dataInicio, dataFechamento);
    });
    
        document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} | `;
        

    console.log("Length da quantia", document.getElementById("quantia")) 
        
        popup("Sucesso na Requisição das Deals!", "success")
      },
      function (err) {
        console.log("Erro", err)
        popup("Erro de Requisição!", "error")
      }
      )
    }

function requisitarProdutos_Deals(id) {
  return client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/deals/${id}?include=products,deal_type,deal_pipeline`, {
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

        temBase = canoDeal.some(i => i.name.toLowerCase() == "base")
        temVendaAdicional = tipoDeal.some(i => i.name.toLowerCase() == "venda adicional")

        console.log("Tem produto? e Id", temProduto, id);


        console.log("dentro da request", products);

        if (!temProduto) {
          return {
            temProduto: false
          }
        }
        return {
          produtos: products.map(product => {
            return {
              idProduto: product.id,
              nomeProduto: product.name,
              quantidadeProduto: product.quantity
            }
          }),
          temProduto: true
        }
      },
      function (err) {
        console.log("Erro", err)
        popup("Erro de Requisição dos Produtos!", "error")
      }
    )
}

// css de crm product
// total produtos de base
// var quantidade + quantidade
//pipeline = sko(?)
// data de renovação
