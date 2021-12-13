import swaggerJSDoc from "swagger-jsdoc";

export default swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        version: "2.0",
        components: {},
        info: {
            title: "API для курса 'Разработка Web приложений'",
            version: "1.0",
            description: "Форум обсуждения новостей о программировании"
        },
        servers: [
            {
                url: "http://localhost:8080",
            }
        ],
        basePath: "/api/v1",
    },
    apis: ["src/backend/Routers/*.ts"]
})