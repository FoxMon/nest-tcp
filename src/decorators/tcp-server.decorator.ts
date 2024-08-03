import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const TCP_PORT = 'TCP_PORT';

export const TcpServer = (port: number): CustomDecorator<string> => {
  return SetMetadata(TCP_PORT, port);
};
