let MarketController =
{
	sellEverything()
	{
		let rooms = Game.rooms;
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			if(roomName == "W16S11")
			{
				let totalAmountOfOxygen = room.terminal.store[RESOURCE_OXYGEN];
				console.log(totalAmountOfOxygen);
			}
		}
	}
};

module.exports = MarketController;