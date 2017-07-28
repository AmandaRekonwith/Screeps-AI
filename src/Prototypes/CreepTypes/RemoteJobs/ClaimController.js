module.exports = function ()
{
	Creep.prototype.runClaimController = function ()
	{
		if(this.memory.job)
		{
			if (Game.flags[this.memory.job.targetID])
			{
				let flag = Game.flags[this.memory.job.targetID];

				if (flag)
				{
					let creepPosition = this.pos;

					if (creepPosition !== flag.pos)
					{
						let action = this.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});

						let structure = this.room.lookForAt(LOOK_STRUCTURES, flag.pos);
						if (structure)
						{
							let action = this.claimController(this.room.controller);
						}
					}
				}
				else
				{
					this.memory.job = null;
				}
			}
		}
	}
}