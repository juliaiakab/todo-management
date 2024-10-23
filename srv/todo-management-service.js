const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Tasks, Users, TasksToUsers } = this.entities;

    this.on('READ', 'Tasks', async (req) => {
        const userId = req.user.id;
        const tasksAssignedToLoggedInUser = await SELECT('task_ID').from(TasksToUsers).where({ assignee_ID: userId });
        const taskIds = tasksAssignedToLoggedInUser.map(row => row.task_ID);
        if (taskIds.length > 0) {
            const tasks = await SELECT.from(Tasks).where({ ID: taskIds });
            console.log(tasks);

            return tasks;
        } else {
            return [];
        }
        
    });

    this.before(['CREATE', 'UPDATE'], Tasks, async (req) => {
        const userEmail = req.user.id; 
        const user = await SELECT.one.from(Users).where({ ID: userEmail }); // local
        // const user = await SELECT.one.from(Users).where({ email: userEmail }); // prod
        if (user) {
            req.data.owner_ID = user.ID;
        } else {
            req.reject(403, `User ${userEmail} not found in the system.`);
        }
    });

    this.after("READ", Tasks, (data) => {
        const tasks = Array.isArray(data) ? data : [data];
        tasks.forEach(async (task) => {
            if (task.status_code !== '') {
                const dueDate = new Date(task.dueDate);
                const currentDate = new Date();

                const difference = dueDate - currentDate;
                const daysDifference = difference / (1000 * 60 * 60 * 24);

                if (daysDifference < 7 && task.status_code !== 'D') {
                    task.title += ' - Hurry up, date is due!';
                }
            }
        })
    })

     
    this.on('checkTasksDueInAWeek', async () => {
        const today = new Date();
        const oneWeekFromToday = new Date();
        oneWeekFromToday.setDate(today.getDate() + 7);

        const tasksDueInAWeek = await SELECT.from(Tasks).where({ dueDate: oneWeekFromToday });

        if (tasksDueInAWeek.length) {
        tasksDueInAWeek.forEach(task => {
           // sendNotification(task.owner_ID, task);
        });
        }
    });
})