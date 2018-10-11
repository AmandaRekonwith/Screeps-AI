module.exports = function ()
{
	Creep.prototype.runHaulerMoveResourceFromLabToTerminal = function ()
	{
		let room = this.room;
		let labID = this.memory.job.targetID;
		let lab = Game.getObjectById(labID);
		let terminal = this.room.terminal;
		let resource = Game.getObjectById(this.room.memory.environment.resourcesArray[0]);
		let currentTask = this.memory.currentTask;

		let action = null;

		if(this.memory.currentTask == "Getting Resource")
		{
			if(lab.mineralAmount > 0)
			{
				action = this.withdraw(lab, resource.mineralType);

				if (action == ERR_NOT_IN_RANGE)
				{
					this.moveTo(lab, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			else
			{
				room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[labID].creepID = null;
				this.memory.currentTask = null;
				this.memory.job = null;
			}
		}

		if(this.carry[resource.mineralType] && this.carry[resource.mineralType] > 0)
		{
			room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[labID].creepID = null;
			this.memory.currentTask = "Working";
			this.memory.job = {
					targetID: terminal.id,
					type: "supplyTerminalResource"
			}
		}

	}
}




					