//@ui5-bundle tm/todomanagement/Component-preload.js
sap.ui.require.preload({
	"tm/todomanagement/Component.js":function(){
sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("tm.todomanagement.Component",{metadata:{manifest:"json"}})});
},
	"tm/todomanagement/i18n/i18n.properties":'# This is the resource bundle for tm.todomanagement\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Todo Management Application\n\n#YDES: Application description\nappDescription=\n\n#XFLD,45\nflpTitle=Task Management\n',
	"tm/todomanagement/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"tm.todomanagement","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.15.1","toolsId":"d2a3d330-249c-46ac-ac43-7feebec2af39"},"dataSources":{"mainService":{"uri":"odata/v4/todo-management/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}},"crossNavigation":{"inbounds":{"tasks-display":{"semanticObject":"tasks","action":"display","title":"{{flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.129.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"tm.todomanagement.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{},"routes":[{"pattern":":?query:","name":"TasksList","target":"TasksList"},{"pattern":"Tasks({key}):?query:","name":"TasksObjectPage","target":"TasksObjectPage"}],"targets":{"TasksList":{"type":"Component","id":"TasksList","name":"sap.fe.templates.ListReport","options":{"settings":{"contextPath":"/Tasks","variantManagement":"Page","navigation":{"Tasks":{"detail":{"route":"TasksObjectPage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"type":"ResponsiveTable"}}},"initialLoad":"Enabled"}}},"TasksObjectPage":{"type":"Component","id":"TasksObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"contextPath":"/Tasks","navigation":{}}}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"tasks"}}'
});
//# sourceMappingURL=Component-preload.js.map
