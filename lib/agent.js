module.exports = function(agent) {
	var saasClient = agent.saasClient;
	saasClient.sendCommand = function(cmd, args) {
		agent.emit('request', {
	      cmd: cmd,
	      args: args
	    });
	};

	agent.send = function (data) {
		this.emit('request', data);
	};

	agent.request = function (data) {
		switch (data.cmd) {
			case 'transactions-start' :
			case 'transactions-stop' :
				this.emit('command', data);
			default :
				this.emit('message', data);
				break;
		}
	};
}
