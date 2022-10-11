exports = {
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.



  onTicketCreateHandler: function (args) {
    console.log('Hello darkness ' + args['data']['requester']['name']);
  },

  onTicketUpdateCallback: function (payload) {
    //console.log("Logging arguments from onTicketUpdate event: " + JSON.stringify(payload));
    //Finding fields that are changed
    var changes = payload.data.ticket.changes;

    console.log(changes)
    console.log("Atualizado!")

  }
};
