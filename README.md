# GDS

GDS practice

## Pre-requisites

The following needs to be installed:

- git - https://git-scm.com/download/win
- npm - https://nodejs.org/en/download/
  - Confirm node is installed (`node -v` and `npm -v`)
- Visual Studio Code (https://code.visualstudio.com/download)

<br>

## zScaler Certificate

Due to the way Zscaler SSL inspection works, we need to add the custom root certificates to certain applications (as they do not use the default store)

- [CGI ZScaler FAQ](https://intranet.ent.cgi.com/browse/cio/global/Documents/CGI-SASE_Wave1-FAQ_EN.pdf)
- [Link to certificate](https://groupecgi.sharepoint.com/:u:/r/teams/com0000000109/Shared%20Documents/DWI%20Access%20SASE/Zscaler/ZscalerRootCertificate-DER-CRT-PEM%203.zip?csf=1&web=1&e=D0MKot)

Download the certificate and save it to your computer

### git

Download the certificate bundle in PEM format and move the bundle to global appdata using the following commands:

Change the `<Path to Certificate>` to reference where you saved the file

```
cp <Path to Certificate>/ZscalerRootCertificate-2048-SHA256.pem $env:APPDATA
git config --global http.sslcainfo $env:APPDATA\ZscalerRootCertificate-2048-SHA256.pem
```

### npm

If you have trouble running any of the npm commands, set the `cafile` config option

```
npm config set cafile c:\zscaler\ZscalerRootCertificate-2048-SHA256.pem
```
