import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { createServer, Socket } from 'net';
import { TCP_PORT } from 'src/decorators/tcp-server.decorator';

@Module({
  imports: [DiscoveryModule],
})
export class TcpServerModule implements OnModuleInit {
  private readonly logger = new Logger(TcpServerModule.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();
    this.logger.log(`Found ${providers.length} providers`);

    for (const provider of providers) {
      const instance = provider.instance;
      if (!instance) continue;

      const port = this.reflector.get<number>(TCP_PORT, instance.constructor);
      if (port) {
        this.logger.log(
          `Starting TCP server on port ${port} for ${instance.constructor.name}`,
        );
        this.createTcpServer(instance, port);
      }
    }
  }

  private createTcpServer(instance: any, port: number) {
    const server = createServer((socket: Socket) => {
      socket.on('data', (data) => {
        try {
          const message = JSON.parse(data.toString().trim());
          if (instance.handleMessage) {
            instance.handleMessage(message, socket);
          } else {
            this.logger.warn(
              `No handleMessage method found on ${instance.constructor.name}`,
            );
          }
        } catch (error) {
          this.logger.error(`Invalid JSON received: ${error.message}`);
          socket.write(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });

      socket.on('error', (err) => {
        this.logger.error(`Socket error: ${err}`);
      });
    });

    server.listen(port, () => {
      this.logger.log(`TCP server is listening on port ${port}`);
    });
  }
}
