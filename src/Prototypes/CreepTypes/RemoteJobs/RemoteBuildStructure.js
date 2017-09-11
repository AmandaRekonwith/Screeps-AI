module.exports = function ()
{
	Creep.prototype.runRemoteBuildStructure = function ()
	{
		let flag = Game.flags[this.memory.job.targetID];

		if (flag)
		{
			let creepPosition = this.pos;

			if (creepPosition != flag.pos)
			{
				let action = this.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else
		{
			let constructionSite = Game.getObjectById(this.memory.job.targetID);

			let action = this.build(constructionSite);

			if(action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(constructionSite);
			}
			else
			{
				let action2 = this.upgradeController(this.room.controller);
				if(action2 == ERR_NOT_IN_RANGE)
				{
					this.moveTo(this.room.controller);
				}
			}

			if(this.carry[RESOURCE_ENERGY] == 0)
			{
				this.memory.currentTask = null;
			}
		}
	}
}