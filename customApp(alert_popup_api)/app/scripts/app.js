var client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated');
}

// async function renderizarNome() {
//   const textElement = document.getElementById('apptext');
//   const contactData = await client.data.get('contact');
//   const {
//     contact: { name }
//   } = contactData;

//   textElement.innerHTML = `Ticket is created by ${name}`;

//   client.events.on("ticket.addNote", eventCallback);

// }

function eventCallback(event) {
  console.log(event.type + " event occurred");
};

function mostrarModal1() {
  client.interface.trigger("showModal", {
    title: "Modal 1",
    template: "modal1.html"
  });
}

function requisitarApi2() {
  client.data.get("ticket")
    .then(
      function (data) {
        client.interface.trigger("showModal", {
          title: "Modal + Api !",
          template: "modal1.html"
        });
        
        console.log("payload.data.ticket", data.ticket.subject)
        let assunto = data.ticket.subject
        let substituirTxt2 = document.getElementById("teste")

        substituirTxt2.innerHTML = `O assunto deste ticket (de acordo com a API) é: "${assunto}"`;

        // console.log("deu bom", succ)
      },
      function (error) {
        console.log("nani", error)
      }
    );
}
function requisitarApi() {
  client.request.get("https://democlaracloud.freshdesk.com/api/v2/tickets?filter=new_and_my_open", {
    headers:
    {
      "Content-Type": "application/json",
      "Authorization": "Basic " + "QmpES1ladk52N2wyWkpYbmtDSlo="
    },
  })
    .then(
      function (payload) {
        client.interface.trigger("showModal", {
          title: "Modal + Api !",
          template: "modal1.html"
        });
        console.log("payload", JSON.parse(payload.response))
        console.log("payload", payload)
        // (chave para filtro de todos tickets para custom app api)
        let ticket = client.data.get("ticket")
        let assunto = JSON.parse(payload.response).filter(i => {
          if(i.id === ticket.id) {
            console.log("Sucesso")
            assunto = payload.response.subject
          } else {
            console.log("Erro")
          }
        })
        
        let substituirTxt = document.getElementById("teste")

        substituirTxt.innerHTML = `O assunto deste ticket (de acordo com a API) é: ${assunto}`;

        // console.log("deu bom", succ)
      },
      function (error) {
        console.log("nani", error)
      }
    );
}

function requisitarStatus() {
  client.data.get("ticket").then(
    function (data) {

      let converterTipo = data.ticket.status == 2 ? "info" :
        data.ticket.status == 3 ? "danger" :
          data.ticket.status == 6 || 7 ? "warning" :
            data.ticket.status == 4 || 5 ? "success" : "info"

      let substituirTxt = document.getElementById("zapato");
      let tempo = new Date().toLocaleDateString()
      let horario = new Date().toLocaleTimeString()

      substituirTxt.innerHTML = `Última Requsição em: ${tempo}, às ${horario}`;

      console.log(data.ticket)
      console.log(data.ticket.custom_fields)

      client.interface.trigger("showNotify", {
        type: converterTipo,
        message: "O status deste ticket é: " + data.ticket.status_label
      }).then(function (data) {
        console.log("Yes", data)
      }).catch(function (error) {
        console.log("Ops", error)
      })
    },
    function (error) {
      console.log("nani", error)
    }
  );
}

function requisitarEmail() {
  client.data.get("contact").then(
    function (data) {
      client.interface.trigger("showNotify", {
        type: "info",
        message: "Email é:" + data.contact.email
      }).then(
        function (succ) {
          console.log("deu bom", succ)
        },
        function (error) {
          console.log("nani", error)
        });
    },
    function (erro) {
      console.log("Ops", erro)
    }
  );
}

//window.frsh_init().then((client) => popupar(client));

function alertar() {
  client.interface.trigger("showConfirm", {
    title: "Exemplo!",
    message: "Este é um exemplo de Alert com dois botões!"
  }).then(function (result) {
    /* "result" will be either "Save" or "Cancel" */
  }).catch(function (error) {
    console.log("Algo de errado não deu certo", error)
  });
}

function popupar() {
  client.interface.trigger("showNotify", {
    type: "success",
    //    title: "Sucesso!",
    message: "Popup de Sucesso!"
    /* The "message" should be plain text */
  }).then(function (data) {
    // data - success message
  }).catch(function (error) {
    // error - error object
  });
}

function popupar2() {
  client.interface.trigger("showNotify", {
    type: "info",
    message: "Popup de Info"
  }).then(function (data) {
  }).catch(function (error) {
  });
}

function popupar3() {
  client.interface.trigger("showNotify", {
    type: "warning",
    message: "Popup de Aviso..."
  }).then(function (data) {
  }).catch(function (error) {
  });
}

function popupar4() {
  client.interface.trigger("showNotify", {
    type: "danger",
    message: "Popup de Perigo."
  }).then(function (data) {
  }).catch(function (error) {
  });
}

//

