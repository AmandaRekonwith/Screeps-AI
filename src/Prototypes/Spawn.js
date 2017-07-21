let controllerCreepsNameGenerator = require('Controllers_Creeps_NameGeneratorController');

module.exports = function ()
{

	//200
	StructureSpawn.prototype.createSmallestWorkerCreep =
		function ()
		{
			var body = [
				WORK,
				CARRY,
				MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "smallest",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//400
	StructureSpawn.prototype.createSmallerWorkerCreep =
		function ()
		{
			var body = [WORK, WORK,
				CARRY,
				MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "smaller",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//650
	StructureSpawn.prototype.createSmallWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK,
				CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "small",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//900
	StructureSpawn.prototype.createBigWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "big",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1150
	StructureSpawn.prototype.createBiggerWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "bigger",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1450
	StructureSpawn.prototype.createBiggestWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "biggest",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	StructureSpawn.prototype.createHaulerCreep =
		function ()
		{
			var body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	StructureSpawn.prototype.createStationaryHarvesterCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};
};