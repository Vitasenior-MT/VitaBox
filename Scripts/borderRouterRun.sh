#!/bin/bash
make TARGET=zoul --directory ./../contiki-ng/examples/rpl-border-router/ savetarget
make --directory ./../contiki-ng/examples/rpl-border-router/ connect-router > stdoutBorder.log 2> stderrBorder.log