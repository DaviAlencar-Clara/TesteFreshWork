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

function mostrarModal2() {
  client.interface.trigger("showModal", {
    title: "Modal 2",
    template: "modal2.html"
  });
}

function mostrarModal3() {
  client.interface.trigger("showModal", {
    title: "Modal 3",
    template: "modal3.html"
  });
}

function mostrarModal4() {
  client.interface.trigger("showModal", {
    title: "Modal 4",
    template: "modal4.html"
  });
}

function popupar() {
  client.interface.trigger("showConfirm", {
    title: "Sample Confirm",
    message: "Are you sure you want to close this ticket?"
  /*"title" and "message" should be plain text.*/
  }).then(function(result) {
  /* "result" will be either "Save" or "Cancel" */
  }).catch(function(error) {
  // error - error object;
  });
}

//

