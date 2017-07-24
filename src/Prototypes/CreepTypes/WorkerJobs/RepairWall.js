module.exports = function ()
{
    Creep.prototype.repairWall = function ()
    {
        let wall = Game.getObjectById(this.memory.job.targetID);
        //it's possible that the structure could disappear if construction completes,
        // so check, and then set the current task and job to null if it's gone.
        if (wall)
        {
            let action = this.repair(wall);

            if (action == ERR_NOT_IN_RANGE)
            {
                this.moveTo(wall, {visualizePathStyle: {stroke: '#ffffff'}});
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