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

function mostrarSubject() {
  client.data.get("ticket")
    .then(
      function (data) {
        console.log("payload.data.ticket", data.ticket.subject)
        let assunto = data.ticket.subject
        let substituirTxt2 = document.getElementById("teste")

        substituirTxt2.innerHTML = `"${assunto}"`;

      }),
    function (error) {
      console.log("nani", error)
    }
}


//

