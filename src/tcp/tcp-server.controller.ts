import { Controller } from '@nestjs/common';

import { Socket } from 'net';
import { TcpServer } from 'src/decorators/tcp-server.decorator';

@TcpServer(4000)
@Controller()
export class TcpServerController {
  handleMessage(data: any, socket: Socket) {
    console.log(`Received JSON message: ${JSON.stringify(data)}`);

    const response = {
      status: 'success',
      receivedData: data,
    };

    socket.write(JSON.stringify(response));
  }
}
