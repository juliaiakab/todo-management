using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';
namespace todo; 

entity Tasks : cuid, managed {  
    owner        : Association to Users;
    title        : String;
    description  : String;
    dueDate      : Date;
    status       : Association to Status default 'N';
    assignees    : Composition of many TasksToUsers on assignees.task = $self;
}

entity Users : cuid { 
    firstName     : String;
    lastName      : String;
    name          : String = firstName || ' ' || lastName;
    email         : String;
    tasks         : Association to many Tasks on tasks.owner = $self;
    assignedTasks : Composition of many TasksToUsers on assignedTasks.assignee = $self; 
}

entity TasksToUsers: cuid {
    assignee: Association to Users;
    task: Association to Tasks;
}

entity Status : CodeList {
    key code: String enum {
        new = 'N';
        in_progress = 'P'; 
        done = 'D'
    };
}
