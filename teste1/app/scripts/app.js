var client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText);
}

async function renderText() {
  const textElement = document.getElementById('apptext');
  const contactData = await client.data.get('contact');
  const {
    contact: { name }
  } = contactData;

  textElement.innerHTML = `Ticket is created by ${name}`;

  client.events.on("ticket.addNote", eventCallback);

}

function eventCallback(event) {
  console.log(event.type + " event occurred");
};

function mostrarModal1() {
  client.interface.trigger("showModal", {
    title: "Modal 1",
    template: "modal1.html"
  });
}
function requisitarApi() {
  client.request.get("https://claracloud.freshservice.com/api/v2/tickets")
    .then(
      {
        "headers":
        {
          "Content-Type": "application/json",
          "Authorization": "Basic " + "dHZlNlZrN3NyOXk4a2FzVXB2eQ=="  
        },
        maxAttempts: 5    
      },
        function(error) {
            console.log("Não..", error)
        }
    );
}
//window.frsh_init().then((client) => popupar(client));

function alertar() {
  client.interface.trigger("showConfirm", {
    title: "Exemplo!",
    message: "Este é um exemplo de Alert com dois botões!"
  /*"title" and "message" should be plain text.*/
  }).then(function(result) {
  /* "result" will be either "Save" or "Cancel" */
  }).catch(function(error) {
    console.log("Algo de errado não deu certo", error)
  });
}

function popupar() {
  client.interface.trigger("showNotify", {
    type: "success",
//    title: "Sucesso!",
    message: "Popup de Sucesso!"
  /* The "message" should be plain text */
  }).then(function(data) {
  // data - success message
  }).catch(function(error) {
  // error - error object
  });
}

function popupar2() {
  client.interface.trigger("showNotify", {
    type: "info",
//    title: "Sucesso!",
    message: "Popup de Info"
  }).then(function(data) {
  // data - success message
  }).catch(function(error) {
  // error - error object
  });
}

function popupar3() {
  client.interface.trigger("showNotify", {
    type: "warning",
//    title: "Sucesso!",
    message: "Popup de Aviso..."
  }).then(function(data) {
  // data - success message
  }).catch(function(error) {
  // error - error object
  });
}

function popupar4() {
  client.interface.trigger("showNotify", {
    type: "danger",
//    title: "Sucesso!",
    message: "Popup de Perigo."
  }).then(function(data) {
  // data - success message
  }).catch(function(error) {
  // error - error object
  });
}

//

