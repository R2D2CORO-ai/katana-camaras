
const express = require('express');
const app = express();
let clientesConectados = []
app.use(express.static(__dirname))
const server = app.listen(4444, () => {
    console.log('server activated !')
})
var fs = require('fs');

/********************************************************** Conexiones Socket */
var io = require('socket.io')(server); //Bind socket.io to our express server.
io.on('connection', (socket) => {//Un Socket para todos los requerimientos a postgres
    socket.on('plc_response', function (responsevalue){
        plcdatasender2(responsevalue)
    })
    socket.on('picsaving', async function (dataURI, valor, p, status) { // se le mandan los parametros no importa si no tienen los mismos nombres
        await savingpic(dataURI, valor, p, status); //espera la funcion savingpic con los parametros 
    })
    socket.on('picsaving2', async function (dataURI, serial, sqty) { // se le mandan los parametros no importa si no tienen los mismos nombres
        await savingpic2(dataURI, serial, sqty); //espera la funcion savingpic con los parametros 
        //console.log("recibe", serial);
    })
    socket.on('renombrasnr', function (serial) { // conexion con main_script
        renombraF(serial);
    })
    socket.on('logsaving', function (logarray, serial) { // conexion con main_script
        savinglog(logarray, serial);
    })
})
//************************************************************** TCP/IP  **************************************/
var net = require('net')
var tcpipserver = net.createServer(function (connection) {
    console.log('TCP client connected');
    //connection.write('Handshake ok!');
    clientesConectados=[]
    clientesConectados.push(connection)
    connection.on('data', function (data) { io.emit('Sequence_start', data.toString());console.log(data.toString())})
})
function plcdatasender2(responsevalue) {
    var matrixtostring = responsevalue.toString()
    clientesConectados.forEach((socket) => {
        console.log(matrixtostring+'write')
        estadoconexion = socket.readyState
        if (estadoconexion == 'closed') {
            console.log("Puerto de PLC cerrado reintento en 1min...")  
        }
        if (estadoconexion == 'open') {
                socket.write(matrixtostring)
            
        }
    })
}
tcpipserver.listen(40000, function () {
    console.log('PLC Port 40000 listening...')
})
async function savingpic(dataURI, valor, p, status) {
    let filePath;
    const ImageDataURI = require('image-data-uri');
    return new Promise(async resolve => {
        if (p == 0) {
            if (status == 1) {
                filePath = './pruebas/' + 'pass';
            }
            else {
                filePath = './pruebas/' + 'fail';
            }
        }
        else if (p == 1) {
                if (status == 1) {
                    filePath = './pruebas/pruebas_2/' + 'pass';
                }
                else {
                    filePath = './pruebas/pruebas_2/' + 'fail';
                }
            }
        else if (p == 2) {
                if (status == 1) {
                    filePath = './pruebas/pruebas_3/' + 'pass';
                }
                else {
                    filePath = './pruebas/pruebas_3/' + 'fail';
                }
            }
            //Ruta de las carpetas por serial
        else {
            filePath = './pruebas/' + 2;//Ruta de las carpetas por serial
        }
        let filevalidation = fs.existsSync(filePath);
        if (filevalidation) {
            filePath = '' + filePath + '/' + valor + '';

            ImageDataURI.outputFile(dataURI, filePath).then(res => console.log(res));
        }
        else {
            fs.mkdir(filePath, (error) => {
                console.log(error);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
                filePath = '' + filePath + '/' + valor + '';
                ImageDataURI.outputFile(dataURI, filePath).then(res => console.log(res));
            });
        }
    });//Cierra Promise
}
/*********************************************************** Guardao de imagenes */
//Guardado de imagenes carpeta Katana_Samples
async function savingpic2(datauri, serial, sqty) {
    let filePath;
    const ImageDataURI = require('image-data-uri');
    return new Promise(async resolve => {
        let filePath = './katana_samples/' + serial + '';//Ruta de las carpetas por serial
        let filevalidation = fs.existsSync(filePath);
        if (filevalidation) {

            filePath = '' + filePath + '/' + sqty + '';
            ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
        }
        else {
            fs.mkdir(filePath, (error) => {
                    console.log(error);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
                filePath = '' + filePath + '/' + sqty + '';
                ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
                console.log("Directorio creado");
            });
        }
    });//Cierra Promise

}
async function renombraF(serial) {
    fs.rename('C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial,
        'C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial + '_F',
        function (err) {
            if (err)
                console.log('Error de renombramiento');
        });
}
async function savinglog(logarray, serial) {
    let logpath = 'C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial + '/log.txt';
    fs.writeFile(logpath, logarray, function (err) {
        if (err) throw err;
    });
}
