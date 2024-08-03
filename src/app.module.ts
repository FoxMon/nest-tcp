import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TcpServerController } from './tcp/tcp-server.controller';
import { TcpServerModule } from './tcp/tcp-server.module';

@Module({
  imports: [DiscoveryModule, TcpServerModule],
  controllers: [TcpServerController],
})
export class AppModule {}
