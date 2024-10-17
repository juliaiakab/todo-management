sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'tm/todomanagement/test/integration/FirstJourney',
		'tm/todomanagement/test/integration/pages/TasksList',
		'tm/todomanagement/test/integration/pages/TasksObjectPage'
    ],
    function(JourneyRunner, opaJourney, TasksList, TasksObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('tm/todomanagement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTasksList: TasksList,
					onTheTasksObjectPage: TasksObjectPage
                }
            },
            opaJourney.run
        );
    }
);