module.exports = function ()
{
	Creep.prototype.runContinuouslyUpgradeController = function ()
	{
		let room = this.room;
		let storage = room.memory.structures.storageArray[0];
		let storageID = storage.id
		let job = room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController[storageID];
		let jobSitePosition = job.pos;
		let controllerID = job.targetID;
		let controller = Game.getObjectById(controllerID);
		let currentTask = this.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController[storageID].creepID = this.id;
		room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController[storageID].active = true;

		if ((this.pos.x != jobSitePosition.x) || (this.pos.y != jobSitePosition.y))
		{
			this.moveTo(jobSitePosition.x, jobSitePosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			if(this.carry.energy < this.carryCapacity &&
				(this.memory.currentTask == "WalkingToJobSite"
				|| this.memory.currentTask == "Harvesting"))
			{
				this.memory.currentTask = "Harvesting";

				if(storage.store[RESOURCE_ENERGY] == 0 || this.carry.energy == this.carryCapacity)
				{
					this.memory.currentTask = "Working";
				}
				else
				{
					this.withdraw(storage, RESOURCE_ENERGY);
				}
			}
			else
			{
				this.memory.currentTask = "Working";

				let action = this.upgradeController(room.controller);

				if (this.carry.energy == 0)
				{
					this.memory.currentTask = "Harvesting";
				}
			}
		}
	}
}