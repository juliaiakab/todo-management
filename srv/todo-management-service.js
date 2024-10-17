const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(async function() {

    const { Tasks, Users } = this.entities;

    this.before('READ', Tasks, async (req) => {
        const userEmail = req.user.id; 
        console.log(userEmail); 
        const user = await SELECT.one.from(Users).where({ email: userEmail });
        
        if (user) {
            req.query.where({ owner_ID: user.ID });
        } else {
            req.reject(403, `User ${userEmail} not found in the system.`);
        }
    });

    this.before(['CREATE', 'UPDATE'], Tasks, async (req) => {
        const userEmail = req.user.id; 
        const user = await SELECT.one.from(Users).where({ email: userEmail });
        if (user) {
            req.data.owner_ID = user.ID;
        } else {
            req.reject(403, `User ${userEmail} not found in the system.`);
        }
    });
    
    this.after("READ", Tasks, (data) => {
        const tasks = Array.isArray(data) ? data : [data];

        tasks.forEach((task) => {
            if (task.status !== '') {
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
        console.log('scheduler --------------------------------------------------');

        const tasksDueInAWeek = await SELECT.from(Tasks).where({ dueDate: oneWeekFromToday });

        if (tasksDueInAWeek.length) {
        tasksDueInAWeek.forEach(task => {
            sendNotification(task.owner_ID, task);
            
        });
        }
    });

    async function sendNotification(userEmail, task) {
        // const alert = await cds.connect.to('notifications');
        // alert.notify({
        //     recipients: [ userEmail ],
        //     priority: "HIGH",
        //     title: `Reminder: Task "${task.title}" is due soon`,
        //     description: `Hello, your task "${task.title}" is due on ${task.dueDate}. Please complete it before the due date.`
        //   })
        // try {
        //     const options = {
        //         url: 'https://clm-sl-ans-live-ans-service-api.cfapps.us10.hana.ondemand.com',  // Full URL for notification
        //         method: 'POST',
        //         auth: {
        //             username: "julia.iakab@msg.group",   // Use `username` instead of `user` in Axios
        //             password: "Harasytos99__"
        //         },
        //         data: {
        //             "eventType": "myCustomEvent",
        //             "resource": {
        //                 "resourceName": "Your Node.js App",
        //                 "resourceType": "app",
        //                 "tags": {
        //                     "env": "develop environment"
        //                 }
        //             },
        //             "category": "ALERT",
        //             "subject": `Reminder: Task "${task.title}" is due soon`,
        //             "body": `Hello, your task "${task.title}" is due on ${task.dueDate}. Please complete it before the due date.`,
        //         }
        //     };

        //     const response = await axios(options);

        //     console.log('Notification sent successfully:', response.data);
        //     return { success: true, message: 'Notification sent successfully.' };

        // } catch (error) {
        //     console.error('Error sending notification:', error.response ? error.response.data : error.message);
        //     return { success: false, message: 'Failed to send notification.' };
        // }
    }

    // async function sendNotification(userEmail, task) {
    //     var options = {
    //         url: 'https://clm-sl-ans-live-ans-service-api.cfapps.us10.hana.ondemand.com', // Endpoint URL + "/cf/producer/v1/resource-events"
    //         method: 'POST',
    //         auth: {
    //           user: "blibli",
    //           password: "blabla"
    //         },
    //         json: {
    //                 "eventType": "myCustomEvent",
    //                 "resource": {
    //                   "resourceName": "Your Node.js App.",
    //                   "resourceType": "app",
    //                   "tags": {
    //                     "env": "develop environment"
    //                   }
    //                 },
    //                 "category": "ALERT",
    //                 "subject": `Reminder: Task "${task.title}" is due soon`,
    //                 "body": `Hello, your task "${task.title}" is due on ${task.dueDate}. Please complete it before the due date.`,
    //           }
    //       }
    //       request(options, function (error, response, body) {
    //         console.log(response.body);
    
    //         res.send('Send E-mail Notification.');
    //     });
    // }

    // async function sendNotification(userEmail, task) {
    //     console.log('sending notification --------------------------------------------------');
    //     const notificationService = new NotificationService({
    //         service: 'todo-management-notifications',
    //         credentials: await this.getServiceCredentials('todo-management-notifications')
    //     });
        
    //     try {
    //         await notificationService.sendEmail({
    //         to: userEmail,
    //         subject: `Reminder: Task "${task.title}" is due soon`,
    //         body: `Hello, your task "${task.title}" is due on ${task.dueDate}. Please complete it before the due date.`,
    //         });
    //         return { success: true, message: 'Email sent successfully!' };
    //     } catch (error) {
    //         console.error('Error sending email:', error);
    //         return { success: false, message: 'Failed to send email' };
    //     }
    // };
  // async function sendNotification(userEmail, task) {
  //   const alertNotification = await cds.connect.to('todo-management-notifications');
  
  //   await alertNotification.send({
  //     messageType: "EMAIL",
  //     payload: {
  //       email: {
  //           subject: `Reminder: Task "${task.title}" is due soon`,
  //           body: `Hello, your task "${task.title}" is due on ${task.dueDate}. Please complete it before the due date.`,
  //           recipients: [userEmail]
  //         }
  //     }
  //   });
  // }
})