#!/bin/bash
OUTLOGFILE="FOLDERVITABOX/logs/stdoutBorder.log"
ERRLOGFILE="FOLDERVITABOX/logs/stderrBorder.log"
# rm "$OUTLOGFILE"
# rm "$ERRLOGFILE"
cd "FOLDERROOT/contiki-ng/examples/rpl-border-router/"
make TARGET=zoul savetarget >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"
make connect-router >> "$OUTLOGFILE" 2>> "$ERRLOGFILE"