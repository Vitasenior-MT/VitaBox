#!/bin/bash
COMMON="/home/pi/Desktop/VitaBox"
OUTLOGFILE="$COMMON/Scripts/mibandstdout.log"
ERRLOGFILE="$COMMON/Scripts/mibandstderr.log"
rm "$OUTLOGFILE"
rm "$ERRLOGFILE"
cd /home/pi/Desktop/VitaBox
sudo NODE_ENV=prod node startAutoMiBand.js >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"