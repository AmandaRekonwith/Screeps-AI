let TowersController =
{
	run: function (room)
	{
		let towersArray = room.memory.structures.towersArray;

		let towersCount = towersArray.length;
		for(let x=0; x<towersCount; x++)
		{
			let tower = towersArray[x];

			//var hostiles = room.find(FIND_HOSTILE_CREEPS);

			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

			let target = null;
			let maximumHealCount = 0;

			if(closestHostile != null)
			{
				let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
				let hostileCreepsCount = hostileCreeps.length;

				for(let y=0; y<hostileCreepsCount; y++)
				{
					let hostileCreep = hostileCreeps[y];

					let hostileCreepBodyParts = hostileCreep.body;
					let hostileCreepBodyPartsCount = hostileCreepBodyParts.length;

					let healCount = 0;

					for (let z=0; z < hostileCreepBodyPartsCount; z++)
					{
						hostileCreepBodyPart = hostileCreepBodyParts[z];

						if (hostileCreepBodyPart.type == "heal")
						{
							healCount += 1;

							target = hostileCreep;
						}
					}

					if(healCount > maximumHealCount)
					{
						maximumHealCount = healCount;
					}
				}

				//console.log(maximumHealCount);
				if(maximumHealCount < 3 * towersCount)
				{
					if (target != null)
					{
						tower.attack(target);
					}
					else
					{
						tower.attack(closestHostile);
					}
				}
				else
				{
					//repair whatever wall the fucks are attacking
					this.repairRampartOrWall(room.name, tower.id);
				}
			}
			else
			{
				let creepsArray = room.find(FIND_MY_CREEPS);
				let creepsCount = creepsArray.length;

				let damagedCreep = null;

				for(z=0; z<creepsCount; z++)
				{
					if(creepsArray[z].hits < creepsArray[z].hitsMax )
					{
						damagedCreep = creepsArray[z];
					}
				}

				if(damagedCreep != null)
				{
					tower.heal(damagedCreep);
				}
				else
				{
					this.repairRampartOrWall(room.name, tower.id);
				}
			}
		}
	},

	repairRampartOrWall: function (roomName, towerID)
	{
		let room = Game.rooms[roomName];
		let tower = Game.getObjectById(towerID);

		let action = null;

		if (room.memory.structures.rampartsArray[0])
		{

			if (room.memory.structures.rampartsArray[0] && room.memory.structures.rampartsArray[0].hits < (Math.pow(2, room.controller.level) * 5000))
			{
				console.log(room.memory.structures.rampartsArray[0].hits + "   " + (Math.pow(2, room.controller.level) * 5000));

				action = tower.repair(room.memory.structures.rampartsArray[0]);
			}
			else
			{
				if (room.memory.structures.rampartsArray[0].hits < room.memory.structures.rampartsArray[0].hitsMax && room.storage && room.storage.store[RESOURCE_ENERGY] > 900000)
				{
					action = tower.repair(room.memory.structures.rampartsArray[0]);
				}
			}
		}

		if (action == null && room.memory.structures.wallsArray[0])
		{
			if (room.memory.structures.wallsArray[0] && room.memory.structures.wallsArray[0].hits < (Math.pow(2, room.controller.level) * 5000))
			{
				console.log(room.memory.structures.wallsArray[0].hits + "   " + (Math.pow(2, room.controller.level) * 5000));

				tower.repair(room.memory.structures.wallsArray[0]);
			}
			else
			{
				if (room.memory.structures.wallsArray[0].hits < room.memory.structures.wallsArray[0].hitsMax && room.storage && room.storage.store[RESOURCE_ENERGY] > 900000)
				{
					tower.repair(room.memory.structures.wallsArray[0]);
				}
			}
		}
	}
};

module.exports = TowersController;