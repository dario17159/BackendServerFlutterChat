const { io } = require('../index');

//  Socket message
io.on('connection', client => {

    console.log('Client connected')

    client.on('disconnect', () => {
        console.log('Client disconnected')
    });

    /*   client.on('mensaje', (payload) => {
        console.log('Mensaje!!', payload)

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });
 */

});