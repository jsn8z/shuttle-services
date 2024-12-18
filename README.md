Go to render and create a static site(frontend) using node.js, which is named shuttle-services-5 or shuttle-services-frontend. 

Build & Deploy : 
Repository : use github repo like this :  https://github.com/jsn8z/shuttle-services
Branch : main
Git Credentials : jsn8z@umsystem.edu
Root Directory : ./frontend
Build command : frontend/$ npm install && npm run build 
Publish Directory : frontend/build

Environmental Variables:
NODE_ENV = production node server.js
REACT_APP_API_URL = https://shuttle-services-3.onrender.com  (use the backend url here)

Deploy


Now create backend :

Name : shuttle-services-backend
Git Credentials : jsn8z@umsystem.edu
Root Directory : ./shuttle-service-backend
Build command : shuttle-service-backend/$ npm install
start command : shuttle-service-backend/$ npm start

Environmental variables : 
FRONTEND_URL = https://shuttle-services-5.onrender.com (use the frontend url here)
MONGO_URI = mongodb+srv://jsn8z:jnsz8%4099@cluster0.wrynz.mongodb.net/new1?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV = production

Deploy

Now the frontend is running on https://shuttle-services-5.onrender.com
backend is running on port : https://shuttle-services-3.onrender.com
and connected to cloud MongoDB atlas.
we can see all the bookings on https://shuttle-services-3.onrender.com/api/bookings



.env textfile to be added in local:

shuttle-services-backend/.env

    MONGO_URL=mongodb://localhost:27017/shuttle-service
    NODE_ENV=development
    PORT=5000
    FRONTEND_URL = http://localhost:3000
    # FRONTEND_URL=https://shuttle-services-5.onrender.com


frontend/.env

    NODE_ENV = development
    # NODE_ENV = production node server.js

    REACT_APP_API_URL = http:/localhost:5000
    # REACT_APP_API_URL = https://shuttle-services-3.onrender.com

    PORT=3000

.gitignore

    # Ignore all node_modules directories
    # **/node_modules/

    # Ignore build directories
    frontend/build/
    shuttle-service-backend/build/

    # Ignore environment variable files
    # *.env

    # Ignore log files
    *.log


frontend/.gitignore

    # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
    # dependencies
    # /node_modules
    /.pnp
    .pnp.js

    # testing
    /coverage

    # production
    /build

    # misc
    .DS_Store
    .env.local
    .env.development.local
    .env.test.local
    .env.production.local

    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*