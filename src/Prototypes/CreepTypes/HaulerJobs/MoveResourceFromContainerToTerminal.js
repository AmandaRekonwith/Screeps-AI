module.exports = function ()
{
	Creep.prototype.runHaulerMoveResourceFromContainerToTerminal = function ()
	{
		let room = this.room;
		let containerID = this.memory.job.targetID;
		let resource = Game.getObjectById(this.room.memory.environment.resourcesArray[0]);
		let terminal = this.room.terminal;

		if (room.memory.jobs.haulerJobBoard.moveResourceFromContainerToTerminal[containerID])
		{
			let currentTask = this.memory.currentTask;

			if (this.memory.currentTask == null || this.memory.currentTask == "Getting Resource")
			{
				this.memory.currentTask = "Getting Resource";
				let container = Game.getObjectById(containerID);

				let action = this.withdraw(container, resource.mineralType);

				if (action == ERR_NOT_IN_RANGE)
				{
					this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
				}

				if(this.carry[resource.mineralType] && this.carry[resource.mineralType] > 0)
				{
					this.memory.currentTask = "Working";
					this.memory.job = {
							targetID: terminal.id,
							type: "supplyTerminalResource"
					}
				}
			}
		}
	}
}