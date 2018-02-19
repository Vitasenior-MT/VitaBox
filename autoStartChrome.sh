#!/bin/bash
/usr/bin/chromium-browser \
--0 \
--noerordialogs \
--disable-notifications \
--disable-device-discovery-notifications \
--no-managed-user-acknowledgment-check \
--ash-disable-smooth-screen-rotation \
--ash-disable-touch-exploration-mode \
--disable-session-crashed-bubble \
--disable-infobars \
--kiosk \
--aggressive-cache-discard \
--disk-cache-size=1 \
--allow-file-access-from-files \
--enable-speech-dispatcher \
--media-cache-size=1 \
--disable-translate \
--incognito \
"http://localhost:8088"

##Commands to run
#cd /home/pi/.config/lxsession/LXDE-pi/
#sudo nano autostart
##On the last line add
#@sh /home/pi/Desktop/VitaBox/autoStartChrome.sh
#sed -i -e 's/\r$//' autoStartChrome.sh in case the Windows carries the two-character sequence CR LF.