module.exports = function ()
{
	Creep.prototype.runStationaryHarvester = function ()
	{
		let room = this.room;
		let energySourceID = this.memory.job.targetID;
		let job = room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID];
		let containerID = job.containerID;
		let container = Game.getObjectById(containerID);
		let currentTask = this.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].creepID = this.id;
		room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].active = true;

		if ((this.pos.x != container.pos.x) || (this.pos.y != container.pos.y))
		{
			this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			if(this.carry.energy < this.carryCapacity &&
				(this.memory.currentTask == "WalkingToJobSite"
				|| this.memory.currentTask == "Harvesting"))
			{
				this.memory.currentTask = "Harvesting";

				let energySource = Game.getObjectById(energySourceID);

				if(energySource.energy == 0 || this.carry.energy == this.carryCapacity)
				{
					this.memory.currentTask = "Working";
				}
				else
				{
					this.harvest(energySource);
				}
			}
			else
			{
				this.memory.currentTask = "Working";

				if(container.hits < container.hitsMax)
				{
					let action = this.repair(container);
				}
				else
				{
					let action = this.transfer(container, RESOURCE_ENERGY);

					if (this.carry.energy == 0)
					{
						this.memory.currentTask = "Harvesting";
					}
				}
			}
		}



		/*
		 if(this.carry.energy == this.carryCapacity && this.memory.currentTask == "Harvesting")
		 {
		 this.memory.currentTask = "DoneHarvesting";
		 }
		 */
		//let containersPositionsArray = job.containersPositionsArray;



	}
}