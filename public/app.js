var app = new Vue({
  el: '#game',
  data: {
    rope: 50,
    winner: "",
  },
  methods: {
	  connectSocket: function () {
		this.socket = new WebSocket("wss://clickpush.herokuapp.com/");
		//on message send data.
		this.socket.onmessage = (event) => {
			console.log("socket.onmessage worked.");
      console.log("this is the message: " + event.data);
			var message = JSON.parse(event.data);
			this.rope = message.rope;
      this.winner = message.winner;
		};
	},
    click: function (team) {
      console.log('team', team);
	    var message = {action: 'click', team: team};
	    this.socket.send(JSON.stringify(message));
      this.rope = message.rope;
    },
    reset: function () {
      console.log('reset clicked');
	    var message = {action: 'reset'};
	    this.socket.send(JSON.stringify(message));
    }
  },
  created: function () {
    console.log('ready');
  	this.connectSocket();
  }
});
