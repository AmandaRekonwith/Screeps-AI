module.exports = function ()
{
	Creep.prototype.getMaintainerJob = function ()
	{
		let typeOfJobRandomizer = Math.floor((Math.random() * 100));
		let percentageChanceOfWorkingRampartRepairJob = 70;

		if (typeOfJobRandomizer < percentageChanceOfWorkingFirstPriorityJob) //repair rampart
		{
			let rampart = this.room.memory.structures.rampartsArray[0];

			let job = {
				targetID: rampart.id,
				type: "repair"
			};
			this.memory.job = job;
		}
		else
		{
			let wall = this.room.memory.structures.wallsArray[0];
			let job = {
				targetID: wall.id,
				type: "repair"
			};
			this.memory.job = job;
		}
	},

	Creep.prototype.runMaintainer = function ()
	{
		if (this.memory.job != null)
		{
			switch (this.memory.job.type)
			{
				case "repair":
					this.repairTarget();
					break;
				default:
			}
		}
		else
		{
			this.memory.job = this.getJob();
		}
	},

	Creep.prototype.repairDefense = function ()
    {
        let structure = Game.getObjectById(this.memory.job.targetID);
        //it's possible that the structure could disappear if construction completes,
        // so check, and then set the current task and job to null if it's gone.
        if (structure)
        {
            let action = this.repair(structure);

            if (action == ERR_NOT_IN_RANGE)
            {
                this.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if (this.carry[RESOURCE_ENERGY] == 0)
            {
                this.memory.job = null;
                this.memory.currentTask = null;
            }
        }
        else
        {
            this.memory.job = null;
        }
    }
}



