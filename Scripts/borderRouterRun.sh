#!/bin/bash
COMMON="/home/pi/Desktop/VitaBox"
OUTLOGFILE="$COMMON/Scripts/stdoutBorder.log"
ERRLOGFILE="$COMMON/Scripts/stderrBorder.log"
rm OUTLOGFILE 2> /dev/null
rm ERRLOGFILE 2> /dev/null
cd "$COMMON/contiki-ng/examples/rpl-border-router/"
make TARGET=zoul savetarget >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"
make connect-router >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"