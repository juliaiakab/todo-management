using { todo as td } from '../db/schema';

service TodoManagementService {
  @restrict: [
  {
    grant: '*',  
    to: ['creator', 'jobscheduler']
  },
  {
    grant: 'READ', 
    to: ['consumer'] 
  }
]
@odata.draft.enabled
  entity Tasks as projection on td.Tasks;
  entity Users as projection on td.Users;
  entity Status as projection on td.Status;
  entity TasksToUsers as projection on td.TasksToUsers;

  action checkTasksDueInAWeek();
}