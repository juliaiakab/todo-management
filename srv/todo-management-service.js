const cds = require('@sap/cds');
const { getDestination, executeHttpRequest, buildCsrfHeaders } = require("@sap-cloud-sdk/core");
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

const NOTIF_TYPE_KEY = "TaskIsDue";
const NOTIF_TYPE_VERSION = "1.0";
const destinationName = "SAP_Notifications";
const notificationEndpoint = "v2/Notification.svc";
const notificationTypesEndpoint = "v2/NotificationType.svc";


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

    this.before(['CREATE'], Tasks, async (req) => {
        const currentUser = req.user.id; 
        //const user = await SELECT.one.from(Users).where({ ID: currentUser }); // local
        const user = await SELECT.one.from(Users).where({ email: currentUser }); // prod
        if (user) {
            req.data.owner_ID = user.ID;
        } else {
            req.reject(403, `User ${currentUser} not found in the system.`);
        }
    });
     
    this.on('checkTasksDueInAWeek', async () => {
        const today = new Date();
        const oneWeekFromToday = new Date();
        oneWeekFromToday.setDate(today.getDate() + 7);

        const tasksDueInAWeek = await SELECT.from(Tasks).where({ dueDate: oneWeekFromToday });

        if (tasksDueInAWeek.length) {
        tasksDueInAWeek.forEach(async task => {
            const usersAssignedToTask = (await SELECT('assignee_ID').from(TasksToUsers).where({ task_ID: task.ID})).map(ttu => ttu.assignee_ID);
            const userEmails = (await SELECT.from(Users).columns('email').where({ ID: { in: usersAssignedToTask }})).map(user => user.email);
            await sendNotification(userEmails, task.title);
        });
        }
    });


    async function sendNotification(assigneEmails, title) {
        console.log('in send notification');
        try {
            await publishTaskDueNotification({ title: title, recipients: assigneEmails })
        } catch (e) {
            if (e.response) {
                console.error(`${e.response.statusText} (${e.response.status}): ${JSON.stringify(e.response.data.error.message)}.`)
            } else {
                console.error(e)
            }
        }
    }

    async function publishTaskDueNotification(notification) {
        const notifTypes = await getNotificationTypes();
        const notifType = notifTypes.find(nType => nType.NotificationTypeKey === NOTIF_TYPE_KEY && nType.NotificationTypeVersion === NOTIF_TYPE_VERSION);
        if (!notifType) {
            console.log(`Notification Type of key ${NOTIF_TYPE_KEY} and version ${NOTIF_TYPE_VERSION} was not found. Creating it...`);
            await postNotificationType(createNotificationType());
        }
        return await postNotification(createNotification(notification));
    }
    
    async function getNotificationTypes() {
        const notifServiceDest = await getDestination(destinationName);
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationTypesEndpoint}/NotificationTypes`,
            method: "get"
        });
        return response.data.d.results;
    }

    async function postNotificationType(notificationType) {
        const notifServiceDest = await getDestination(destinationName);
        const csrfHeaders = await buildCsrfHeaders(notifServiceDest, { url: notificationTypesEndpoint });
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationTypesEndpoint}/NotificationTypes`,
            method: "post",
            data: notificationType,
            headers: csrfHeaders,
        });
        return response.data.d;
    }

    async function postNotification(notification) {
        const notifServiceDest = await getDestination(destinationName);
        const csrfHeaders = await buildCsrfHeaders(notifServiceDest, { url: notificationEndpoint });
        const response = await executeHttpRequest(notifServiceDest, {
            url: `${notificationEndpoint}/Notifications`,
            method: "post",
            data: notification,
            headers: csrfHeaders,
        });
        return response.data.d;
    }

    function createNotificationType() {
        return {
            NotificationTypeKey: NOTIF_TYPE_KEY,
            NotificationTypeVersion: NOTIF_TYPE_VERSION,
            Templates: [
                {
                    Language: "en",
                    TemplatePublic: "Task is Due",
                    TemplateSensitive: "Task '{{title}}' Due",
                    TemplateGrouped: "Task Update",
                    TemplateLanguage: "mustache",
                    Subtitle: "Your task with the title '{{title}}' is due in a week."
                }
            ]
        }
    }

    function createNotification({ title, recipients }) {
        return {
            OriginId: "task-is-due-warning",
            NotificationTypeKey: NOTIF_TYPE_KEY,
            NotificationTypeVersion: NOTIF_TYPE_VERSION,
            NavigationTargetAction: "display",
            NavigationTargetObject: "masterDetail",
            Priority: "Medium",
            ProviderId: "",
            ActorId: "",
            ActorType: "",
            ActorDisplayText: "",
            ActorImageURL: "",
            Properties: [
                {
                    Key: "title",
                    Language: "en",
                    Value: title,
                    Type: "String",
                    IsSensitive: false
                }
            ],
            Recipients: recipients.map(recipient => ({ RecipientId: recipient })),
        }
    }
})