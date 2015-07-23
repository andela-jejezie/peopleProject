'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://heroku_19nrw9t2:mg8k8osem8q07chgodfn4efhev@ds029787.mongolab.com:29787/heroku_19nrw9t2',
  assets: {
    lib: {
      css: [
        'public/lib/angular-gantt/assets/angular-gantt.css',
        'public/lib/angular-gantt/assets/angular-gantt-plugins.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-select/dist/select.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/jquery/dist/jquery.js',
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
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js',
    target_css: [
      'public/modules/**/css/*.css'
    ],
    target_js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ]
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  skilltreeUrl: 'http://skilltree.andela.co/api/users'
};
