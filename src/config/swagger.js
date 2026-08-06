const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: "1.0.0",
            description: 'Production Ready Task Manager API'
        },
         servers: [
             { url: "https://task-manager-api-pro.vercel.app/api-docs", description: 'Production Server' },
            {
                url: "http://localhost:3000/api",
                description: 'Local Server'
            },   

        ],
         components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }
    },
    apis: [
        path.join(__dirname, '..', 'routes', 'auth.route.js'),
        path.join(__dirname, '..', 'routes', 'task.route.js')
    ]
}


const swaggerSpec= swaggerJsdoc(options);

module.exports =swaggerSpec;