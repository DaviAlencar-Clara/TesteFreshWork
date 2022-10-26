var client;

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', buscarDadosCliente);
    }
  }
};

async function buscarDadosCliente() {

  let requisitarConta = await client.data.get("sales_account")
  idSalesAccount = requisitarConta.sales_account.id
  nomeEmpresa = requisitarConta.sales_account.name;
  // let idDeal = account.sales_account.deals.id;
  console.log("Id da Sales Account:", requisitarConta.sales_account.id);
  await requisitarDeals(idSalesAccount, nomeEmpresa)
  document.getElementById("loading").style.display = `none`
  // requisitarProdutos_Deals(idDeal)

}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}

//tipos de popup: success, info, warning, danger
function popup(mensagem, tipo) {
  client.interface.trigger("showNotify", {
    type: tipo,
    //    title: "Sucesso!",
    message: mensagem
  }).then(function (data) {
    // data - success message
  }).catch(function (error) {
    // error - error object
  });
}

function diffMonths(startDate) {

  const currentDate = new Date();

  return Math.abs(startDate.getMonth() - currentDate.getMonth() +
    (12 * (startDate.getFullYear() - currentDate.getFullYear())));
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

        if (deals.length == 0) {
          console.log("Sem deals");
          popup("Não existem Deals", "warning")

          return
        }

        document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
        document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

        let contadorDeals = 0
        let contVigentes = 0
        let contProdutos = 0

        deals.forEach(async i => {
          contadorDeals += 1

          if (i.deal_stage_id != 16000205588 &&
            i.deal_stage_id != 16000328219 &&
            i.deal_stage_id != 16000328224) {

            console.log("Deal", i.deal_stage_id, "em negociação/ não ganha", nomeEmpresa);
            return
          }

          let idDeal = i.id;
          let nomeDeal = i.name
          dataFechamento = i.closed_date
          dataInicio = new Date(i.custom_field.cf_data_de_incio)

          console.log(idDeal);

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
              contProdutos = + 1

              let nomeProduto = i.nomeProduto
              let quantiaProduto = i.quantidadeProduto
              let idProduto = i.idProduto
              let temProduto = i.temProduto

              let iniciaisProdutos = nomeProduto.charAt(0)
              iniciaisProdutos += nomeProduto.charAt(1).toLowerCase()

              console.log("Tem produto?", temProduto);

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
                  <p class="subtitulo ${idProduto}">Oportunidades: ${idDeal}</p> 
                  </div>
                  </div>
                  <div class=posProduto>
                    <div class="quantiaBox"> 
                      <p class="subtitulo">Quantidade</p>
                      <p class="dados ${idProduto}">${quantiaProduto}</p>
                    </div>
                `
              if (dataInicio == null && dataFechamento == null || dataFechamento == null) {
                html += `
                  <div class="quantiaBox2"> 
                      <p class="subtitulo">Data de Fechamento</p>
                      <p class="dados">Deal em andamento</p>
                    </div>
                    </div>
                </div>
                  `
                console.log("Deal", contadorDeals, "em andamento");
              } else {
                html += `
                  <div class="quantiaBox2"> 
                      <p class="subtitulo">Data de Fechamento</p>
                      <p class="dados">${dataFechamento.split("-").reverse().join("/")}</p>
                    </div>
                    </div>
                </div>
                  `
                console.log("Data de Inicio ou Fechamento nulos para deal: ", contadorDeals)
              }

              document.getElementById("containerDeal").innerHTML += html

            })
            document.getElementById("quantia").innerHTML += `Total Produtos: ${contProdutos} |`

            // html += `</div>`

            console.log("aaaa ", contProdutos)

            return
          }
          console.log("Não vigente");
          console.log(nomeDeal, dataInicio, dataFechamento);

        });

        // && document.getElementById("produtos").innerHTML == null) {
        if (document.getElementById("containerDeal").innerHTML.length == 0) {
          document.getElementById("containerDeal").innerHTML = `<div class="produtos">
            <hr>
            <p class="introducaoFlex">Está empresa não possui negociações ativas! </p>
            </div>
            `
        }

        document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} | `


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

        console.log("aa", temProduto, id);


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










// var client;

// document.onreadystatechange = function () {
//   if (document.readyState === 'interactive') renderApp();
//   function renderApp() {
//     var onInit = app.initialized();

//     onInit.then(getClient).catch(handleErr);

//     function getClient(_client) {
//       window.client = _client;
//       client.events.on('app.activated', buscarDadosCliente);
//     }
//   }
// };

// async function buscarDadosCliente() {

//   let account = await client.data.get("sales_account")
//   idSalesAccount = account.sales_account.id
//   nomeEmpresa = account.sales_account.name;
//   // let idDeal = account.sales_account.deals.id;
//   console.log(account.sales_account.id);
//   const deals = await requisitarDeals(idSalesAccount, nomeEmpresa)
//   document.getElementById("ativo").innerHTML += `Olá ${nomeEmpresa} ! `
//   document.getElementById("quantia").innerHTML += `Contratos Totais: ${deals.length} | `

//   let contadorDeals = 0
//   let contVigentes = 0
//   let contProdutos = 0

//   if (deals.length == 0) {
//     console.log("Sem deals");
//     popup("Não existem Deals", "warning")


//     return 
//   }

//   deals.forEach(async i => {
//     contadorDeals += 1

//     if (i.deal_stage_id != 16000205588 &&
//       i.deal_stage_id != 16000328219 &&
//       i.deal_stage_id != 16000328224) {

//       console.log("Deal", i.deal_stage_id, "em negociação/ não ganha", nomeEmpresa);
//       return
//     }

//     let idDeal = i.id;
//     let nomeDeal = i.name
//     dataFechamento = i.closed_date
//     dataInicio = new Date(i.custom_field.cf_data_de_incio)

//     console.log(idDeal);

//     if (diffMonths(dataInicio ? new Date(dataInicio) : new Date(dataFechamento)) < 12) {
//       contVigentes += 1

//       // let html = `<div id="txtBox"> 
//       //      <p id="nomeDeal"> ${nomeDeal} </p>  
//       //      `

//       const respApi = await requisitarProdutos_Deals(idDeal)


//       console.log("Vigente");
//       console.log(nomeDeal, dataInicio, dataFechamento);

//       if (respApi.temProduto == false) {
//         //pass
//         return
//       }


//       respApi.produtos.forEach(i => {
//         contProdutos = + 1

//         let nomeProduto = i.nomeProduto
//         let quantiaProduto = i.quantidadeProduto
//         let idProduto = i.idProduto
//         let temProduto = i.temProduto

//         console.log("Tem produto?", temProduto);

//         let html = `<div id="txtBox"> 
//               <div class="produtos">
//                 <hr>
//                 <div class="produtosFlex">
//                 <div class="iconeFlex"> 
//                 <div class="icone">
//                 </div> 
//                   <div class="produtoBox"> 
//                    <p class="subtitulo" ">Produto</p> 
//                     <p class="dados">${nomeProduto}</p> 
//                     <!-- <p class="oportunidades" id="${idProduto}>Oportunidades: ${idDeal}</p> -->
//                   </div>
//                   </div>
//                   <div class=posProduto>
//                     <div class="quantiaBox"> 
//                       <p class="subtitulo">Quantidade</p>
//                       <p class="dados">${quantiaProduto}</p>
//                     </div>
//                 `
//         if (dataInicio == null && dataFechamento == null || dataFechamento == null) {
//           html += `
//                   <div class="quantiaBox2"> 
//                       <p class="subtitulo">Data de Fechamento</p>
//                       <p class="dados">Deal em andamento</p>
//                     </div>
//                     </div>
//                 </div>
//                   `
//           console.log("Deal", contadorDeals, "em andamento");
//         } else {
//           html += `
//                   <div class="quantiaBox2"> 
//                       <p class="subtitulo">Data de Fechamento</p>
//                       <p class="dados">${dataFechamento.split("-").reverse().join("/")}</p>
//                     </div>
//                     </div>
//                 </div>
//                   `
//           console.log("Data de Inicio ou Fechamento nulos para deal: ", contadorDeals)
//         }



//         document.getElementById("containerDeal").innerHTML += html
//       })
//       document.getElementById("quantia").innerHTML += `Total Produtos: ${contProdutos} |`

//       // html += `</div>`

//       console.log("aaaa ", contProdutos)


//       return
//     }
//     console.log("Não vigente");
//     console.log(nomeDeal, dataInicio, dataFechamento);

//   });

//   if (document.getElementById("containerDeal").innerHTML.length == 0 &&
//     document.getElementById("produtos").innerHTML == null) {
//     document.getElementById("containerDeal").innerHTML = `<div class="produtos">
//             <hr>
//             <p class="dados">Está "deal" não possuu produtos :(</p>
//             </div>
//             `

//   }

//   document.getElementById("quantia").innerHTML += `Contratos Vigentes: ${contVigentes} | `


//   popup("Sucesso na Requisição das Deals!", "success")
//   document.getElementById("loading").style.display = `none`

// }

// function useTemplate(title, template) {
//   return {
//     title,
//     template
//   };
// }

// function handleErr(err) {
//   console.error(`Error occured. Details:`, err);
// }

// //tipos de popup: success, info, warning, danger
// function popup(mensagem, tipo) {
//   client.interface.trigger("showNotify", {
//     type: tipo,
//     //    title: "Sucesso!",
//     message: mensagem
//   }).then(function (data) {
//     // data - success message
//   }).catch(function (error) {
//     // error - error object
//   });
// }

// function diffMonths(startDate) {

//   const currentDate = new Date();

//   return Math.abs(startDate.getMonth() - currentDate.getMonth() +
//     (12 * (startDate.getFullYear() - currentDate.getFullYear())));
// }


// async function requisitarDeals(id, nomeEmpresa) {
//   await client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/sales_accounts/${id}?include=deals`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Token token=Nj7PjcNtyaKpfOpKO-ozRA"
//     }
//   })
//     .then(
//       function (payload) {

//         const deals = JSON.parse(payload.response).deals

        

//         return deals

//       },
//       function (err) {
//         console.log("Erro", err)
//         popup("Erro de Requisição!", "error")
//       }
//     )
// }

// function requisitarProdutos_Deals(id) {
//   return client.request.get(`https://claracloud.myfreshworks.com/crm/sales/api/deals/${id}?include=products,deal_type,deal_pipeline`, {
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Token token=4fl9OGup3VHqavP-nk-qGQ"
//     }
//   })
//     .then(
//       function (data) {
//         const products = JSON.parse(data.response).deal.products;
//         const temProduto = JSON.parse(data.response).deal.has_products;

//         const tipoDeal = JSON.parse(data.response).deal_types
//         const canoDeal = JSON.parse(data.response).deal_pipelines

//         temBase = canoDeal.some(i => i.name.toLowerCase() == "base")
//         arrayDeals = tipoDeal.some(i => i.name.toLowerCase() == "venda adicional")

//         console.log("aa", temProduto, id);


//         console.log("dentro da request", products);

//         if (!temProduto) {
//           return {
//             temProduto: false
//           }
//         }
//         return {
//           produtos: products.map(product => {
//             return {
//               idProduto: product.id,
//               nomeProduto: product.name,
//               quantidadeProduto: product.quantity
//             }
//           }),
//           temProduto: true
//         }
//       },
//       function (err) {
//         console.log("Erro", err)
//         popup("Erro de Requisição dos Produtos!", "error")
//       }
//     )
// }
