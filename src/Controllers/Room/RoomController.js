let creepsController = require('Controllers_Room_CreepsController');
let linksController = require('Controllers_Room_LinksController');
let roomExtensionsConstructionController = require('Controllers_Room_Construction_ExtensionsController');

require('Prototypes_Source')();

let RoomController =
{
	run: function (room)
	{
		if(room != undefined)
		{
			let controller = room.controller;

			if(controller != undefined)
			{
				let roomControllerLevel = controller.level;
				if (roomControllerLevel < 5)
				{
					room.memory.DEFCON = 3;
				}
				else
				{
					if(room.storage)
					{
						room.memory.DEFCON = 5;
					}
					else
					{
						room.memory.DEFCON = 4;
					}
				}

				if (roomControllerLevel > 0)
				{
					if(room.memory.structures.spawnsArray.length > 0)
					{
						roomExtensionsConstructionController.run(room);
						if (room.memory.structures.spawnsArray.length > 0)
						{
							console.log(Game.time);
							if(Game.time % 35 == 0)
							{
								creepsController.spawnCreeps(room);
							}
						}
					}
				}
			}

			linksController.run(room);
			creepsController.run(room);
		}
	},

	scanRoomEnvironment: function (room)
	{
		this.scanTerrain(room);
		this.scanEnergy(room);
		this.scanResources(room);
	},

	scanEnergy: function (room)
	{
		let roomName = room.name;
		let energySourcesArray = room.find(FIND_SOURCES);

		for (let x in energySourcesArray)
		{
			let numberOfAdjacentOpenTerrainTiles = 0;
			//checks that adjacent tiles are not walls and counts how many there are
			//counts both tiles that are swamp or plains by negating walls (3)
			//...
			//uses simple if statements to count...
			//checks top 3 tiles first, middle 2 second, bottom 3 last
			//... A drawing, as if it wasn't obvious enough what I'm doing ...
			//
			//    [][][]
			//    []  []
			//    [][][]

			let source = energySourcesArray[x];

			let xPosition = energySourcesArray[x].pos.x;
			let yPosition = energySourcesArray[x].pos.y;

			if (room.memory.environment.terrainMapArray[xPosition - 1][yPosition - 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition][yPosition - 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition + 1][yPosition - 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition - 1][yPosition] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition + 1][yPosition] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition - 1][yPosition + 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition][yPosition + 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}
			if (room.memory.environment.terrainMapArray[xPosition + 1][yPosition + 1] != 3)
			{
				numberOfAdjacentOpenTerrainTiles += 1;
			}

			energySourcesArray[x].numberOfAdjacentOpenTerrainTiles = numberOfAdjacentOpenTerrainTiles;
			energySourcesArray[x].numberOfCreepsCurrentlyHarvesting = 0;

			let creepsArray = [];
			creepsArray = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray
				.concat(room.memory.creeps.workerCreeps.smallerWorkerCreepsArray
					.concat(room.memory.creeps.workerCreeps.smallerWorkerCreepsArray
						.concat(room.memory.creeps.workerCreeps.smallWorkerCreepsArray
							.concat(room.memory.creeps.workerCreeps.bigWorkerCreepsArray
								.concat(room.memory.creeps.workerCreeps.biggerWorkerCreepsArray
									.concat(room.memory.creeps.workerCreeps.biggestWorkerCreepsArray))))));

			let creepsCount = creepsArray.length;

			for (let z = 0; z < creepsCount; z++)
			{
				let creep = creepsArray[z];
				if (creep.memory.currentTask == "Getting Energy" && creep.memory.energySource != null &&
					creep.memory.energySource.type == "source" &&
					creep.memory.energySource.targetID == source.id)
				{
					energySourcesArray[x].numberOfCreepsCurrentlyHarvesting += 1;
				}
			}
		}

		room.memory.environment.energySourcesArray = energySourcesArray;
	},

	scanResources: function (room)
	{
		if(room.memory.environment.resourcesArray.length == 0)
		{
			let roomName = room.name;
			let resourcesArray = room.find(FIND_MINERALS);

			for (let x in resourcesArray)
			{
				let resource = resourcesArray[x];

				room.memory.environment.resourcesArray.push(resource.id);
			}
		}
	},

	scanTerrain: function (room)
	{
		if(!room.memory.environment.terrainMapArray || room.memory.environment.terrainMapArray.length == 0)
		{
			//ugly multi-dimensional array instantiation
			let terrainArray = new Array();

			let roomName = room.name;
			for (let x = 0; x < 50; x++)
			{
				terrainArray[x] = new Array();
				for (let y = 0; y < 50; y++)
				{
					let terrainName = Game.map.getTerrainAt(x, y, roomName);
					switch (terrainName)
					{
						case 'plain':
							terrainArray[x][y] = 1;
							break;
						case 'swamp':
							terrainArray[x][y] = 2;
							break;
						case 'wall':
							terrainArray[x][y] = 3;
							break;
						default:
							terrainArray[x][y] = 0;
					}
				}
			}

			room.memory.environment.terrainMapArray = terrainArray;
		}
	}
};

module.exports = RoomController;