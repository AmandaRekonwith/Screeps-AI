let roomController = require('Controllers_Room_RoomController');
let roomJobsController = require('Controllers_Room_JobsController');

let GameController =
{
	run: function (DEFCON)
	{
		if(DEFCON == 5) //PEACE TIME ... Focus on economy
		{
			let rooms = Game.rooms;
			for (let roomName in Game.rooms)
			{
				let room = Game.rooms[roomName];
				roomController.run(room, DEFCON);
			}
		}
	},

	scanRooms: function ()
	{
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			roomController.scanRoomEnvironment(room);
		}

		this.scanStructures();
		this.scanCreeps();

		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			roomJobsController.scanJobs(room);
			roomController.scanEnergy(room);
		}
	},

	scanStructures: function()
	{
		//find containers
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			/*
			const containersWithEnergy = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
				i.store[RESOURCE_ENERGY] > 0
			});
			*/

			let structureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
			});

			let structuresContainersCount = structureContainersArray.length;
			for (let x = 0; x < structuresContainersCount; x++)
			{
				let structureContainer = structureContainersArray[x];
				room.memory.structures.mapArray[structureContainer.pos.x][structureContainer.pos.y] = 16;
				room.memory.structures.containersArray.push(structureContainer);
			}

			//scan walls
			//organize by lowest amount of strength

			let structureWallsArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_WALL
			});

			structureWallsArray = _.sortBy(structureWallsArray, [Object.hits]);
			let structureWallsCount = structureWallsArray.length;
			for (let x = 0; x < structureWallsCount; x++)
			{
				let structureWall = structureWallsArray[x];
				room.memory.structures.mapArray[structureWall.pos.x][structureWall.pos.y] = 18;
				room.memory.structures.wallsArray.push(structureWall);
			}
		}

		for (let name in Game.structures)
		{
			let structure = Game.structures[name];
			let structureType = structure.structureType;

			//numbers correspond to location in ordered list of constants in Screeps API
			switch(structureType)
			{
				case 'spawn':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 1;
					structure.room.memory.structures.spawnsArray.push(structure);
					break;
				case 'extension':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 2;
					structure.room.memory.structures.extensionsArray.push(structure);
					break;
				case 'road':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 3;
					break;
				case 'constructedWall':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 4;
					break;
				case 'rampart':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 5;
					break;
				/* keeperLairs are not in game hash, add these after this script (if needed)
				case 'keeperLair':
					structure.room.memory.structuresMapArray[structure.pos.x][structure.pos.y] = 6;
				*/
				/* portals are not in game hash, add these after this script (if needed)
				case 'portal':
					structure.room.memory.structuresMapArray[structure.pos.x][structure.pos.y] = 7;
					*/
				case 'link':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 8;
					structure.room.memory.structures.linksArray.push(structure);
					break;
				case 'storage':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 9;
					structure.room.memory.structures.storageArray.push(structure);
					break;
				case 'tower':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 10;
					break;
				case 'observer':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 11;
					break;
				case 'powerBank':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 12;
					break;
				case 'extractor':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 13;
					break;
				case 'lab':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 14;
				case 'terminal':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 15;
					break;
				/* containers are not in game hash because they are not 'owned' by the player... code above puts it in this array
				case 'container':
				 structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 16;*/
					break;
				case 'nuker':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 17;
					break;
				case 'wall':
					//added above... 18.. for reference here
					break;
				default:
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 0;
			}
		}
	},

	scanCreeps: function()
	{
		let lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfWorkerCreeps = 1500;

		let lowestAmountOfTimeLeftToLiveOfHaulerCreeps = 1500;

		let lowestAmountOfTimeLeftToLiveOfStationaryCreeps = 1500;
		let creepToDie;

		for (let name in Game.creeps)
		{
			let creep = Game.creeps[name];
			let room = creep.room;

			//this puts the creep with the lowest amount of time left to live at the start of the array..
			//useful for a function I have already written, later it can just reference this, instead of a full check through all creeps
			//see creeps.getCreepSoonestToDie();



			let creepType = (creep.memory.type);
			switch (creepType)
			{
				case 'worker':
					let creepSize = creep.memory.size;
					switch (creepSize)
					{
						case 'smallest':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.push(creep);
							}
							break;
						case 'smaller':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.push(creep);
							}
							break;
						case 'small':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallWorkerCreepsArray.push(creep);
							}
							break;
						case 'big':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.bigWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.bigWorkerCreepsArray.push(creep);
							}
							break;
						case 'bigger':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.push(creep);
							}
							break;
						case 'biggest':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.push(creep);
							}
							break;
						default:
					}
					break;
				case 'hauler':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfHaulerCreeps)
					{
						room.memory.creeps.haulerCreeps.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfHaulerCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.haulerCreeps.push(creep);
					}
					break;
				case 'stationary':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfStationaryCreeps)
					{
						room.memory.creeps.stationaryCreeps.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfStationaryCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.stationaryCreeps.push(creep);
					}
					break;
				default:
			}
		}
	}
};
module.exports = GameController;