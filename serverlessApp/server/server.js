exports = {
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.



  onTicketCreateHandler: function (args) {
    console.log('Hello: ' + args['data']['requester']['name']);
  },

  onTicketUpdateCallback: function (payload) {
    //Finding fields that are changed
    var changes = payload.data.ticket.changes;





    if (payload.data.ticket.deleted == false) {
      console.log("Atualizado!", changes)
    } else if (payload.data.ticket.deleted == true) {

      console.log(payload.data.actor.email)

      if (payload.data.actor.email !== "bot.autodelete@gmail.com.br") {
        if (payload.data.ticket.status == 2 || payload.data.ticket.status == 3) {
          $request.post("https://democlaracloud.freshdesk.com/api/v2/tickets", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Basic" + " QmpES1ladk52N2wyWkpYbmtDSlo="
            },
            body: JSON.stringify({
              "type": "Relatórios",
              "description": 'Ticket criado devido à exclusão anterior de ticket com valor "ABERTO/PENDENTE"!',
              "subject": `O ticket deletado tinha o assunto: ${payload.data.ticket.subject}`,
              "email": "bot.autodelete@gmail.com.br",
              "priority": 1,
              "status": 2,
              "custom_fields": {
                "cf_item_1": "Comida",
                "cf_item_2": "Hotdog"
              }
            })
          }).then(
            function (succ) {
              console.log("Sucesso", succ)
            },
            function (erro) {
              console.log("Erro", erro)
            }
          )
          console.log('Atenção! Ticket com valor "ABERTO/PENDENTE" excluído. Criando ticket de notificação por fechamento indevido!')
        } else {
          console.log("Ticket ", payload.data.ticket.id, " deletado com sucesso!")
        }
      } else {
        console.log('Ticket: "', payload.data.ticket.subject, '" foi deletado... Seu status era: ', payload.data.ticket.status)
      }

    } else {
      console.log("Erro", payload.data.ticket.id, payload.data.ticket.deleted)
    }


    // 2=open 3=Pending 6,7= Aguardando 4,5=Resolvido, Fechado
  },
};
