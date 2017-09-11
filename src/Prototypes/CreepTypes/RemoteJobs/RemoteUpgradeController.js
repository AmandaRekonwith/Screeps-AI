module.exports = function ()
{
	Creep.prototype.runRemoteUpgradeController = function ()
	{
		let flag = Game.flags[this.memory.job.targetID];
		if (flag)
		{
			let creepPosition = this.pos;

			if (creepPosition.x+1 != flag.pos.x)
			{
				let action = this.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			else
			{
				let structure = this.room.lookForAt(LOOK_STRUCTURES, flag.pos);
				if (structure)
				{
					let action = this.upgradeController(this.room.controller);
				}
			}


			if(this.carry[RESOURCE_ENERGY] == 0)
			{
				this.memory.currentTask = null;
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}