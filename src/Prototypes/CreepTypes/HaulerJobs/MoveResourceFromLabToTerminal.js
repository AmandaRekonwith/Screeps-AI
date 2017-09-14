module.exports = function ()
{
	Creep.prototype.runHaulerMoveResourceFromLabToTerminal = function ()
	{
		let room = this.room;
		let labID = this.memory.job.targetID;
		let lab = Game.getObjectById(labID);

		if (room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[labID])
		{
			let currentTask = this.memory.currentTask;

			if (this.memory.currentTask == null || this.memory.currentTask == "Getting Resource")
			{
				this.memory.currentTask = "Getting Resource";

				let action = null;

				if(lab.mineralAmount >= 500)
				{
					let resource = Game.getObjectById(this.room.memory.environment.resourcesArray[0]);

					action = this.withdraw(lab, resource.mineralType);

					if (action == ERR_NOT_IN_RANGE)
					{
						this.moveTo(lab, {visualizePathStyle: {stroke: '#ffaa00'}});
					}

					if ((_.sum(this.carry) == this.carryCapacity) && this.memory.currentTask == "Getting Resource")
					{
						this.memory.currentTask = "Working";
						room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[labID].creepID = null;

						this.memory.job = null;
					}
				}
				else
				{
					if(_.sum(this.carry) > 0)
					{
						this.memory.currentTask = "Working";
						room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[labID].creepID = null;

						this.memory.job = null;
					}
					else
					{
						this.memory.currentTask = null;
						this.memory.job = null;
					}
				}
			}
		}
	}
}