let roomsController = require('Controllers_RoomsController');

let BrainController =
{
	brainWash: function ()
	{
		//clear memory of dead creepers
		for (let i in Memory.creeps)
		{
			if (!Game.creeps[i])
			{
				delete Memory.creeps[i];
			}
		}
	},

	processStimuli: function ()
	{
		this.brainWash();
		roomsController.initializeMemory();
		roomsController.scanRooms();
	},

	takeAction: function ()
	{
		let DEFCON = 5;


		roomsController.run(DEFCON);
	}
};

module.exports = BrainController;