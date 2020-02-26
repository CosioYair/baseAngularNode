-------------- SETUP --------------

*  Run in bash [npm i]
*  Create file [.env] in root directory using the following structure:
    PORT = 3000
    DEVELOPMENT_DATABASE_URL = "[postgres]://[user]:[password]@[host]:[port]/[database]"
    SECRET_KEY = "[secret key]"

    MAILER_HOST = "smtp.gmail.com"
    MAILER_PORT = 465
    APP_EMAIL = "[email]"
    APP_EMAIL_PASSWORD = "[password]"
    APP_EMAIL_FROM = "[from]"

    FACEBOOK_APP_ID = "394106754739805"
    FACEBOOK_APP_SECRET = "fbee54876bcb32849439472e5d3ca999"
    FACEBOOK_APP_CALLBACK_URL = "http://localhost:3000/api/auth/facebook/callback"

    GOOGLE_CLIENT_ID = "905633121488-0239m0hfpkn9107slea0i27oqjdh99pt.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "P71fCpO-ndl5UCDR4AyGre2a"
    GOOGLE_CLIENT_CALLBACK_URL = "http://localhost:3000/api/auth/google/callback"

*  Run in bash [sequelize db:migrate]
*  Run in bash [npm run start]

-----------------------------------

-------------- SEQUELIZE --------------

  Associations: 
    https://stackoverflow.com/questions/22958683/how-to-implement-many-to-many-association-in-sequelize
    http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html

  Operators: 
    http://docs.sequelizejs.com/manual/tutorial/querying.html
  
  Commands: 

    sequelize model:create --name User --attributes name:string,email:string

    db:migrate                        Run pending migrations
    db:migrate:schema:timestamps:add  Update migration table to have timestamps
    db:migrate:status                 List the status of all migrations
    db:migrate:undo                   Reverts a migration
    db:migrate:undo:all               Revert all migrations ran
    db:seed                           Run specified seeder
    db:seed:undo                      Deletes data from the database
    db:seed:all                       Run every seeder
    db:seed:undo:all                  Deletes data from the database
    db:create                         Create database specified by configuration
    db:drop                           Drop database specified by configuration
    init                              Initializes project
    init:config                       Initializes configuration
    init:migrations                   Initializes migrations
    init:models                       Initializes models
    init:seeders                      Initializes seeders
    migration:generate                Generates a new migration file       [aliases: migration:create]
    model:generate                    Generates a model and its migration  [aliases: model:create]
    seed:generate                     Generates a new seed file            [aliases: seed:create]

    Options:
    --version  Show version number                                         [boolean]
    --help     Show help                                                   [boolean]

-----------------------------------