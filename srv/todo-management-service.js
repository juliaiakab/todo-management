const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Tasks, Users, TasksToUsers, Status } = this.entities;

    // // this.on('READ', 'Tasks', async (req) => {
    // //     const userId = req.user.id;
    // //     const taskId = req.params[0]?.ID;
    // //     console.log( taskId);
    // //     if (taskId) {
    // //         const task = await SELECT.one.from(Tasks).where({ ID: taskId });
    // //         task.status = await SELECT.one.from(Status).where({ code: task.status_code });
    // //         return task;
    // //     } else {
    // //         const tasksAssignedToLoggedInUser = await SELECT('task_ID').from(TasksToUsers).where({ assignee_ID: userId });
    // //         const taskIds = tasksAssignedToLoggedInUser.map(row => row.task_ID);
    // //         if (taskIds.length > 0) {
    // //             const tasks = await SELECT.from(Tasks).where({ ID: taskIds });
    // //             tasks.forEach(async t => {
    // //                 t.status = await SELECT.one.from(Status).where({ code: t.status_code });
    // //                 t.owner = await SELECT.one.from(Users).where({ ID: t.owner_ID });
    // //             })
    // //             console.log(tasks);
    // //             return tasks;
    // //         } else {
    // //             return [];
    // //         }
    // //    }
    // // });

    // this.before(['CREATE', 'UPDATE'], Tasks, async (req) => {
    //     const userEmail = req.user.id; 
    //     const user = await SELECT.one.from(Users).where({ ID: userEmail }); // local
    //     // const user = await SELECT.one.from(Users).where({ email: userEmail }); // prod
    //     if (user) {
    //         req.data.owner_ID = user.ID;
    //         console.log(userEmail);
    //         console.log('---------------------------------------');
    //     //    await sendNotification(userEmail, { title: 'title'} )
    //     } else {
    //         req.reject(403, `User ${userEmail} not found in the system.`);
    //     }
    // });

    // this.after("READ", Tasks, async (data, req) => {
    //     let tasks = Array.isArray(data) ? data : [data];
    //     tasks.forEach(async (task) => {
    //         if (task.status_code !== '') {
    //             const dueDate = new Date(task.dueDate);
    //             const currentDate = new Date();

    //             const difference = dueDate - currentDate;
    //             const daysDifference = difference / (1000 * 60 * 60 * 24);

    //             if (daysDifference < 7 && task.status_code !== 'D') {
    //                 task.title += ' - Hurry up, date is due!';
    //             }
    //         }
    //     })
    //     console.log(tasks);
    //     return tasks;
    // });

     
    // this.on('checkTasksDueInAWeek', async () => {

    //     const today = new Date();
    //     const oneWeekFromToday = new Date();
    //     oneWeekFromToday.setDate(today.getDate() + 7);

    //     const tasksDueInAWeek = await SELECT.from(Tasks).where({ dueDate: oneWeekFromToday });

    //     if (tasksDueInAWeek.length) {
    //     tasksDueInAWeek.forEach(async task => {
    //       //  await sendNotification(task.owner_ID, task);
    //     });
    //     }
    // });


    // async function sendNotification(owner, task) {
    //     // console.log('sending notification');
    //     // const alert = await cds.connect.to('notifications');
    //     // try {
    //     //     const result = await alert.notify({
    //     //         recipients: [owner],
    //     //         priority: "HIGH",
    //     //         title: "Your task is due!",
    //     //         description: `Your task, titled ${task.title}, is due in a week.`
    //     //     });
    //     //     console.log('Notification sent successfully:', result);
    //     // } catch (error) {
    //     //     console.error('Notification failed:', error);
    //     // }
    // }
})