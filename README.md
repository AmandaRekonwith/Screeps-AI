# Screeps-AI
<img src="http://cdn.akamai.steamstatic.com/steam/apps/464350/header.jpg?t=1494837632">
My evolving AI for Screeps

Welcome, welcome. Come one, come all.
<br/>This is my 'AI' code for the wonderfully awesome game Screeps (https://screeps.com/).

I intend for this to be stolen, or used in any capacity (but, preferably not to exploit and destroy my civilization!).

I am an amateurish programmer, or a jack-of-all-trades, if you will. Master of none, though PHP and Flex are my forte.
<br/>That said, I hope this code provides a second stepping stone for anyone looking to delve deeper into this game.
<br/>My goal is for this to be a fully automated 'bot', like the work of TooAngel (https://github.com/TooAngel/screeps),
as well as incorporating some funny elements, such as screeps talking to one another, or singing as they work.
<br/>Additionally, I hope that my code is as straightforward and understandable as possible.
I am not a programmer that focuses on optimization, but rather, cohesive, well-organized, and commented code.

<b>NOTE:</b> If you are looking for a one-stop shop, install, and conquer the universe codebase that is cryptically written in order to make the best use of memory and cpu usage, I advise you to look elsewhere.

Currently this code is in a primordial state.
I have gotten to this point by first following along with thpion's awesome youtube 'noob guide' series
(https://youtu.be/edBMmOAfJ-Q?list=PL0EZQ169YGlor5rzeJEYYPE3tGYT2zGT2),
<br/>and then incorporating the 'Advanced Grunt Usage' guide with Screeps (http://docs.screeps.com/contributed/advanced_grunt.html).

.. And I am continuing to grow from there.

-----------------------------------------------
Briefly, what my code currently does:

1. It automatically harvests resources, semi-efficiently. 
2. It upgrades the room controller.
3. It spawns progressively larger creeps depending on the room level.
4. It builds extensions automatically (and deletes them if the room level drops)
5. Worker creeps automatically respond and construct placed job sites, but do not yet automate the construction of roads, containers, storage, turrets, (basically anything except extensions at this point).

That's about it for right now . .  . NOTE: CODING FOR DEFENSIVE MEASURES HAS BEEN SCRAPPED AT THE MOMENT while I rework it.

-----------------------------------------------
I hope that my code is easily understandable and extensible for anyone else's implementation. 
With that said, what follows is a brief description of HOW my code does what it does.

I am trying to adhere to a rough MVC (model view controller) development framework.

code logic flow goes from the,
main.js -> which instantiates the 'BrainController'.

The brain 'processes stimuli' (aka, makes sure everything is correctly stored in memory, and scans the environment for changes),
then 'takes action' (runs the creeps).

At a slightly lower level there is a Rooms and Room controller, Jobs, and Creeps controller.

The 'rooms' controller uses the Game.creeps, and Game.rooms, controller to instantiate the arrays of information in memory.
The room controller scans the individual objects present in the room.

Most actions are handled by overloading the Creep prototype with a number of different types of creeps and job activities.
These are denoted by the folder and array structure in found in memory.

-----------------------------------------------
CURRENT HANGUPS / PROBLEMS... 

Since I've reworked my code this last time, I completely reworked how a number of tasks function.
This has resulted in multiple more items being stored in memory and thus the code relying on memory objects.

I'm currently struggling to shift my currently running code on the main screeps server with all of the changes I have made.
The new code works in the simulation, but does not work if thrown into a running environment as of yet.
I need to debug some memory storage issues to make it simply 'work' once activated in a Screeps branch folder.


Some hangups I have had in the process of getting to this point, that are not explicitly described in the resources listed above:

1.
I almost shelved this game after discovering that Screeps does not allow requiring folders from a nested folder structure.
TooAngel and thPion both get around this limitation by requiring files that are separated by a period.
For instance, instead of 'require('controller/room.js')' they substitute a period 'require('controller.room.js').
... However, I found this naming convention to be ugly and cumbersome.

FORTUNATELY, smarter people than I worked out a way to 'flatten' the structure of nested code by using a Grunt command to replace the '/' character in filenames with a '_\'.

UNFORTUNATELY, I am not knoledgeable enough at the moment to write a custom Grunt / javascript compiling function to parse all the code that I have written and replace any '/' existing in a require statment with an underscore '_'.

THUS, the code that I write currently includes requires that use an underscore in require statments that then make sense to Screeps at runtime after the Grunt command replaces the nested folder structures with underscores.

2.
Related to the first 'hangup', having code that 'requires' files that don't technically exist yet, means local code changes aren't immediately reflected in the Screeps game, unlike when you edit code directly in the scripts folder local to your machine.

This is both a blessing and curse. I actually prefer it to not update the game every time I type as the game 'hangs' whenever it encounters a critical error in coding 
(which often happens when writing new features).

Additionally, I've found creating a workspace using the directory in which the game scripts reside '...\AppData\Local\Screeps\scripts\screeps.com\default' in my case, in either 'Sublime Text' (https://www.sublimetext.com/) or Jet Brains Web Storm (https://www.jetbrains.com/webstorm/) would cause problems when I went to initiate the Grunt commands explained in the resource above (http://docs.screeps.com/contributed/advanced_grunt.html).
Frequently Screeps would erase all of my code in the folder upon logging in for an unexplained reason, usually before prompting whether I wanted to 'replace the local scripts with remote scripts'.

For this reason, I've found it much easier to create a workspace at 'C:\Screeps' (or anywhere outside of the main directory),
and use the Grunt screeps add-on to push changes to the server from the command line.
Then, you can create a shortcut that uses a key binding (in my case, ctrl-alt-s) to push changes to the game.
Creating a shorcut using a key binding on Windows 10 is a trivial affair (see: https://www.laptopmag.com/articles/create-keyboard-shortcuts-windows-10). 
On mac, I had done it before using a program called spark (https://www.shadowlab.org/softwares/spark.php).

NOTE: This method does NOT WORK with a private server.
The referenced Grunt guide includes instructions on how to work with a private server using RSync, but I have not gotten this working yet. I highly recommend www.screepting.tk as an alternative to the main game server for those not wishing to buy a subscription or looking for a slightly better testing ground than the simulation sandbox. 

-------------------------------------------------

Thanks for reading!
<br/>I will post updates to what I am working on at the very top of this document.

Let me know if you have any questions, comments, or concerns!
<br/>My email is AmandaRekonwit@gmail.com. My in-game name is AmandaRekonwith.


# Recent Updates
<br/><b>07/01/2017</b> - Fat jobs, FatHarvesters, and onwards...
<br/>Big update.

Midway through my complete revision of jobs and roles.

Game scans rooms for 'fat jobs', meaning jobs where the creep is designed to sit and never move.
Looks for two containers next to an energy source to initiate production of a 'FatHarvester'
Once found, it is added to an array in memory.
Goes to 'job site' and fills and repairs both containers indefinitely.

I've decreased the 'maximum' number of creeps and maximum number of harvesters by 2 * however many active fat harvesters there are.

Now I need to develop a hauler to empty the containers.
a 'FatUpgrader' to sit next to the storage unit and continuously upgrade the controller.
Haulers, that take energy back and forth from the containers to the extensions and storage unit,

and a new system of job assignments that any basic or 'skinny' creep can perform.

<br/><b>06/27/2017</b> - Moving towards a different job/role assignment system
<br/> I added a scanCreeps function to the rooms controller which creeps into a sequential array stored in Game.memory.creeps, with the creep soonest to die first.
<br/>
This array will likely become two arrays next commit.
<br/>Game.memory.skinnyCreeps[]  and
<br/>Game.memory.fatCreeps

I am working towards a job system divided into those two creep categories.
Fat creeps are intended to never move, while skinny creeps run around performing duties assigned by the jobs controller.

I am phasing this in, and phasing out my current 'role'-based system simultaneously, so as not to ruin my current base on the main server.

I realize it would be better to just test in a sandbox, but what fun is that?

<b>06/25/2017</b> - Project status update
<br/>I am working on making my screeps work more intelligently.
<br/>Current tasks are to:
<br/>- Replace the hardcoded numbers of creeps and 'roles' in their entirety with a prioritized job assignment system.
<br/>- Add a mechanism that uses the room's GCL level and the number of total spaces around energy sources to determine how many and of what size creep to spawn to operate an efficient energy managing economy.
<br/>
<br/>Today added:
<br/>- A Rooms controller which creates a multidimensional array containing a quickly accessible list of the type of terrain at each square in the room. This is accessible in the Game.memory.terrainArray. 
<br/>It expects an array of x and y coordinates and returns a number between 1 and 3. 1 being plain, 2, swamp, 3 wall.
<br><b>NOTE:</b> This is a first step towards more intelligent energy resource harvesting as well as creep pathfinding
(currently all creeps use the highly inefficient 'creep.pos.findClosestByPath()' function to navigate to work targets.
