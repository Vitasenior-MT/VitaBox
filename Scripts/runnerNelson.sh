#!/bin/bash
mkdir -p /generatedLogs/;
mkdir -p /generatedPlots/;
for((i=1;i<"$#"+1;i++));
do
sh ./whatcherA.sh "${!i}" 10 &
done
sh ./whatcherB.sh 10 &
sh ./whatcherC.sh 10 &
echo "Now  `date`"
sleep 300

# start logs
# ./runnerNelson.sh mongod chromium nodejs
