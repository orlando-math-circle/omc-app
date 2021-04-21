// @WebSocketGateway(80, { namespace: 'events' })
// export class EventAttendanceGateway {
//   @SubscribeMessage('join')
//   onJoin(
//     @MessageBody() { eventId }: JoinEventRoomDto,
//     @ConnectedSocket() client: Socket,
//   ) {
//     client.join(`event-${eventId}`)
//   }
// }

// // Elsewhere...A user was just registered

// @WebSocketServer()
// server: Server;

// this.server.emit(`event-${registration.event.id}`, registration)
