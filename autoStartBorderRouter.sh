#!/bin/bash

make TARGET=zoul --directory /home/pi/contiki-ng/examples/rpl-border-router/ savetarget
make --directory /home/pi/contiki-ng/examples/rpl-border-router/ connect-router

# git clone https://github.com/contiki-os/contiki.git
# cd contiki/examples/ipv6/rpl-border-router
# make TARGET=zoul savetarget
# make border-router.upload && make connect-router