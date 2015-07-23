'use strict';

module.exports = {
	app: {
		title: 'calendarize',
		description: 'fullstack',
		keywords: 'mean'
	},
	port: process.env.PORT || 3003,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/angular-gantt/assets/angular-gantt.css',
				'public/lib/angular-gantt/assets/angular-gantt-plugins.css',				
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-ui-select/dist/select.css'
			],
			js: [
			  'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-strap/dist/angular-strap.js',
				'public/lib/angular-strap/dist/angular-strap.tpl.js',
				'public/lib/angular-validation-match/dist/angular-input-match.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-moment/angular-moment.min.js',
				'public/lib/angular-gantt/assets/angular-gantt.js',
				'public/lib/angular-gantt/assets/angular-gantt-plugins.js',
				'public/lib/angular-modal-service/dst/angular-modal-service.js',
				'public/lib/nsPopover/src/nsPopover.js',
				'public/lib/angular-ui-select/dist/select.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-md5/angular-md5.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
