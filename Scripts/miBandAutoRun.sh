#!/bin/bash
COMMON="/home/pi/Desktop/VitaBox"
OUTLOGFILE="$COMMON/Scripts/mibandstdout.log"
ERRLOGFILE="$COMMON/Scripts/mibandstderr.log"
rm "$OUTLOGFILE"
rm "$ERRLOGFILE"
cd /home/pi/Desktop/VitaBox
sudo node startAutoMiBand.js >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"