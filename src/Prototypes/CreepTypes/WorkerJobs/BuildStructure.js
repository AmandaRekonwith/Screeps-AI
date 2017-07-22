module.exports = function ()
{
    Creep.prototype.buildStructure = function ()
    {
        let constructionSite = Game.getObjectById(this.memory.job.targetID);
        //it's possible that the structure could disappear if construction completes,
        // so check, and then set the current task and job to null if it's gone.
        if (constructionSite)
        {
            let action = this.build(constructionSite);

            if (action == ERR_NOT_IN_RANGE)
            {
                this.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
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