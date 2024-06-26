import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { ClientRepository } from './repositories/client.repository.js';
import { ClientRouter } from './routes/client.routes.js';
import { ClientService } from './services/client.service.js';
import { ErrorHandler } from './util/error-handler.js';

export class App extends Application {
    @dep() private mongodb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(ClientService);
        mesh.service(ClientRepository);

        mesh.service(ErrorHandler);

        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(ClientRouter);

        return mesh;
    }

    override async beforeStart() {
        await this.mongodb.start();
        await this.httpServer.startServer();
    }

    override async start() {
        await super.start();
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        await this.mongodb.stop();
    }

}
