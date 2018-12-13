#!/bin/bash
COMMON="/home/pi/Desktop/VitaBox"
OUTLOGFILE="$COMMON/logs/mibandstdout.log"
ERRLOGFILE="$COMMON/logs/mibandstderr.log"
rm "$OUTLOGFILE"
rm "$ERRLOGFILE"
cd /home/pi/Desktop/VitaBox
sudo NODE_ENV=prod node startAutoMiBand.js >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"