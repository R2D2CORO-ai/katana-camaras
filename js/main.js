
let boxpoint = []
let boxpointcalis = []
let arryboth = []
let logarray = []
let coord1 = []
let coord2 = []
let coord3 = []
let bladeA = []
let pass1 
let fail0 
let serial
let resultado
let fullimage = document.getElementById('CanvasFHD')
let fullimagectx = fullimage.getContext('2d')
let fullimage1 = document.getElementById('CanvasFHD1')
let fullimagectx1 = fullimage1.getContext('2d')
let fullimage2 = document.getElementById('CanvasFHD2')
let fullimagectx2 = fullimage2.getContext('2d')
let statusf
let blade1
let blade2
let blade3
let blade4
let blade5
let blade6
let imagen
let serialNumberModify = document.getElementById('sn')
let currentProcess = document.getElementById('currentProcess')
let recortito = document.getElementById('Canvascut')
let recortitoctx = recortito.getContext('2d')
let recortito1 = document.getElementById('Canvascut1')
let recortitoctx1 = recortito1.getContext('2d')
let recortito2 = document.getElementById('Canvascut2')
let recortitoctx2 = recortito2.getContext('2d')
let recortito3 = document.getElementById('Canvascut3')
let recortitoctx3 = recortito3.getContext('2d')
let recortito4 = document.getElementById('Canvascut4')
let recortitoctx4 = recortito4.getContext('2d')
let recortito5 = document.getElementById('Canvascut5')
let recortitoctx5 = recortito5.getContext('2d')
const video = document.querySelector('video')

let canvasArray=[recortito,recortito1,recortito2,recortito3,recortito4,recortito5]
let model = new cvstfjs.ObjectDetectionModel()
let model2 = new cvstfjs.ObjectDetectionModel()
let model3 = new cvstfjs.ObjectDetectionModel()
let model4 = new cvstfjs.ClassificationModel();
let model5 = new cvstfjs.ClassificationModel();
let model6 = new cvstfjs.ClassificationModel();
let image1= new Image()
//image1.src='/muestras/0.jpeg'
let image2= new Image()
//image2.src='/muestras/1.jpeg'
let image3= new Image()
//image3.src='/muestras/2.jpeg'
//--------------------------------------- datos fecha ------------------------//
 //------------------------------- Muestra la hora local --------------------------------//
const d= new Date()
let hora = d.getHours()
let now = new Date()
let localTimeString = now.toLocaleTimeString()
console.log(localTimeString)
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const dia = new Date();
let day = weekday[dia.getDay()];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const m = new Date();
let month = months[m.getMonth()];
const numero = new Date()
let num = numero.getDate()
const año = new Date()
let anio = año.getFullYear()
const numdia = new Date()
let dias = numdia.getDay()
let fecha = anio+"-"+month+"-"+num
console.log(fecha)
function getweek(date){
    var onejan = new Date (date.getFullYear(),0,1)
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7)
}
//------------------------------ Muestra numero de semana ----------------------//
var date = new Date(fecha);
let semana = getweek(date);
console.log('Semana:',semana);

const fechaActual = new Date()
const diaSemana = fechaActual.getDay()
async function loadmodel() {
    await model.loadModelAsync('../segmentacion/P1/model.json') //C:\Users\gdl3_mds\Documents\katana\modelm\New folder
    await model2.loadModelAsync('../segmentacion/P2/model.json')
    await model3.loadModelAsync('../segmentacion/P3/model.json')
    await model4.loadModelAsync('../clasificacion/P1/model.json')
    await model5.loadModelAsync('../clasificacion/P2/model.json')
    await model6.loadModelAsync('../clasificacion/P3/model.json')
}
loadmodel()
const socket = io();

socket.on('Sequence_start', function (infoplc) {
    console.log('ya entre')
        serial = infoplc.toString().substr(14,15)
        serialNumberModify.textContent  = 'SN: '+infoplc.toString().substr(0,29)
        Sequence()//Activa bandera para continuar
});

function plc_response(boxpoint,boxpointcalis,resultadofinal) { //El Array boxpoint guarda la equivalencia del punto, cuando vale pass o cuando vale fail
    return new Promise(async resolve => {
        logarray = 
        "\n"+
        "Espada 1" + " = " + boxpoint[1] + " --> " + `${boxpoint[1] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 2" + " = " + boxpoint[2] + " --> " + `${boxpoint[2] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 3" + " = " + boxpoint[3] + " --> " + `${boxpoint[3] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 4" + " = " + boxpoint[4] + " --> " + `${boxpoint[4] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 5" + " = " + boxpoint[5] + " --> " + `${boxpoint[5] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 6" + " = " + boxpoint[6] + " --> " + `${boxpoint[6] == 0 ? 'Fail' :'Pass'}` + "\n" + ""
        
        boxpointcalis =
        "&" + pass1+ "&" + 
         boxpoint[1] + "$" + "NA" + "&" + bladeA[1] + "&" + "1011" + "&" +
         boxpoint[2] + "$" + "NA" + "&" + bladeA[2] + "&" + "1012" + "&" +
         boxpoint[3] + "$" + "NA" + "&" + bladeA[3] + "&" + "2011" + "&" +
         boxpoint[4] + "$" + "NA" + "&" + bladeA[4] + "&" + "2012" + "&" +
         boxpoint[5] + "$" + "NA" + "&" + bladeA[5] + "&" + "3011" + "&" +
         boxpoint[6] + "$" + "NA" + "&" + bladeA[6] + "&" + "3012"

        boxpoint =
            "&P3011" + "," + boxpoint[1] +
            "&P3012" + "," + boxpoint[2] +
            "&P2011" + "," + boxpoint[3] +
            "&P2012" + "," + boxpoint[4] +
            "&P1011" + "," + boxpoint[5] +
            "P1012" + "," + boxpoint[6] + "#"
       
        //Blade1 hace referencia a la evaluacion de ambos conectores
    
        console.log("Calis de nueva cadena: ", boxpointcalis)
        logsaving(boxpoint)
        socket.emit('plc_response', boxpointcalis)
        resolve('resolved')
    })
}

function plc_response2(responsevalue){
    return new Promise(async resolve => {
        console.log(responsevalue)
        socket.emit('plc_response2', responsevalue)
        resolve('resolved')
    })
}
currentProcess.textContent  = 'Waiting for unit'


async function Sequence() {
        currentProcess.textContent  = 'Capturing images'
        boxpoint = [] // Reinicia valor para retrabajar punto
        

    for (point = 0; point < 3; point++){    
        
        await open_cam(point)
        await captureimage(point)
        await stopcam()
    }
    socket.emit('plc_response', 'finish#')
    for (point = 0; point < 3; point++) {
        currentProcess.textContent  = 'Processing point '+(point+1)
        await URIimage(fullimage, 3,0,point)
        await predict1(point)
        await recorta(point)
        
    } // Cierre de for puntos
    
    await evaluaArray() // funcion se coloca fuera de for para evaluar toda la cadena
    eval2puntos()
    //await plc_response(boxpoint)
    
    if(resultado == true){
        //renombra(serial)
    }
    setTimeout(function fire() { location.reload() }, 1000);// temporizador para limpiar pantalla
}

//************************************************************************************** Funciones de procesamiento de imagenes */
async function recorta(point) { // Recorte de canvas 
    return new Promise(async resolve => {
        let canvas=[recortito,recortito1,recortito2,recortito3,recortito4,recortito5]
        let canvasctx=[recortitoctx,recortitoctx1,recortitoctx2,recortitoctx3,recortitoctx4,recortitoctx5]
        let fullimageA=[fullimage,fullimage1,fullimage2]
        let coord=[coord1,coord2,coord3]
        
            canvasctx[point*2].drawImage(fullimageA[point], coord[point][0], coord[point][1], coord[point][2], coord[point][3], 0, 0, canvas[point*2].width, canvas[point*2].height) // coordenada y tamaño de recorte en el canvas 
            canvasctx[point*2+1].drawImage(fullimageA[point], coord[point][4], coord[point][5], coord[point][6], coord[point][7], 0, 0, canvas[point*2+1].width, canvas[point*2+1].height)
            
            await mlinspector(canvas[point*2],coord1[0],point)
            await URIimage(canvas[point*2], point, statusf,point)
            allpoints(point*2+1, statusf)
            await mlinspector(canvas[point*2+1],coord1[4],point)
            await URIimage(canvas[point*2+1], point, statusf,point)
            allpoints(point*2+2, statusf)
            await snapshot(serial, point,fullimageA[point])
        resolve('resolved')
    })
}




//************************************************************************************** Funciones para localizar los Arrays*/
function allpoints(pot, statusl) {
    boxpoint[pot] = statusl// Array guarda el valor de cada punto analizado 
    console.log("boxpoint de allpoints: ",boxpoint)
}
function eval2puntos(){
    boxpoint.forEach((blade,ind) => {
        console.log(boxpoint)
        if(blade==1){
            bladeA[ind]="PASS"
        }
        else{
            bladeA[ind]="FAIL"
        }
    })
}

async function evaluaArray() {
    return new Promise(async resolve => {
        let resultadofinal = boxpoint.some((e) => e == "0")
        var indices = [];
        var idx = boxpoint.indexOf(0);
        while (idx != -1) {
            indices.push(idx-1);
            idx = boxpoint.indexOf(0, idx + 1);
          }
        if (resultadofinal == false) {
            //document.getElementById('tarjeta').style.background = '#00ff40'
            pass1 = 1
            plc_response2(pass1)

        } 
        else {
            //document.getElementById('tarjeta').style.background = '#cf010b'
             pass1 = 0
            plc_response2(pass1)
 
        }
        resultado = resultadofinal
        resolve('resolved')
    }) // fin de promesa
}
let calis = new Image()// Variable utilizada por switchpic
async function open_cam(point) {// Resolve de 2 segundos
    return new Promise(async resolve => {
        let camid
        if (point == 0) { camid = "d7cfeaea74f015e18666c4419cf4c23c946c463aeb966ffb3ae769b03723bdaf" } // Camara 30
        if (point == 1) { camid = "2740fd410195e46374e9addf5c4ffde7162a8a0232d4da811af03458c1e1373a" } // Camara 10
        if (point == 2) { camid = "4a771ff88e10d858d8f0298f0489eb2d19f262bb90ff066a3f4412fc935c7f97" } // Camara 20
        const vgaConstraints = {
            video: {
                width: { ideal: 1080 },
                "frameRate": 30,
                "resizeMode": "crop-and-scale",
                deviceId: camid
            }
        }
        let objetomedia = navigator.mediaDevices.getUserMedia(vgaConstraints)

        await objetomedia.then((stream) => { video.srcObject = stream }).catch(function (err) { 
            console.log(err.name)
            //location.reload()
        })
        setTimeout(function fire() { resolve('resolved'); }, 400)
   
})
}
async function captureimage(point) {// Resolve de 2 segundos
    return new Promise(async resolve => {
    switch(point){
        case 0:
            fullimagectx.drawImage(video, 0, 0, fullimage.width, fullimage.height);
            break
        case 1:
            fullimagectx1.drawImage(video, 0, 0, fullimage1.width, fullimage1.height);
            break
        case 2:
            fullimagectx2.drawImage(video, 0, 0, fullimage2.width, fullimage2.height);
            break
        }
        //var dataURI = canvas.toDataURL('image/jpeg');
        setTimeout(function fire(){resolve('resolved');},500);//Temporal para programacion de secuencia
        resolve('resolved')
    });
}
function mapcams() { // Mapeo de camaras para identificarlas 
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === 'videoinput');
            console.log('Cameras found', filtered);
        });
}
function stopcam() {
    return new Promise(async resolve => {
        const video = document.querySelector('video');
        if(video && video.srcObject){
            const mediaStream = video.srcObject;
            const tracks = mediaStream.getTracks();
            console.log(tracks);
            tracks.forEach(track => track.stop());
        } else {
          console.log("Camara no encontrada");
        }
    
        setTimeout(() => resolve('resolved'), 300);
      });
    }
function snapshot(snr,point,canva){
    console.log(canva)
    var uri = canva.toDataURL('image/jpeg');
     const socket = io();
     socket.emit('picsaving2',uri,snr,point);	
}

function renombra(serial){   
socket.emit('renombrasnr',serial);	
}
async function logsaving(logarray,serial){
    return new Promise(async resolve => {
        console.log("Contenido del array:", logarray)
        console.log("entre al log")
       // socket.emit('logsaving',logarray,serial);
        resolve('resolved')
    });
}
async function predict1(point) {
    let modelSegmentacionA= [model,model2,model3]
    let input_size = model.input_size
    switch(point){
        case 0:
        imagen = tf.browser.fromPixels(fullimage, 3)
        break
        case 1:
        imagen = tf.browser.fromPixels(fullimage1, 3)
        break
        case 2:
        imagen = tf.browser.fromPixels(fullimage2, 3)
        break
    }
    imagen = tf.image.resizeBilinear(imagen.expandDims(), [input_size, input_size])
    let predictions = await modelSegmentacionA[point].executeAsync(imagen)
    await highlightResults(predictions, point) //espera a esta funcion para verificar si tiene corto o no

}
let criterio = 0.000001
async function highlightResults(predictions, punto) {
   
    for (let n = 0; n < predictions[0].length; n++) {

       
        if (predictions[1][n] > criterio) {
           console.log(predictions[1])
            bboxLeft = (predictions[0][n][0] * fullimage.width)
            bboxTop = (predictions[0][n][1] * fullimage.height) 
            bboxWidth = (predictions[0][n][2] * fullimage.width) - bboxLeft
            bboxHeight = (predictions[0][n][3] * fullimage.height) - bboxTop
        if (punto == 0) {
            coord1.push(bboxLeft)
            coord1.push(bboxTop)
            coord1.push(bboxWidth)
            coord1.push(bboxHeight)
            }
        else if (punto == 1) {
            coord2.push(bboxLeft)
            coord2.push(bboxTop)
            coord2.push(bboxWidth)
            coord2.push(bboxHeight)
            }
        else {
            coord3.push(bboxLeft)
            coord3.push(bboxTop)
            coord3.push(bboxWidth)
            coord3.push(bboxHeight)
            }
        }
    }
}
async function URIimage(cut, photo, status,point) {
    var dataURI = cut.toDataURL('image/jpeg')
    var valor = parseInt(Math.random() * (100 ** 10))
    socket.emit('picsaving', dataURI, valor, photo, status); //se llama la funcion savepic con los 3 parametros (conversion de imagen, numero de serial declarado previamente y samples que sera el point)
}
async function mlinspector(cut,array,pot) {
return new Promise(async resolve => { // inicio de promesa 
    let modelSegmentacionA= [model4,model5,model6]
    result = await modelSegmentacionA[pot].executeAsync(cut)
    falla = result[0][1]
    pasa = result[0][0]
    if (pasa >= falla&&array!=null){ //Evalua el valor en la posicion 0 que da la redneuronal
        statusf = 1;
    }
    else {
        statusf = 0;
    }
    resolve('resolved')
    })
}