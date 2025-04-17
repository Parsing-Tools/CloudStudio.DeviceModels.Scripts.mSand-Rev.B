function parseUplink(device, payload) {
    // This function allows you to parse the received payload, and store the 
    // data in the respective endpoints. Learn more at https://wiki.cloud.studio/page/200

    // The parameters in this function are:
    // - device: object representing the device that produced the payload. 
    //   You can use "device.endpoints" to access the collection 
    //   of endpoints contained within the device. More information
    //   at https://wiki.cloud.studio/page/205
    // - payload: object containing the payload received from the device. More
    //   information at https://wiki.cloud.studio/page/208.

    // This example is written assuming a temperature and humidity sensor that 
    // sends a binary payload with temperature in the first byte, humidity 
    // in the second byte, and battery percentage in the third byte.

    /*  
        // Payload is binary, so it's easier to handle as an array of bytes
        var bytes = payload.asBytes();
    	
        // Verify payload contains exactly 3 bytes
        if (bytes.length != 3)
            return;
    
        // Parse and store temperature
        var temperatureSensor = device.endpoints.byType(endpointType.temperatureSensor);
        if (temperatureSensor != null)
        {
            var temperature = bytes[0] & 0x7f;
            if (bytes[0] & 0x80)  // Negative temperature?
                temperature -= 128;
            temperatureSensor.updateTemperatureSensorStatus(temperature);
        }
    
        // Parse and store humidity
        var humiditySensor = device.endpoints.byType(endpointType.humiditySensor);
        if (humiditySensor != null)
        {
            var humidity = bytes[1];
            humiditySensor.updateHumiditySensorStatus(humidity);
        }	  
    	
        // Parse and store battery percentage
        var batteryPercentage = bytes[2];
        device.updateDeviceBattery({ percentage: batteryPercentage });
    */

}

function buildDownlink(device, endpoint, command, payload) {
    payload.buildResult = downlinkBuildResult.ok;



    //reemplazar las variables por los datos enviados por el metodo downlink
    let address = endpoint.address;
    let value = command.management.setValue.newValue;

    let condicion1 = address == "DPT1_TEST";
    let condicion2 = address.slice(0, -1) == "DPT1_SS";
    let condicion3 = address == "TESTSEAT";
    let condicion4 = address == "VT";
    let condicion5 = address.slice(0, -1) == "DHP_SS";
    let condicion6 = address.slice(0, -1) == "TBD_SS";
    let condicion7 = address.slice(0, -1) == "HIPT3_SS";
    let condicion8 = address.slice(0, -1) == "H_HIPT3_SS";
    let condicion9 = address.slice(0, -1) == "TTD_SS";
    let condicion10 = address.slice(0, -1) == "DPT3PT2_SS";
    let condicion11 = address.slice(0, -1) == "S_ENABLED_SS";
    let condicion12 = address == "S_AUTO_SEAT_TEST";
    let condicion13 = address.slice(0, -1) == "S_TBD_SS";
    let condicion14 = address.slice(0, -1) == "S_HIPT3_SS";
    let condicion15 = address.slice(0, -1) == "S_PDC_SS";
    let condicion16 = address.slice(0, -1) == "TTD_SS";

    //valido datos
    if ((condicion1 || condicion2) && (value< 0 || value> 100)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion3) && (value < 1 || value > 100)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion4) && (value < 1 || value > 120)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion5) && (value < 1 || value > 60)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion6) && (value < 5 || value > 10000)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion7 || condicion8) && (value < 5 || value> 3600)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion9) && (value < 5 || value > 3600)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion10) && (value < 5 || value > 5000)) payload.buildResult = downlinkBuildResult.unsupported;
    if ((condicion11 || condicion12 || condicion13 || condicion14 || condicion15 || condicion16) && (value < 0 || value > 1)) payload.buildResult = downlinkBuildResult.unsupported;

    //genero el payload MQTT par el telecomando
    var obj = `{
                        "method":"sendTelemeter",
                        "params":{
                            "$__ENDPOINT": $__VALUE
                        }
                        }`;

    //reemplazo los valores de endpoint y valor 
    obj = obj.replace("$__ENDPOINT", address);
    obj = obj.replace("$__VALUE", value);

    //convierto obj a JSON
    var jsonAsString = JSON.parse(obj);

    payload.setAsJsonObject(jsonAsString);

    switch (command.type) {
        case commandType.management:
            switch (command.management.type) {
                case managementCommandType.setValue:

                    //payload.setAsJsonObject({ "entro": 5 });
                    payload.setAsJsonObject(jsonAsString);
                    break;

                default:
                    //payload.setAsJsonObject({ "entro": "default" });
                    payload.buildResult = downlinkBuildResult.unsupported;
                    break;
            }
            break;
        default:
            //payload.setAsJsonObject({ "entro": "no entro a command.type: " + command.type + " - " + command.management.type });
            payload.buildResult = downlinkBuildResult.unsupported;
            break;
    }

}