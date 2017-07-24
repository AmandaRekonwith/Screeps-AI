let controllerCreepsNameGenerator = require('Controllers_Creeps_NameGeneratorController');

module.exports = function ()
{

	//200, 1 work part, 1 carry part, 2 move parts, 12 ticks
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

	//400, 2 work parts, 1 carry part, 3 move parts, 18 ticks
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

	//650, 3 work parts, 2 carry parts, 5 move parts, 30 ticks
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

	//900, 4 work parts, 3 carry parts, 7 move parts, 42 ticks
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

	//1150, 5 work parts, 4 carry parts, 9 move parts, 54 ticks
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

	//1450, 5 work parts, 7 carry parts, 12 move parts, 72 ticks
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

	//1000 energy, 10 carry parts, 10 move parts, 60 ticks.
	//800 energy, 8 carry parts, 8 move parts, 48 ticks.
	//500 energy, 5 carry parts, 5 move parts, 30 ticks.
	StructureSpawn.prototype.createHaulerCreep =
		function ()
		{
			var body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "hauler",
				currentTask: null,
				job: null
			});
		};

	//1400 energy required, 10 work parts, 6 carry parts, 2 move parts, 54 ticks.
	//1100
	//1150 39 ticks
	StructureSpawn.prototype.createStationaryCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
				CARRY, CARRY,
				MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "stationary",
				currentTask: null,
				energySource: null,
				job: null
			});
		};
};