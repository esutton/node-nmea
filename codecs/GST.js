var helpers = require("../helpers.js")

exports.ID = 'GST';
exports.TYPE = 'error-stats';

/*
Added by: Ed Sutton

http://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_GST.html

$GPGST,172814.0,0.006,0.023,0.020,273.6,0.023,0.020,0.031*6A
                                                 
       1         2   3 4 5   6 7 89 
       |         |   | | |   | | || 
$--GST,hhmmss.ss,x.x,M,M,x.x,M,M,M*6A
 1) Time (UTC)
 2) RMS value of the pseudorange residuals 
 3) Error ellipse semi-major axis 1 sigma error, in meters
 4) Error ellipse semi-minor axis 1 sigma error, in meters
 5) Error ellipse orientation, degrees from true north,
 6) Latitude 1 sigma error, in meters
 7) Longitude 1 sigma error, in meters
 8) Height 1 sigma error, in meters
 9) The checksum data, always begins with *
*/

exports.decode = function(fields) {
  return {
    sentence: exports.ID,
    type: exports.TYPE,
    timestamp: fields[1],
    rms: fields[2],
    semiMajorAxis1SigmaErrorMeters: fields[3],
    semiMinorAxis1SigmaErrorMeters: fields[4],
    errorDegrees: fields[5],
    lat1SigmaErrorMeters: FIX_TYPE[+fields[6]],
    lon1SigmaErrorMeters: +fields[7],
    height1SigmaErrorMeters: +fields[8],
  };
}

exports.encode = function (talker, msg) {
  var result = ['$' + talker + exports.ID];
  result.push(helpers.encodeTime(msg.timestamp));

  result.push(msg.rms);
  result.push(msg.semiMajorAxis1SigmaErrorMeters);
  result.push(msg.semiMinorAxis1SigmaErrorMeters);
  result.push(msg.errorDegrees);
  result.push(msg.lat1SigmaErrorMeters);
  result.push(msg.lon1SigmaErrorMeters);
  result.push(msg.height1SigmaErrorMeters);

  var resultMsg = result.join(',');
  return resultMsg + helpers.computeChecksum(resultMsg);
}
