module.exports = function ()
{
	Creep.prototype.getMaintainerJob = function ()
	{
		let typeOfJobRandomizer = Math.floor((Math.random() * 100));
		let percentageChanceOfWorkingRampartRepairJob = 70;

		if (typeOfJobRandomizer < percentageChanceOfWorkingRampartRepairJob) //repair rampart
		{
			let rampart = this.room.memory.structures.rampartsArray[0];

			let job = {
				targetID: rampart.id,
				type: "repair"
			};
			return job;
		}
		else
		{
			let wall = this.room.memory.structures.wallsArray[0];
			let job = {
				targetID: wall.id,
				type: "repair"
			};
			return job;
		}
	},

	Creep.prototype.runMaintainer = function ()
	{
		if(this.room.storage)
		{
			if(this.room.memory.DEFCON == 5)
			{
				if (this.memory.currentTask == "Getting Energy" || this.memory.currentTask == null)
				{
					if(this.carry[RESOURCE_ENERGY] != this.carryCapacity)
					{
						this.memory.currentTask = "Getting Energy";
						this.getEnergyFromStorage();
					}
					else
					{
						this.memory.currentTask = "Working";
					}
				}

				if (this.memory.currentTask == "Working")
				{
					if (this.memory.job != null)
					{
						switch (this.memory.job.type)
						{
							case "repair":
								this.repairDefense();
								break;
							default:
						}
					}
					else
					{
						this.memory.job = this.getMaintainerJob();
					}
				}
			}
		}
		else
		{
			this.suicide();
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



